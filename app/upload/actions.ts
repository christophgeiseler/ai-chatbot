'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import pdfParse from 'pdf-parse';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Process file content based on type
    let content = '';
    if (file.type === 'text/plain') {
      content = await file.text();
    } else if (file.type === 'application/pdf') {
      // Convert File to ArrayBuffer for PDF processing
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdfParse(buffer);
      content = pdfData.text;
    }

    // Store file metadata and content in your database
    // This will be implemented in the next step

    revalidatePath('/upload');
    return { success: true, url: blob.url, content };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
} 