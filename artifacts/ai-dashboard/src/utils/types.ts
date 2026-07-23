export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  text: string;
  timestamp: string;
  role: 'user' | 'assistant';
}

export interface UploadResponse {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url?: string;
  uploadedAt: string;
}

export interface AnalyticsData {
  overview: {
    totalRequests: number;
    tokensUsed: number;
    avgLatency: string;
    errorRate: string;
  };
  requestsOverTime: { date: string; requests: number }[];
  requestsByCategory: { category: string; count: number }[];
  documentTypes: { type: string; count: number }[];
}

export interface ConversationHistory {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  date: string;
  status: 'active' | 'archived';
}

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'indexed' | 'indexing' | 'failed';
}
