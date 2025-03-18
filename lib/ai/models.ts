import { OpenAI } from 'openai';

// Model constants and types that are safe to use on the client
export const DEFAULT_CHAT_MODEL = 'gpt-4-turbo-preview';
export const DEFAULT_REASONING_MODEL = 'gpt-4-turbo-preview';
export const DEFAULT_TITLE_MODEL = 'gpt-4-turbo-preview';
export const DEFAULT_ARTIFACT_MODEL = 'gpt-4-turbo-preview';

export type ChatModelType = typeof DEFAULT_CHAT_MODEL;
export type ReasoningModelType = typeof DEFAULT_REASONING_MODEL;
export type TitleModelType = typeof DEFAULT_TITLE_MODEL;
export type ArtifactModelType = typeof DEFAULT_ARTIFACT_MODEL;

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];

// Create OpenAI clients
export const chatModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'test-key',
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const reasoningModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'test-key',
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const titleModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'test-key',
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const artifactModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'test-key',
  baseURL: process.env.OPENAI_API_BASE_URL,
});
