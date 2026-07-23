// src/services/api.ts

/*
 * =====================================================================
 * AI DASHBOARD — API SERVICE LAYER
 * =====================================================================
 *
 * HOW TO CONNECT TO THE REAL AZURE BACKEND:
 * -------------------------------------------
 * 1. Set VITE_API_BASE_URL in your .env file to the Azure endpoint URL
 *    e.g. VITE_API_BASE_URL=https://your-azure-agent.openai.azure.com
 *
 * 2. Set VITE_API_KEY in your .env file to your Azure API key
 *    e.g. VITE_API_KEY=your-azure-api-key
 *
 * 3. In each function below, locate the comment marked:
 *    // ⚡ AZURE INTEGRATION POINT
 *    Replace the mock return with a real axios call using:
 *    - endpoint: the Azure API path shown in the comment
 *    - auth: pass the API key as a Bearer token or Ocp-Apim-Subscription-Key header
 *    - request/response: map the mock shape to the real Azure schema
 *
 * 4. Remove the mock delay and mock data once real API is confirmed working.
 *
 * The mock implementation uses simulated network delays and realistic
 * data shapes to make the UI fully functional during development.
 * =====================================================================
 */
import axios, { AxiosInstance } from 'axios';
import { 
  AuthResponse, 
  MessageResponse, 
  UploadResponse, 
  AnalyticsData, 
  ConversationHistory, 
  Document as CustomDocument,
  User
} from '../utils/types';

export type {
  AuthResponse, 
  MessageResponse, 
  UploadResponse, 
  AnalyticsData, 
  ConversationHistory,
  User
};

export type Document = CustomDocument;

// Read base URL from environment — set VITE_API_BASE_URL in .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Single Axios instance — all calls go through here
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s timeout
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
  },
});

// Request interceptor — attach auth token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // ⚡ AZURE INTEGRATION POINT — handle auth expiry, redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Helper to simulate latency for mock data
const delay = () => new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
const randomError = () => {
  if (Math.random() < 0.05) {
    throw new Error('Simulated network error. Please try again.');
  }
};

// ⚡ AZURE INTEGRATION POINT
// Real endpoint: POST /auth/login
export async function login(email: string, password: string): Promise<AuthResponse> {
  await delay();
  randomError();
  
  if (email === 'demo@example.com' && password === 'demo123') {
    return {
      token: 'mock-jwt-token-12345',
      user: {
        id: 'u-1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: '',
      }
    };
  }
  
  throw new Error('Invalid email or password');
}

export async function logout(): Promise<void> {
  await delay();
  // Clear any server-side session if needed
}

// ⚡ AZURE INTEGRATION POINT
// Real endpoint: POST /chat/completions (Azure OpenAI format)
// Replace mock with: await apiClient.post('/chat/completions', { messages, ... })
export async function sendMessage(message: string, conversationId?: string): Promise<MessageResponse> {
  await delay();
  randomError();

  return {
    id: `msg-${Date.now()}`,
    conversationId: conversationId || `conv-${Date.now()}`,
    text: `This is a simulated AI response to: "${message}". In a real Azure AI implementation, this would contain the actual completion from the model.`,
    timestamp: new Date().toISOString(),
    role: 'assistant',
  };
}

// ⚡ AZURE INTEGRATION POINT  
// Real endpoint: POST /documents/upload (multipart/form-data)
export async function uploadDocument(file: File, onProgress?: (pct: number) => void): Promise<UploadResponse> {
  // Simulate progress
  if (onProgress) {
    for (let i = 10; i <= 90; i += 20) {
      await new Promise(r => setTimeout(r, 200));
      onProgress(i);
    }
  }
  
  await delay();
  randomError();
  if (onProgress) onProgress(100);

  return {
    id: `doc-${Date.now()}`,
    name: file.name,
    size: file.size,
    status: 'done',
    url: `/mock-files/${file.name}`,
    uploadedAt: new Date().toISOString(),
  };
}

// ⚡ AZURE INTEGRATION POINT
// Real endpoint: GET /analytics/summary
export async function getAnalytics(): Promise<AnalyticsData> {
  await delay();
  randomError();
  
  return {
    overview: {
      totalRequests: 24503,
      tokensUsed: 1250000,
      avgLatency: '1.2s',
      errorRate: '0.4%',
    },
    requestsOverTime: Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return {
        date: d.toISOString().split('T')[0],
        requests: Math.floor(Math.random() * 500) + 100,
      };
    }),
    requestsByCategory: [
      { category: 'Customer Support', count: 12400 },
      { category: 'Internal Docs', count: 8500 },
      { category: 'Code Generation', count: 3603 },
    ],
    documentTypes: [
      { type: 'PDF', count: 120 },
      { type: 'DOCX', count: 85 },
      { type: 'CSV', count: 34 },
    ]
  };
}

// ⚡ AZURE INTEGRATION POINT
// Real endpoint: GET /conversations
export async function getHistory(): Promise<ConversationHistory[]> {
  await delay();
  randomError();
  
  return Array.from({ length: 12 }).map((_, i) => ({
    id: `conv-hist-${i}`,
    title: `Conversation about ${['project planning', 'code review', 'database architecture', 'feature requirements'][i % 4]}`,
    preview: `Here are the latest updates on...`,
    messageCount: Math.floor(Math.random() * 15) + 2,
    date: new Date(Date.now() - i * 86400000 - Math.random() * 10000000).toISOString(),
    status: i % 5 === 0 ? 'archived' : 'active',
  }));
}

// ⚡ AZURE INTEGRATION POINT
// Real endpoint: GET /documents
export async function getDocuments(): Promise<CustomDocument[]> {
  await delay();
  randomError();
  
  return [
    { id: 'd1', name: 'Q3_Financial_Report.pdf', size: 2450000, type: 'application/pdf', uploadedAt: new Date(Date.now() - 100000).toISOString(), status: 'indexed' },
    { id: 'd2', name: 'API_Documentation_v2.docx', size: 1200000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadedAt: new Date(Date.now() - 500000).toISOString(), status: 'indexed' },
    { id: 'd3', name: 'User_Feedback_2023.csv', size: 500000, type: 'text/csv', uploadedAt: new Date(Date.now() - 86400000).toISOString(), status: 'indexing' },
    { id: 'd4', name: 'Architecture_Diagram.png', size: 850000, type: 'image/png', uploadedAt: new Date(Date.now() - 172800000).toISOString(), status: 'failed' },
  ];
}
