import { auth } from '@/app/(auth)/auth';
import { Message } from 'ai';
import { createChatCompletion } from '@/lib/ai/providers';
import { Document } from '@/lib/types';
import { getWordCount } from '@/lib/utils';
import { StreamingTextResponse } from 'ai';

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

    // Check if this is a word count request
    const lastMessage = messages[messages.length - 1];
    const isWordCountRequest = lastMessage.content.toLowerCase().includes('word count') || 
                             lastMessage.content.toLowerCase().includes('count words') ||
                             lastMessage.content.toLowerCase().includes('count the words');

    if (isWordCountRequest && selectedDocuments?.length > 0) {
      // Calculate word count for each selected document
      const wordCounts = selectedDocuments.map((doc: Document) => ({
        title: doc.title,
        wordCount: getWordCount(doc.content)
      }));

      // Create a response message
      const response = wordCounts.map(({ title, wordCount }: { title: string; wordCount: number }) => 
        `"${title}": ${wordCount} words`
      ).join('\n');

      // Create a readable stream from the response
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(response));
          controller.close();
        }
      });

      // Return a streaming response
      return new StreamingTextResponse(stream);
    }

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