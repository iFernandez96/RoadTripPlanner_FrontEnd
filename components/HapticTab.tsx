import { Platform, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import React from 'react';

export function HapticTab(props: any) {
  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  return <Pressable {...props} onPressIn={handlePressIn} />;
}
