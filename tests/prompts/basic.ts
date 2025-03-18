import { Message } from 'ai';

export const TEST_PROMPTS: Record<string, Message> = {
  USER_SKY: {
    role: 'user',
    content: 'Why is the sky blue?',
    id: 'sky-1',
  },
  USER_GRASS: {
    role: 'user',
    content: 'Why is grass green?',
    id: 'grass-1',
  },
  USER_THANKS: {
    role: 'user',
    content: 'Thanks!',
    id: 'thanks-1',
  },
  USER_NEXTJS: {
    role: 'user',
    content: 'What are the advantages of using Next.js?',
    id: 'nextjs-1',
  },
  USER_IMAGE_ATTACHMENT: {
    role: 'user',
    content: 'Who painted this?',
    id: 'image-1',
  },
  USER_TEXT_ARTIFACT: {
    role: 'user',
    content: 'Help me write an essay about Silicon Valley',
    id: 'essay-1',
  },
  CREATE_DOCUMENT_TEXT_CALL: {
    role: 'user',
    content: 'Essay about Silicon Valley',
    id: 'essay-2',
  },
  CREATE_DOCUMENT_TEXT_RESULT: {
    role: 'assistant',
    content: 'A document was created and is now visible to the user.',
    id: 'essay-3',
  },
  GET_WEATHER_CALL: {
    role: 'user',
    content: "What's the weather in sf?",
    id: 'weather-1',
  },
  GET_WEATHER_RESULT: {
    role: 'assistant',
    content: 'The current temperature in San Francisco is 17°C.',
    id: 'weather-2',
  },
};
