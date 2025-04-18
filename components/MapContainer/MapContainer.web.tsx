// components/MapContainer/MapContainer.web.tsx
import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This is a stub implementation for web that doesn't import any native modules
interface MapContainerProps {
  initialRegion: any;
  mapType: string;
  showsTraffic: boolean;
  showsUserLocation: boolean;
  markers: any[];
  route: any[];
}

const MapContainer = forwardRef<any, MapContainerProps>(
  (props, ref) => {
    return (
      <View style={styles.placeholderContainer} ref={ref}>
        <Text style={styles.placeholderText}>
          Map view is only available on iOS and Android devices.
        </Text>
        <Text style={styles.instructionText}>
          Please use the iOS or Android app to access maps and directions functionality.
        </Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default MapContainer;