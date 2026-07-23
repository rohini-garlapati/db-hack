import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Clock, Database, FileText, CheckCircle2 } from 'lucide-react';
import { getAnalytics, getDocuments, getHistory, AnalyticsData, Document, ConversationHistory } from '@/services/api';
import { formatNumber, formatRelativeTime, formatBytes } from '@/utils/formatters';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [history, setHistory] = useState<ConversationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [analyticsData, docsData, histData] = await Promise.all([
          getAnalytics(),
          getDocuments(),
          getHistory()
        ]);
        setAnalytics(analyticsData);
        setDocuments(docsData.slice(0, 5)); // Just take recent 5
        setHistory(histData.slice(0, 5)); // Just take recent 5
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary/5 border border-primary/20 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-medium text-primary">Azure AI Agent Online</h2>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Latency: 1.2s</span>
          <span className="flex items-center gap-1"><Database className="w-4 h-4" /> Model: GPT-4o</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Requests", value: analytics?.overview.totalRequests, icon: Activity, format: formatNumber },
          { title: "Tokens Used", value: analytics?.overview.tokensUsed, icon: Database, format: formatNumber },
          { title: "Avg Response Time", value: analytics?.overview.avgLatency, icon: Clock },
          { title: "Success Rate", value: "99.6%", icon: CheckCircle2, valueClass: "text-emerald-500" }
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className={`text-2xl font-bold ${stat.valueClass || ''}`}>
                  {stat.value !== undefined ? (stat.format ? stat.format(Number(stat.value)) : stat.value) : '--'}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {history.map((item, i) => (
                  <div key={item.id} className="flex gap-4 relative">
                    {i !== history.length - 1 && (
                      <div className="absolute top-10 bottom-[-24px] left-[19px] w-px bg-border z-0" />
                    )}
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.preview}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Indexed Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[250px]">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{formatBytes(doc.size)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(doc.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs">
                      {doc.status === 'indexed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Indexed
                        </span>
                      )}
                      {doc.status === 'indexing' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Indexing
                        </span>
                      )}
                      {doc.status === 'failed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
