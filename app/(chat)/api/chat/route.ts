import { auth } from '@/app/(auth)/auth';
import { Message } from 'ai';
import { createChatCompletion } from '@/lib/ai/providers';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Get the response from our AI provider (already wrapped in StreamingTextResponse)
    return await createChatCompletion(messages);
  } catch (error) {
    console.error('Error in chat completion:', error);
    return new Response('Error processing your request', { status: 500 });
  }
} 