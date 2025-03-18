'use client';

import { useEffect, useState } from 'react';
import { Document, DocumentListProps } from '@/lib/types';
import { Checkbox } from './ui/checkbox';

export function DocumentList({ onDocumentsSelected, selectedDocuments }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  const handleDocumentToggle = (document: Document) => {
    const isSelected = selectedDocuments.some(d => d.id === document.id);
    if (isSelected) {
      onDocumentsSelected(selectedDocuments.filter(d => d.id !== document.id));
    } else {
      onDocumentsSelected([...selectedDocuments, document]);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading documents...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  if (documents.length === 0) {
    return <div className="text-sm text-gray-500">No documents available</div>;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">Reference Documents</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
          >
            <Checkbox
              id={`document-${document.id}`}
              checked={selectedDocuments.some(d => d.id === document.id)}
              onCheckedChange={() => handleDocumentToggle(document)}
            />
            <label
              htmlFor={`document-${document.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {document.title}
            </label>
          </div>
        ))}
      </div>
      {selectedDocuments.length > 0 && (
        <div className="text-sm text-gray-500">
          {selectedDocuments.length} document{selectedDocuments.length === 1 ? '' : 's'} selected
        </div>
      )}
    </div>
  );
} 