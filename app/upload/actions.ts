'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { document } from '@/lib/db/schema';
import { auth } from '@/app/(auth)/auth';

export async function uploadFile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      contentType: 'text/plain'
    });

    // Process file content
    const content = await file.text();

    // Store in database
    const [newDocument] = await db
      .insert(document)
      .values({
        title: file.name,
        content: content,
        kind: 'text',
        userId: session.user.id,
        createdAt: new Date()
      })
      .returning();

    revalidatePath('/upload');
    revalidatePath('/');
    return { 
      success: true, 
      url: blob.url, 
      content,
      documentId: newDocument.id 
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
} 