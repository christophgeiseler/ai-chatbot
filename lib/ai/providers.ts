'use server';

import { Message, StreamingTextResponse } from 'ai';
import { createChatCompletion as createChatCompletionServer, createImage as createImageServer } from './models.server';

export async function createChatCompletion(messages: Message[], model = 'gpt-4-turbo-preview') {
  const response = await createChatCompletionServer(messages, model);
  
  // Convert the OpenAI stream to a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}

export async function createImage(prompt: string) {
  return createImageServer(prompt);
}
