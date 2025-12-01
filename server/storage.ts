import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Message {
  id: string;
  name: string;
  text: string;
  images?: string[];
  videos?: string[];
  color: string;
  rotation: number;
  timestamp: string;
}

export type InsertUser = Omit<User, "id">;
export type InsertMessage = Omit<Message, "id" | "timestamp">;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, updates: Partial<InsertMessage>): Promise<Message | undefined>;
  deleteMessage(id: string): Promise<boolean>;
}

const DATA_DIR = join(process.cwd(), "data");
const MESSAGES_FILE = join(DATA_DIR, "messages.json");
const USERS_FILE = join(DATA_DIR, "users.json");

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }
}

async function readMessages(): Promise<Message[]> {
  try {
    const data = await readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMessages(messages: Message[]): Promise<void> {
  await ensureDataDir();
  await writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

async function readUsers(): Promise<User[]> {
  try {
    const data = await readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await ensureDataDir();
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export class FileStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const users = await readUsers();
    return users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await readUsers();
    return users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await readUsers();
    const user: User = {
      id: randomUUID(),
      ...insertUser
    };
    users.push(user);
    await writeUsers(users);
    return user;
  }

  async getMessages(): Promise<Message[]> {
    const messages = await readMessages();
    return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const messages = await readMessages();
    const newMessage: Message = {
      id: randomUUID(),
      ...message,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    await writeMessages(messages);
    return newMessage;
  }

  async updateMessage(id: string, updates: Partial<InsertMessage>): Promise<Message | undefined> {
    const messages = await readMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    
    const updated = { ...messages[index], ...updates };
    messages[index] = updated;
    await writeMessages(messages);
    return updated;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const messages = await readMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    messages.splice(index, 1);
    await writeMessages(messages);
    return true;
  }
}

export const storage = new FileStorage();
