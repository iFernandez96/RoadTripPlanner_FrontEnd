import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://roadtrip-planner-api-ddd2dd6834e8.herokuapp.com/';

// Updated User interface to match backend response
interface User {
  username: string;
  email: string;
  fullname?: string;
  id?: string; // Optional because it might come from JWT instead
}

interface JwtPayload {
  userId?: string; // 'sub' field in JWT
  email: string;
  issuedAtTimestamp: number; // 'iat' field in JWT
  expirationTimestamp: number; // 'exp' field in JWT
}

// Updated API response interfaces to match backend
interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, fullname: string, email: string, password: string) => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
// Add user storage key
const USER_KEY = 'userData';

// Remove the hashPassword function since we'll send raw passwords to the server

const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse | null> => {
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Login response:', response);

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('API login error:', error);
      return null;
    }
  },

  register: async (username: string, fullname: string, email: string, password: string): Promise<AuthResponse | null> => {
    try {
      const response = await fetch(`${API_URL}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullname, email, password }),
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('API register error:', error);
      return null;
    }
  }
};

// Token and user storage functions
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

const saveUser = async (user: User): Promise<void> => {
  try {
    const userData = JSON.stringify(user);
    if (Platform.OS === 'web') {
      localStorage.setItem(USER_KEY, userData);
    } else {
      await SecureStore.setItemAsync(USER_KEY, userData);
    }
  } catch (error) {
    console.error('Failed to save user data:', error);
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

const getStoredUser = async (): Promise<User | null> => {
  try {
    let userData: string | null;
    if (Platform.OS === 'web') {
      userData = localStorage.getItem(USER_KEY);
    } else {
      userData = await SecureStore.getItemAsync(USER_KEY);
    }

    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

const removeAuthData = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch (error) {
    console.error('Failed to remove auth data:', error);
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

  // Parse the JWT token for validation and possibly additional user data
  const validateToken = (token: string): boolean => {
    try {
      // Use jwt-decode library to decode the JWT
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.log('Token expired');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return false;
    }
  };

  // Load user from stored token and user data on app start
  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      try {
        const token = await getStoredToken();
        const storedUser = await getStoredUser();

        if (token && storedUser && validateToken(token)) {
          setUser(storedUser);
        } else {
          // Token invalid, expired or user data missing
          await removeAuthData();
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);

      if (!response || !response.access_token || !response.user) {
        return false;
      }

      if (!validateToken(response.access_token)) {
        return false;
      }

      setUser(response.user);
      await saveToken(response.access_token);
      await saveUser(response.user);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setUser(null);
    await removeAuthData();
  };

  const register = async (username: string, fullname: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.register(username, fullname, email, password);

      console.log('Register response:', response);

      if (!response || !response.access_token || !response.user) {
        return false;
      }

      if (!validateToken(response.access_token)) {
        return false;
      }

      setUser(response.user);
      await saveToken(response.access_token);
      await saveUser(response.user);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Get current token
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
