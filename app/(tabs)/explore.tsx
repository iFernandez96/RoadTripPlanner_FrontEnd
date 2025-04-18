// app/(tabs)/explore.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapContainer from '@/components/MapContainer';

export default function Explore() {
  return (
    <View style={styles.container}>
      <MapContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});