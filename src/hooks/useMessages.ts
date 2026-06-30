import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { MessageNote } from '../types/messages';

const STORAGE_KEY = 'mydayplan-messages';

function loadMessages(): MessageNote[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveMessages(notes: MessageNote[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn('Failed to save messages:', e);
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function processFile(file: File) {
  const dataUrl = await fileToDataUrl(file);
  return {
    id: uuidv4(),
    type: file.type.startsWith('video') ? 'video' as const : 'image' as const,
    dataUrl,
    name: file.name,
  };
}

export function useMessages() {
  const [messages, setMessages] = useState<MessageNote[]>(loadMessages);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const addMessage = useCallback((msg: Omit<MessageNote, 'id' | 'createdAt'>) => {
    const newMsg: MessageNote = {
      ...msg,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [newMsg, ...prev]);
    return newMsg;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<MessageNote>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const resetMessages = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    updateMessage,
    deleteMessage,
    resetMessages,
  };
}
