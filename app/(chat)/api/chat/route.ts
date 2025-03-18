import { auth } from '@/app/(auth)/auth';
import { Message } from 'ai';
import { createChatCompletion } from '@/lib/ai/providers';
import { Document } from '@/lib/types';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Extract the messages and selectedDocuments from the body of the request
    const { messages, selectedDocuments } = await req.json();

    // Create a context message from selected documents if any
    let contextMessages: Message[] = [];
    if (selectedDocuments?.length > 0) {
      const documentsContext = selectedDocuments
        .map((doc: Document) => `Document: ${doc.title}\nContent: ${doc.content}\n---\n`)
        .join('\n');
      
      contextMessages = [
        {
          id: 'context',
          role: 'system',
          content: `Here are the relevant documents for context:\n\n${documentsContext}\n\nPlease use this information when relevant to answer the user's questions.`
        }
      ];
    }

    // Combine context messages with user messages
    const allMessages = [...contextMessages, ...messages];

    // Get the response from our AI provider (already wrapped in StreamingTextResponse)
    return await createChatCompletion(allMessages);
  } catch (error) {
    console.error('Error in chat completion:', error);
    return new Response('Error processing your request', { status: 500 });
  }
} 