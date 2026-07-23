import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, Send, Trash2, RefreshCcw, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function MessageBubble({ message, onRegenerate, isLastAssistant }: { message: any, onRegenerate?: () => void, isLastAssistant?: boolean }) {
  const { user } = useAuth();
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar className="w-8 h-8 shrink-0 border">
        {isUser ? (
          <>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <BrainCircuit className="w-4 h-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
            : 'bg-card border shadow-sm rounded-tl-sm text-card-foreground'
        }`}>
          {message.text}
        </div>
        
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground" onClick={handleCopy} title="Copy response">
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </Button>
            {isLastAssistant && onRegenerate && (
              <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground" onClick={onRegenerate} title="Regenerate response">
                <RefreshCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Chat() {
  const { messages, isTyping, sendMessage, clearConversation, regenerate } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur z-10">
        <div>
          <h2 className="text-sm font-medium">Active Session</h2>
          <p className="text-xs text-muted-foreground">Azure OpenAI GPT-4o</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearConversation} className="text-muted-foreground">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-xl font-semibold">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground">
                  I can analyze your indexed documents, query your databases, or help you understand your data.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                {[
                  "Summarize the latest financial report",
                  "What are our top customer complaints?",
                  "Explain the new API architecture",
                  "Generate a weekly performance summary"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    className="p-3 text-sm text-left border rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => {
                const isLastAssistant = msg.role === 'assistant' && index === messages.length - 1;
                return (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    onRegenerate={regenerate}
                    isLastAssistant={isLastAssistant}
                  />
                );
              })}
              
              {isTyping && (
                <div className="flex gap-4 mb-6">
                  <Avatar className="w-8 h-8 shrink-0 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <BrainCircuit className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card border shadow-sm rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="pr-12 py-6 rounded-2xl shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
              disabled={isTyping}
              data-testid="input-chat"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 w-8 h-8 rounded-xl"
              disabled={!input.trim() || isTyping}
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground">AI can make mistakes. Consider verifying important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
