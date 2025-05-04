import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert, Platform } from 'react-native';

export default function GoogleWebRedirect() {
  const router = useRouter();
  const { token } = useLocalSearchParams();

  const storeToken = async (token: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem('userToken', token);
    } else {
      await SecureStore.setItemAsync('userToken', token);
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      if (typeof token === 'string') {
        await storeToken(token);
        Alert.alert('Success', 'You are now logged in!');
        router.replace('/(tabs)/profile');
      } else {
        Alert.alert('Error', 'No token received');
        router.replace('/');
      }
    };

    handleRedirect();
  }, []);

  return null;
}
