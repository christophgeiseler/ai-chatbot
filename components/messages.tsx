import type { Message } from 'ai';

interface MessagesProps {
  chatId: string;
  messages: Message[];
  isReadonly: boolean;
}

export function Messages({
  chatId,
  messages,
  isReadonly,
}: MessagesProps) {
  return (
    <div className="mx-auto max-w-3xl pt-6 space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`p-4 rounded ${
            message.role === 'assistant' 
              ? 'bg-gray-100' 
              : 'bg-blue-50'
          }`}
        >
          <p className="text-sm font-semibold mb-2">
            {message.role === 'assistant' ? 'AI' : 'You'}
          </p>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      ))}
    </div>
  );
}
