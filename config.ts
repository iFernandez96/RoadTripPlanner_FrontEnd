import Constants from 'expo-constants';

const ENV = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl ?? 'https://default-api.com',
  apiKey: Constants.expoConfig?.extra?.apiKey ?? 'default-key',
  environment: Constants.expoConfig?.extra?.environment ?? 'development',
};

export default ENV;