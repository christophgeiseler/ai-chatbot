import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

import { Button } from './ui/button';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
}

export function FileUpload({ onUpload, maxSize = 5 * 1024 * 1024, accept = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
} }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      await onUpload(acceptedFiles[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select'}
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: PDF, TXT, DOC, DOCX (max {maxSize / (1024 * 1024)}MB)
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
} 