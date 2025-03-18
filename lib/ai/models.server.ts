'use server';

import { Message } from 'ai';
import { openai, testClients } from './openai-client';
import { isTestEnvironment } from '../constants';

export async function getChatModel() {
  return isTestEnvironment ? testClients.chatModel : openai;
}

export async function getReasoningModel() {
  return isTestEnvironment ? testClients.reasoningModel : openai;
}

export async function getTitleModel() {
  return isTestEnvironment ? testClients.titleModel : openai;
}

export async function getArtifactModel() {
  return isTestEnvironment ? testClients.artifactModel : openai;
}

export async function createChatCompletion(messages: Message[], model = 'gpt-4-turbo-preview') {
  const chatModel = await getChatModel();
  return chatModel.chat.completions.create({
    model,
    messages: messages.map(msg => {
      // Convert special roles to standard OpenAI roles
      const role = msg.role === 'data' || msg.role === 'tool' ? 'user' : 
                  msg.role === 'function' ? 'assistant' : msg.role;
      
      return {
        role,
        content: msg.content,
      };
    }),
    stream: true,
  });
}

export async function createImage(prompt: string) {
  const chatModel = await getChatModel();
  return chatModel.images.generate({
    prompt,
    model: 'dall-e-3',
    n: 1,
    size: '1024x1024',
  });
} 