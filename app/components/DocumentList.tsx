import { useEffect, useState } from 'react';
import { Document } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());

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
        setError(err instanceof Error ? err.message : 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  const toggleDocument = (docId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading documents...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  if (documents.length === 0) {
    return <div className="text-sm text-gray-500">No documents uploaded yet</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Uploaded Documents</h3>
      <div className="text-xs text-gray-500 mb-2">
        Select documents to include in the chat context
      </div>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <FileText className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <p className="font-medium">{doc.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant={selectedDocuments.has(doc.id) ? "secondary" : "outline"}
              size="sm"
              onClick={() => toggleDocument(doc.id)}
            >
              {selectedDocuments.has(doc.id) ? 'Selected' : 'Select'}
            </Button>
          </li>
        ))}
      </ul>
      {selectedDocuments.size > 0 && (
        <div className="text-xs text-gray-500 mt-2">
          {selectedDocuments.size} document{selectedDocuments.size !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
} 