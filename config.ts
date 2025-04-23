import Constants from 'expo-constants';

const ENV = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl ?? 'https://default-api.com',
  apiKey: process.env.EXPO_PUBLIC_API_KEY ??  Constants.expoConfig?.extra?.apiKey ?? 'default-key',
  apiKey2: Constants.expoConfig?.extra?.apiKey2 ?? 'default-key',
  environment: Constants.expoConfig?.extra?.environment ?? 'development',
};

export default ENV;