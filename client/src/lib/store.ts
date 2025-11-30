import { useState, useEffect } from "react";

export interface Message {
  id: string;
  name: string;
  text: string;
  image?: string; // URL or placeholder
  color: string; // Card background color
  rotation: number; // Random rotation for fun
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    name: "Sarah",
    text: "Happy Birthday Richell! Hope you have the most amazing day filled with joy and cake! 🎂",
    color: "bg-pink-100",
    rotation: -2,
  },
  {
    id: "2",
    name: "Mike & Jen",
    text: "Cheers to another year of being awesome! Can't wait to celebrate with you. 🥂",
    image: "https://images.unsplash.com/photo-1530103862676-de3c9a59af57?auto=format&fit=crop&q=80&w=800",
    color: "bg-yellow-100",
    rotation: 1,
  },
  {
    id: "3",
    name: "Bestie",
    text: "You deserve the world! Love you so much! ❤️",
    color: "bg-green-100",
    rotation: -1,
  },
];

// Simple in-memory store for the session
let currentMessages = [...MOCK_MESSAGES];
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

  const addMessage = (message: Omit<Message, "id" | "rotation" | "color">) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      rotation: Math.random() * 6 - 3, // Random rotation between -3 and 3 deg
      color: ["bg-pink-100", "bg-yellow-100", "bg-green-100", "bg-purple-100"][Math.floor(Math.random() * 4)],
    };
    currentMessages = [newMessage, ...currentMessages];
    listeners.forEach((l) => l(currentMessages));
  };

  return { messages, addMessage };
}
