import { useLocation } from 'wouter';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

export function TopNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Create a readable title from the path
  const pathParts = location.split('/').filter(Boolean);
  const title = pathParts.length > 0 
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) 
    : 'Dashboard';

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background"></span>
        </Button>
        
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
