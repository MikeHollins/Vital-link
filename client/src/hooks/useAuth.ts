import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useState, useEffect } from "react";

export function useAuth() {
  const [demoAuth, setDemoAuth] = useState(false);
  
  // Check for demo authentication state
  useEffect(() => {
    const checkAuth = () => {
      const isDemoAuth = localStorage.getItem('vitallink-demo-auth') === 'true';
      setDemoAuth(isDemoAuth);
    };
    
    // Initial check
    checkAuth();
    
    // Listen for storage changes to update auth state immediately
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vitallink-demo-auth' || e.key === null) {
        checkAuth();
      }
    };
    
    // Listen for custom storage events
    const handleCustomStorage = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorage);
    };
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !demoAuth, // Skip API call if demo mode
  });

  // For demo mode, return instant authentication
  if (demoAuth) {
    return {
      user: { id: 'demo-user', email: 'demo@vitallink.com', name: 'Demo User' },
      isLoading: false,
      isAuthenticated: true,
    };
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
