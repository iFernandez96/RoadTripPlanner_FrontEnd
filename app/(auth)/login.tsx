import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../css/login';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const router = useRouter();
  const { login, user } = useAuth();

  // User null check to redirect authenticated users
  useEffect(() => {
    if (user) {
      router.replace({ pathname: '/' });
    }
  }, [user]);

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);

      if (success) {
        // Login successful - navigation will handle redirecting to the main app
        setLoginAttempts(0);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 3) {
          Alert.alert(
            'Login Failed',
            'Multiple login attempts failed. Please make sure you have the correct email and password.'
          );
        } else {
          Alert.alert('Login Failed', 'Invalid email or password');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (): void => {
    router.push('/(auth)/register');
  };

  const handleGoogleLogin = (): void => {
    Alert.alert('Not Available', 'Social login is not available in this version');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/Planner_1.png')}
          style={styles.logo}
        />
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText style={styles.subtitle}>Sign in to your account</ThemedText>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.greenButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>Create Account</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.altButton]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>Login with Google</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
