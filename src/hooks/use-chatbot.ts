'use client';

import { useState, useCallback } from 'react';

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    openChatbot,
    closeChatbot,
    toggleChatbot,
  };
}
