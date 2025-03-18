'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { toast } from '@/components/toast';
import { uploadFile } from './actions';

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadFile(formData);
      
      setUploadedFile(file);
      setFileUrl(result.url);
      setFileContent(result.content);

      toast({
        type: 'success',
        description: `File "${file.name}" uploaded successfully!`,
      });
    } catch (error) {
      toast({
        type: 'error',
        description: 'Failed to upload file. Please try again.',
      });
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">File Upload</h1>
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <FileUpload 
            onUpload={handleUpload} 
            accept={{
              'text/plain': ['.txt']
            }}
          />
          
          {uploadedFile && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Uploaded File:</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Name: {uploadedFile.name}
                <br />
                Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                <br />
                Type: {uploadedFile.type}
                {fileUrl && (
                  <>
                    <br />
                    URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View File</a>
                  </>
                )}
              </p>
              {fileContent && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">File Content:</h3>
                  <pre className="text-sm bg-white dark:bg-zinc-800 p-4 rounded-lg overflow-auto max-h-60">
                    {fileContent}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 