import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { MessageResponse, sendMessage as apiSendMessage } from '../services/api';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
  regenerate: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const conversationId = useRef(`conv-${Date.now()}`);
  const { toast } = useToast();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await apiSendMessage(text, conversationId.current);
      setMessages((prev) => [...prev, {
        id: response.id,
        role: response.role,
        text: response.text,
        timestamp: response.timestamp,
      }]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Message failed',
        description: error.message || 'Could not reach the AI agent.',
      });
      // Optionally remove the user message or mark it as failed
    } finally {
      setIsTyping(false);
    }
  }, [toast]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    conversationId.current = `conv-${Date.now()}`;
  }, []);

  const regenerate = useCallback(async () => {
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Remove the last assistant message
    setMessages((prev) => {
      const newMsgs = [...prev];
      if (newMsgs[newMsgs.length - 1].role === 'assistant') {
        newMsgs.pop();
      }
      return newMsgs;
    });

    setIsTyping(true);
    try {
      const response = await apiSendMessage(lastUserMsg.text, conversationId.current);
      setMessages((prev) => [...prev, {
        id: response.id,
        role: response.role,
        text: response.text,
        timestamp: response.timestamp,
      }]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Regenerate failed',
        description: error.message || 'Could not reach the AI agent.',
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, toast]);

  return (
    <ChatContext.Provider value={{ messages, isTyping, sendMessage, clearConversation, regenerate }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
