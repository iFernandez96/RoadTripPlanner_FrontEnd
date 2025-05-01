import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://roadtrip-planner-api-ddd2dd6834e8.herokuapp.com/api/';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface JwtPayload {
  sub: string;
  username: string;
  email?: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';

// For demo purposes, simulating API calls
// In a real app, replace these with actual API calls
const mockApi = {
  login: async (username: string, password: string): Promise<{ token: string } | null> => {
    // Simulate API validation
    if (username === 'demo' && password === 'password') {
      // Create a simple JWT that expires in 7 days
      const payload = {
        sub: '123456',
        username: username,
        email: `${username}@example.com`,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
      };

      // This is a mock JWT, not a real one
      // In a real app, the server would generate and sign this
      const token = btoa(JSON.stringify(payload));

      return { token };
    }

    // Demo account for quick testing
    if (username === 'test' && password === 'test') {
      const payload = {
        sub: '654321',
        username: username,
        email: `${username}@example.com`,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      };

      const token = btoa(JSON.stringify(payload));
      return { token };
    }

    return null;
  },

  register: async (username: string, password: string): Promise<{ token: string } | null> => {
    if (username === 'demo' || username === 'admin') {
      return null; // Username taken
    }

    const payload = {
      sub: Date.now().toString(),
      username: username,
      email: `${username}@example.com`,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    };

    const token = btoa(JSON.stringify(payload));
    return { token };
  }
};

// In a real app, replace the mock API with real API calls
// Example:
const api = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return null;
    return response.json();
  },
  register: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return null;
    return response.json();
  }
};

const saveToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

const getStoredToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

const removeToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const parseUser = (token: string): User | null => {
    try {
      // In a real app, use jwt-decode to decode the token
      // The mockApi uses a simple base64 encoding for demo purposes
      const decoded = JSON.parse(atob(token)) as JwtPayload;

      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return null;
      }

      return {
        id: decoded.sub,
        username: decoded.username,
        email: decoded.email
      };
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      try {
        const token = await getStoredToken();

        if (token) {
          const userData = parseUser(token);
          if (userData) {
            setUser(userData);
          } else {
            await removeToken();
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await mockApi.login(username, password);

      if (!response || !response.token) {
        return false;
      }

      const userData = parseUser(response.token);

      if (!userData) {
        return false;
      }

      setUser(userData);
      await saveToken(response.token);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await removeToken();
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await mockApi.register(username, password);

      if (!response || !response.token) {
        return false;
      }

      const userData = parseUser(response.token);

      if (!userData) {
        return false;
      }

      setUser(userData);
      await saveToken(response.token);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const getToken = async (): Promise<string | null> => {
    return await getStoredToken();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    isLoggedIn: !!user,
    getToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
