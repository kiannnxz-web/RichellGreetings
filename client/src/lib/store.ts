import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Message {
  id: string;
  name: string;
  text: string;
  images?: string[];
  color: string;
  rotation: number;
  timestamp: string | Date;
}

const API_BASE = "/api";

async function fetchMessages(): Promise<Message[]> {
  const response = await fetch(`${API_BASE}/messages`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
}

async function createMessageAPI(message: Omit<Message, "id" | "timestamp">): Promise<Message> {
  const response = await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error("Failed to create message");
  return response.json();
}

async function updateMessageAPI(id: string, updates: Partial<Message>): Promise<Message> {
  const response = await fetch(`${API_BASE}/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update message");
  return response.json();
}

async function deleteMessageAPI(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/messages/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete message");
}

export function useMessages() {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
  });

  const addMessageMutation = useMutation({
    mutationFn: (message: Omit<Message, "id" | "timestamp">) => createMessageAPI(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Message> }) =>
      updateMessageAPI(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => deleteMessageAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const addMessage = (message: Omit<Message, "id" | "rotation" | "color" | "timestamp">) => {
    const messageWithDefaults = {
      ...message,
      rotation: Math.random() * 6 - 3,
      color: ["bg-pink-100", "bg-yellow-100", "bg-green-100", "bg-purple-100", "bg-blue-100"][
        Math.floor(Math.random() * 5)
      ],
    };
    addMessageMutation.mutate(messageWithDefaults);
  };

  const deleteMessage = (id: string) => {
    deleteMessageMutation.mutate(id);
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    updateMessageMutation.mutate({ id, updates });
  };

  return {
    messages,
    isLoading,
    addMessage,
    deleteMessage,
    updateMessage,
  };
}
