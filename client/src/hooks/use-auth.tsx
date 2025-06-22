import { createContext, ReactNode, useContext, useState } from "react";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('vitallink-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeouresolve, 1000);
    
    // Create a mock user from any credentials
    const mockUser: User = {
      id: "demo-user",
      email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@vitallink.com`,
      firstName: "Demo",
      lastName: "User",
    };
    
    setUser(mockUser);
    localStorage.setItem('vitallink-user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vitallink-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContexAuthContext;
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}