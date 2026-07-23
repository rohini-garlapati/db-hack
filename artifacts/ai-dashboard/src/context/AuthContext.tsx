import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, login as apiLogin, logout as apiLogout } from '../services/api';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for session
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Mock validation
      setUser({
        id: 'u-1',
        name: 'Demo User',
        email: 'demo@example.com',
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      localStorage.setItem('auth_token', res.token);
      setUser(res.user);
      setLocation('/dashboard');
      toast({ title: 'Success', description: 'Logged in successfully' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Login failed' });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      localStorage.removeItem('auth_token');
      setUser(null);
      setLocation('/login');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to logout' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
