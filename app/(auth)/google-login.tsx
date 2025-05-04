import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

// const BACKEND_AUTH_URL = `${Constants.expoConfig?.extra?.apiUrl}/auth/google`;
const BACKEND_AUTH_URL = `${Constants.expoConfig?.extra?.apiUrl}/auth/google?platform=mobile`;
const REDIRECT_URI = 'myapp://redirect';


export default function GoogleLoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token;
  
      if (typeof token === 'string') {
        try {
          await SecureStore.setItemAsync('userToken', token);
          Alert.alert('Success', 'You are now logged in!');
          router.replace('/(tabs)/profile');
        } catch (error) {
          Alert.alert('Error', 'Failed to save token');
        }
      } else {
        Alert.alert('Error', 'Invalid token format');
      }
    };
  
    const subscription = Linking.addEventListener('url', handleRedirect);
    return () => subscription.remove();
  }, []);
  

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await WebBrowser.openAuthSessionAsync(BACKEND_AUTH_URL, REDIRECT_URI);

      if (result.type === 'dismiss') {
        Alert.alert('Login cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open login screen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Google</Text>
      <Button title={isLoading ? 'Logging in...' : 'Continue with Google'} onPress={handleLogin} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  title: {
    fontSize: 24, marginBottom: 24
  }
});
