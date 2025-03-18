import { NextResponse } from 'next/server';
import { z } from 'zod';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { auth } from '@/app/(auth)/auth';
import { db } from '@/lib/db';
import { document } from '@/lib/db/schema';

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    .refine((file) => [
      'text/plain',
      'application/rtf',
      'text/markdown',
      'application/pdf',
      'application/json',
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.type), {
      message: 'File type should be a text document (TXT, RTF, MD, PDF, JSON, CSV, DOC, DOCX)',
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get('file') as File).name;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(join(uploadsDir, filename), fileBuffer);
    } catch (error) {
      // If directory doesn't exist, create it and try again
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await writeFile(join(process.cwd(), 'public', 'uploads', filename), fileBuffer, { flag: 'wx' });
      } else {
        throw error;
      }
    }

    // Store file info in database
    const fileUrl = `/uploads/${filename}`;
    const content = await file.text();

    const [newDocument] = await db
      .insert(document)
      .values({
        title: filename,
        content: content,
        kind: 'text' as const,
        userId: session.user.id,
        createdAt: new Date()
      })
      .returning();

    return NextResponse.json({
      url: fileUrl,
      pathname: filename,
      contentType: file.type,
      documentId: newDocument.id
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 },
    );
  }
}
