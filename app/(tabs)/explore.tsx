// app/(tabs)/explore.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ExploreMapScreen from '@/components/ExploreMapScreen';

export default function Explore() {
  return (
    <View style={styles.container}>
      <ExploreMapScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});