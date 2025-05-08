import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import authService from './authService';
import { User, JwtPayload, AuthResponse } from './types';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'userData';

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

  // Parse the JWT token for validation
  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.expirationTimestamp < currentTime) {
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
          // Sync the token with authService
          authService.setToken(token);
          setUser(storedUser);
        } else {
          // Token invalid, expired or user data missing
          await removeAuthData();
          authService.logout();
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
      const response = await authService.login(email, password);

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

  const logout = async (): Promise<void> => {
    authService.logout();
    setUser(null);
    await removeAuthData();
  };

  const register = async (username: string, fullname: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register(username, fullname, email, password);

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

  const getToken = async (): Promise<string | null> => {
    const token = await getStoredToken();
    if (token) {
      authService.setToken(token);
    }
    return token;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    logout,
    register,
    getToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
