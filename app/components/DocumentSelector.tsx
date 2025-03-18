import { useEffect, useState } from 'react';
import { Document } from '@/lib/db/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface DocumentSelectorProps {
  onSelect: (selectedIds: string[]) => void;
}

export function DocumentSelector({ onSelect }: DocumentSelectorProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    setSelectedIds(prev => {
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
    return (
      <div className="text-sm text-muted-foreground p-4">
        Loading available documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-4">
        Error: {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4">
        No documents available. Upload some files to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-foreground">
        Available Documents ({documents.length})
      </div>
      <div className="space-y-1">
        {documents.map((doc) => (
          <label
            key={doc.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
          >
            <Checkbox
              checked={selectedIds.has(doc.id)}
              onCheckedChange={() => toggleDocument(doc.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {doc.title}
              </div>
              <div className="text-xs text-muted-foreground">
                Added {new Date(doc.createdAt).toLocaleDateString()}
              </div>
              {doc.kind && (
                <div className="text-xs text-muted-foreground">
                  Type: {doc.kind}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
      {selectedIds.size > 0 && (
        <Button 
          onClick={() => onSelect(Array.from(selectedIds))}
          className="w-full"
          size="sm"
        >
          Use {selectedIds.size} selected document{selectedIds.size !== 1 ? 's' : ''}
        </Button>
      )}
    </div>
  );
} 