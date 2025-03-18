import { OpenAI } from 'openai';

// Create OpenAI client for production
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create test clients
export const testClients = {
  chatModel: new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'test-key',
    baseURL: process.env.OPENAI_API_BASE_URL,
  }),
  reasoningModel: new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'test-key',
    baseURL: process.env.OPENAI_API_BASE_URL,
  }),
  titleModel: new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'test-key',
    baseURL: process.env.OPENAI_API_BASE_URL,
  }),
  artifactModel: new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'test-key',
    baseURL: process.env.OPENAI_API_BASE_URL,
  }),
}; 