export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  type: 'text' | 'image';
  imageUrl?: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export type GenerationMode = 'chat' | 'image';

export type ChatVersion = 'v1' | 'v2' | 'v3' | 'v4' | 'v5';