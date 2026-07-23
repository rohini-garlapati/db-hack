import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Upload, 
  History, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Upload', path: '/upload', icon: Upload },
  { name: 'History', path: '/history', icon: History },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useApp();
  const { logout, user } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <aside 
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 relative",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b">
        {isSidebarOpen && (
          <div className="flex items-center gap-2 font-bold text-lg text-primary">
            <BrainCircuit className="w-6 h-6" />
            <span className="truncate">AI Console</span>
          </div>
        )}
        {!isSidebarOpen && (
          <BrainCircuit className="w-6 h-6 text-primary mx-auto" />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -right-4 top-3 w-8 h-8 rounded-full border bg-background" 
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || location.startsWith(`${item.path}/`);
          return (
            <button
              key={item.path}
              data-testid={`link-${item.name.toLowerCase()}`}
              onClick={() => setLocation(item.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground",
                !isSidebarOpen && "justify-center px-0"
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0")} />
              {isSidebarOpen && <span className="truncate">{item.name}</span>}
            </button>
          )
        })}
      </div>

      <div className="border-t p-4 flex flex-col gap-4">
        {isSidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-semibold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} data-testid="button-logout" title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={logout} className="mx-auto" title="Logout">
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </aside>
  );
}
