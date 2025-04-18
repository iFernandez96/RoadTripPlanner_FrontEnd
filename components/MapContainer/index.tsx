// components/MapContainer/index.tsx
import { Platform } from 'react-native';

// Export the appropriate platform-specific implementation
export default Platform.select({
  ios: () => require('./MapContainer.native').default,
  android: () => require('./MapContainer.native').default,
  default: () => require('./MapContainer.web').default,
})();