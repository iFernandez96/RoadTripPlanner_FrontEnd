import React, { useState } from 'react';
import { StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../css/login';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen(): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);

      if (success) {
        // Login successful - navigation will handle redirecting to the main app
        setLoginAttempts(0);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 3) {
          Alert.alert(
            'Login Failed',
            'Multiple login attempts failed. Please make sure you have the correct username and password.'
          );
        } else {
          Alert.alert('Login Failed', 'Invalid username or password');
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
    router.push('/(auth)/google-login');
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
        <ThemedText style={styles.title}>Road Trip Planner</ThemedText>
        <ThemedText style={styles.subtitle}>Sign in to your account</ThemedText>

        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Username</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
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

          {loginAttempts > 0 && (
            <ThemedText style={styles.helperText}>
              Forgot your password? Please contact the administrator.
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
