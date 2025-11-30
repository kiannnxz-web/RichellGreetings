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

const KIAN_MESSAGE: Message = {
  id: "kian-1",
  name: "Kian",
  text: "Happy Birthday Richell! 🎉\n\nI made this special space just for you. May your day be filled with magic, laughter, and everything you've ever wished for.\n\nEnjoy your day! ✨",
  color: "bg-pink-100",
  rotation: -2,
  timestamp: Date.now(),
};

const STORAGE_KEY = "birthday-card-messages-v1";

// Load from local storage or default to Kian's message
const loadMessages = (): Message[] => {
  if (typeof window === "undefined") return [KIAN_MESSAGE];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [KIAN_MESSAGE];
};

let currentMessages = loadMessages();
const listeners = new Set<(msgs: Message[]) => void>();

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(currentMessages);

  useEffect(() => {
    const listener = (msgs: Message[]) => setMessages(msgs);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
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
    
    // Persist to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMessages));
    
    listeners.forEach((l) => l(currentMessages));
  };

  return { messages, addMessage };
}
