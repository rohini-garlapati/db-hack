import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MessageSquare, Trash2, ChevronRight, Calendar } from 'lucide-react';
import { getHistory, ConversationHistory } from '@/services/api';
import { formatDate } from '@/utils/formatters';

export default function History() {
  const [history, setHistory] = useState<ConversationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error('Failed to load history', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Conversation History</h2>
          <p className="text-muted-foreground">Review and manage past interactions.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 border-border shadow-sm">
        <CardContent className="p-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-4 flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mb-4 text-muted" />
              <p className="text-lg font-medium text-foreground">No conversations found</p>
              <p className="text-sm">Try adjusting your search or start a new chat.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredHistory.map((item) => (
                <div key={item.id} className="group p-4 hover:bg-muted/30 transition-colors flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <h3 className="font-semibold truncate text-foreground">{item.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'archived' && (
                          <Badge variant="secondary" className="font-normal text-xs">Archived</Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {item.preview}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <span>{item.messageCount} messages</span>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col sm:flex-row items-center gap-1 shrink-0 mt-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
