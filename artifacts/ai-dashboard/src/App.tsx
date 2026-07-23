import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';

import { DashboardLayout } from '@/layouts/DashboardLayout';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Chat from '@/pages/Chat';
import Analytics from '@/pages/Analytics';
import Upload from '@/pages/Upload';
import History from '@/pages/History';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Protected Routes wrapped in Layout */}
      <Route path="/">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/chat">
        <DashboardLayout>
          <ChatProvider>
            <Chat />
          </ChatProvider>
        </DashboardLayout>
      </Route>
      <Route path="/analytics">
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path="/upload">
        <DashboardLayout>
          <Upload />
        </DashboardLayout>
      </Route>
      <Route path="/history">
        <DashboardLayout>
          <History />
        </DashboardLayout>
      </Route>
      <Route path="/settings">
        <DashboardLayout>
          <Settings />
        </DashboardLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </AppProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
