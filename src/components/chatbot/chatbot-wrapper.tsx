'use client';

import { Chatbot } from './chatbot';
import { useChatbot } from '@/hooks/use-chatbot';

export function ChatbotWrapper() {
  const { isOpen, toggleChatbot } = useChatbot();

  return (
    <Chatbot 
      isOpen={isOpen} 
      onToggle={toggleChatbot}
    />
  );
}
