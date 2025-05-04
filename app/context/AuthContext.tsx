import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}


interface User {
  username: string;
}

interface StoredUserData {
  username: string;
  passwordHash: string;
  salt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

const generateSalt = async (): Promise<string> => {
  // Generate a random 16-byte salt
  const saltBytes = await Crypto.getRandomBytesAsync(16);
  // Convert to hex string
  return Array.from(saltBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const hashPassword = async (password: string, salt: string): Promise<string> => {
  // Combine password and salt
  const combined = password + salt;

  // Hash with SHA-512
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    combined
  );

  return hash;
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

  const loadStoredUsers = async (): Promise<Record<string, StoredUserData>> => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : {};
    } catch (error) {
      console.error('Failed to load stored users:', error);
      return {};
    }
  };

  const saveUsers = async (users: Record<string, StoredUserData>): Promise<void> => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  };

  // Check if user is already logged in on app start
  // useEffect(() => {
  //   const loadStoredAuth = async (): Promise<void> => {
  //     try {
  //       const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);

  //       if (storedUser) {
  //         const userData: User = JSON.parse(storedUser);
  //         setUser(userData);
  //       }
  //     } catch (error) {
  //       console.error('Failed to load auth info:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadStoredAuth();
  // }, []);

  useEffect(() => {
    const loadStoredAuth = async (): Promise<void> => {
    try {
      let token: string | null = null;
  
      // Get token depending on platform
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }
  
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          if (decoded?.email) {
            const userData: User = { username: decoded.email };
            setUser(userData);
            return;
          }
        } catch (err) {
          console.error('Failed to decode token:', err);
        }
      }
  
      // Fallback to legacy login
      const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load auth info:', error);
    } finally {
      setIsLoading(false);
    }
  };
   

    loadStoredAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Get stored users
      const users = await loadStoredUsers();
      const userRecord = users[username];

      if (!userRecord) {
        return false;
      }

      // Hash the provided password with the stored salt
      const passwordHash = await hashPassword(password, userRecord.salt);
      const passwordMatch = passwordHash === userRecord.passwordHash;

      if (passwordMatch) {
        // Create user object without the password hash
        const userData: User = { username };

        setUser(userData);

        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      if (!username || !password || password.length < 6) {
        return false;
      }

      const users = await loadStoredUsers();

      if (users[username]) {
        return false;
      }

      const salt = await generateSalt();

      const passwordHash = await hashPassword(password, salt);

      const newUser: StoredUserData = {
        username,
        passwordHash,
        salt
      };

      users[username] = newUser;
      await saveUsers(users);

      const userData: User = { username };

      setUser(userData);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
