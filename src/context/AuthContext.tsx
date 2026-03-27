import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      // Verify token is still valid
      try {
        const decoded = decodeToken(savedToken);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser(decoded.user);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<void> => {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll create a mock JWT token
      const mockToken = generateMockToken(email);
      const decoded = decodeToken(mockToken);

      if (decoded) {
        setToken(mockToken);
        setUser(decoded.user);
        localStorage.setItem('authToken', mockToken);
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (email: string, _password: string): Promise<void> => {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll create a mock JWT token
      const mockToken = generateMockToken(email);
      const decoded = decodeToken(mockToken);

      if (decoded) {
        setToken(mockToken);
        setUser(decoded.user);
        localStorage.setItem('authToken', mockToken);
      }
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to generate a mock JWT token
function generateMockToken(email: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    user: {
      id: `user_${Date.now()}`,
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
    },
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hour expiry
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Helper function to decode JWT token
export function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    return null;
  }
}
