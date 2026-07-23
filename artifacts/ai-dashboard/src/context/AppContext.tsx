import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  globalLoading: boolean;
  setGlobalLoading: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar, globalLoading, setGlobalLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
