import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { apiClient } from '@/services/api';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  // Form states
  const [baseUrl, setBaseUrl] = useState(import.meta.env.VITE_API_BASE_URL || '');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY ? '••••••••••••••••' : '');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Fake state for toggles
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: false
  });

  useEffect(() => {
    // Check current theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 800);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      // Small simulated delay before the actual call or mock call
      await new Promise(r => setTimeout(r, 600));
      // In a real app, you might ping a /health or /models endpoint
      // For now we just simulate success if baseUrl is set
      if (!baseUrl) throw new Error("Base URL is required");
      
      setTestResult('success');
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the Azure API.",
      });
    } catch (error: any) {
      setTestResult('error');
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Could not connect to the API.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and API configuration.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 border">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Azure API Configuration</CardTitle>
            <CardDescription>Configure your connection to the Azure AI Agent endpoint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">API Base URL</Label>
              <Input 
                id="baseUrl" 
                value={baseUrl} 
                onChange={e => setBaseUrl(e.target.value)}
                placeholder="https://your-resource.openai.azure.com" 
              />
              <p className="text-[10px] text-muted-foreground">The endpoint URL for your deployed Azure AI resource.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                id="apiKey" 
                type="password" 
                value={apiKey} 
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter your Azure API key" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <div className="flex items-center gap-2">
              {testResult === 'success' && <span className="text-sm text-emerald-500 font-medium">Connection verified</span>}
              {testResult === 'error' && <span className="text-sm text-destructive font-medium">Connection failed</span>}
            </div>
            <Button variant="secondary" onClick={handleTestConnection} disabled={isTesting}>
              {isTesting && <Spinner className="mr-2" size="sm" />}
              Test Connection
            </Button>
          </CardFooter>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your UI and notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts about deployment status.</p>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={c => setNotifications(prev => ({ ...prev, email: c }))} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="flex justify-end gap-4 pb-12">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Spinner className="mr-2" size="sm" />}
            Save Changes
          </Button>
        </div>

      </div>
    </div>
  );
}
