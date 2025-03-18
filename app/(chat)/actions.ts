'use server';

import { Message } from 'ai';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';
import { createChatCompletion } from '@/lib/ai/providers';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const completion = await createChatCompletion([
    {
      id: uuidv4(),
      role: 'system',
      content: `Generate a short title based on the first message a user begins a conversation with.
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`
    },
    {
      id: uuidv4(),
      role: 'user',
      content: message.content
    }
  ], 'gpt-4-turbo-preview');

  let title = '';
  for await (const chunk of completion) {
    if (chunk.choices[0]?.delta?.content) {
      title += chunk.choices[0].delta.content;
    }
  }

  return title.trim();
}

export async function deleteTrailingMessages({
  id,
}: {
  id: string;
}) {
  const messages = await getMessageById({ id });
  const message = messages[0]; // Get the first message from the array

  if (!message) {
    throw new Error('Message not found');
  }

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  id,
  visibility,
}: {
  id: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({
    chatId: id,
    visibility,
  });
}
