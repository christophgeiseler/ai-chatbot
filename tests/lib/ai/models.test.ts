import { Message } from 'ai';
import { getResponseChunksByPrompt } from '@/tests/prompts/utils';

// Mock stream response for testing
export async function mockStreamResponse(prompt: Message[]) {
  const chunks = getResponseChunksByPrompt(prompt);
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

describe('Language Models', () => {
  it('should stream response', async () => {
    const prompt: Message = {
      role: 'user',
      content: 'Why is the sky blue?',
      id: 'test-id',
    };

    const stream = await mockStreamResponse([prompt]);
    const reader = stream.getReader();

    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toEqual({ type: 'text-delta', textDelta: "It's just blue duh!" });
    expect(chunks[1]).toEqual({
      type: 'finish',
      finishReason: 'stop',
      logprobs: undefined,
      usage: { completionTokens: 10, promptTokens: 3 },
    });
  });
}); 