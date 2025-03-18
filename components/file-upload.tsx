import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export function FileUpload({ 
  onUpload, 
  maxSize = 5 * 1024 * 1024, 
  accept = {
    'text/plain': ['.txt'],
    'application/rtf': ['.rtf'],
    'text/markdown': ['.md'],
    'application/pdf': ['.pdf'],
    'application/json': ['.json'],
    'text/csv': ['.csv'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  }
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('Drop event occurred');
    console.log('Accepted files:', acceptedFiles);
    console.log('Rejected files:', rejectedFiles);
    
    if (rejectedFiles.length > 0) {
      console.log('Rejection errors:', rejectedFiles[0].errors);
      const errors = rejectedFiles[0].errors.map((err: any) => err.message).join(', ');
      setError(`File validation failed: ${errors}`);
      return;
    }

    if (acceptedFiles.length === 0) {
      setError('Please upload a valid document file');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const file = acceptedFiles[0];
      console.log('Processing file:', file.name, file.type, file.size);
      await onUpload(file);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: false,
    noClick: false,
    noKeyboard: false,
    onDropRejected: (rejectedFiles) => {
      console.log('Files rejected:', rejectedFiles);
      const errors = rejectedFiles[0].errors.map(err => err.message).join(', ');
      setError(`File rejected: ${errors}`);
    },
    onError: (err) => {
      console.error('Dropzone error:', err);
      setError('Error processing file');
    }
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? isDragReject
                ? 'This file type is not supported'
                : 'Drop the file here'
              : 'Drag and drop a document file here, or click to select'}
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: TXT, RTF, MD, PDF, JSON, CSV, DOC, DOCX (max {maxSize / (1024 * 1024)}MB)
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