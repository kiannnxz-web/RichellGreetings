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

const STORAGE_KEY = "birthday-card-messages-v1";

// Initialize messages from local storage. 
// REMOVED: No default Kian message if storage is empty. It starts clean.
const loadMessages = (): Message[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load messages", e);
  }
  
  return [];
};

let currentMessages = loadMessages();
const listeners = new Set<(msgs: Message[]) => void>();

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(currentMessages);

  useEffect(() => {
    const listener = (msgs: Message[]) => setMessages(msgs);
    listeners.add(listener);
    
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
    
    currentMessages = [newMessage, ...currentMessages];
    
    // Persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMessages));
    
    listeners.forEach((l) => l(currentMessages));
  };

  return { messages, addMessage };
}
