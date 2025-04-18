// components/MapContainer/index.tsx
import { Platform } from 'react-native';

// Export the appropriate platform-specific implementation
export default Platform.select({
  android: () => require('./MapContainer.android').default,
  default: () => require('./MapContainer.native').default,
})();