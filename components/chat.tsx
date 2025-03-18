'use client';

import { useChat } from 'ai/react';
import { Messages } from './messages';
import { ChatHeader } from './chat-header';
import { useState } from 'react';
import { DocumentList } from './document-list';
import { Document } from '@/lib/types';

interface ChatProps {
  id: string;
  isReadonly?: boolean;
}

export function Chat({ id, isReadonly = false }: ChatProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit } = useChat({
    api: '/api/chat',
    id,
    body: {
      selectedDocuments,
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        chatId={id}
        selectedModelId="gpt-4"
        selectedVisibilityType="private"
        isReadonly={isReadonly}
      />
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          <Messages
            chatId={id}
            messages={messages}
            isReadonly={isReadonly}
          />
        </div>
        {!isReadonly && (
          <>
            <div className="border-t p-4">
              <DocumentList 
                onDocumentsSelected={setSelectedDocuments}
                selectedDocuments={selectedDocuments}
              />
            </div>
            <form onSubmit={handleSubmit} className="flex p-4 border-t">
              <input
                className="flex-1 p-2 border rounded-l"
                value={input}
                placeholder="Type a message..."
                onChange={handleInputChange}
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
