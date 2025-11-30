import { useState, useEffect } from "react";

export interface Message {
  id: string;
  name: string;
  text: string;
  image?: string;
  color: string;
  rotation: number;
  timestamp: number;
}

// Kian's message is always present as the first one if no storage exists
const KIAN_MESSAGE: Message = {
  id: "kian-1",
  name: "Kian",
  text: "Happy Birthday Richell! 🎉\n\nI made this special space just for you. May your day be filled with magic, laughter, and everything you've ever wished for.\n\nEnjoy your day! ✨",
  color: "bg-pink-100",
  rotation: -2,
  timestamp: Date.now(),
};

const STORAGE_KEY = "birthday-card-messages-v1";

// Initialize messages from local storage, or start with just Kian's if empty
const loadMessages = (): Message[] => {
  if (typeof window === "undefined") return [KIAN_MESSAGE];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // If we have saved messages, return them.
      // OPTIONAL: Ensure Kian's message is always there if you want, 
      // but usually if storage exists we trust it.
      if (parsed.length === 0) return [KIAN_MESSAGE];
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load messages", e);
  }
  
  return [KIAN_MESSAGE];
};

let currentMessages = loadMessages();
const listeners = new Set<(msgs: Message[]) => void>();

export function useMessages() {
  // React state to trigger re-renders
  const [messages, setMessages] = useState<Message[]>(currentMessages);

  useEffect(() => {
    // Subscribe to store updates
    const listener = (msgs: Message[]) => setMessages(msgs);
    listeners.add(listener);
    
    // Also sync with local storage in case another tab updated it
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        currentMessages = JSON.parse(e.newValue);
        listeners.forEach(l => l(currentMessages));
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const addMessage = (message: Omit<Message, "id" | "rotation" | "color" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      rotation: Math.random() * 6 - 3,
      color: ["bg-pink-100", "bg-yellow-100", "bg-green-100", "bg-purple-100", "bg-blue-100"][Math.floor(Math.random() * 5)],
      timestamp: Date.now(),
    };
    
    // Update store
    currentMessages = [newMessage, ...currentMessages];
    
    // Persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMessages));
    
    // Notify listeners
    listeners.forEach((l) => l(currentMessages));
  };

  return { messages, addMessage };
}
