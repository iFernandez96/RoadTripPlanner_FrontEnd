import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  fullname?: string;
  name?: string;
  picture?: string;
}

export default function GoogleProfile() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const loadUserFromToken = async () => {
      let token: string | null = null;

      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }

      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        setUser(decoded);
        console.log('Decoded JWT:', decoded);

      }
    };

    loadUserFromToken();
  }, []);

  if (!user) return <Text style={styles.loading}>Loading profile...</Text>;

  return (
    <View style={styles.container}>
      {user.picture && (
        <Image source={{ uri: user.picture }} style={styles.avatar} />
      )}
      <Text style={styles.name}>{user.fullname || user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 16
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4
  },
  email: {
    fontSize: 16,
    color: '#666'
  },
  loading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 18
  }
});
