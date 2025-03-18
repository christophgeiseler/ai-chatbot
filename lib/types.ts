export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentListProps {
  onDocumentsSelected: (documents: Document[]) => void;
  selectedDocuments: Document[];
} 