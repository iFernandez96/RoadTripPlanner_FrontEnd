import { Image, StyleSheet, TextInput, Button} from 'react-native';
import React, { useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { router } from 'expo-router';


export default function ProfileScreen() {
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const handleUsernameChange = () => {
      if(oldPassword==password&&newUsername!=''){
        setUsername(newUsername);
      }
    }
    const handlePasswordChange = () => {
      if(oldPassword==password&&newPassword!=''){
        setPassword(newPassword);
      }
    }
    return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#A1CEDC' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome! {username}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.regText}>
        <TextInput
          placeholder="Enter old Password"
          value={oldPassword}
          onChangeText={text => setOldPassword(text)}
          style={styles.input}
        />
      </ThemedView>
      <ThemedView style={styles.regText}>
        <TextInput
          placeholder="New Username"
          value={newUsername}
          onChangeText={text => setNewUsername(text)}
          style={styles.input}
        />
        <Button title="Change Username" onPress={handleUsernameChange}/>
      </ThemedView>
      <ThemedView style={styles.regText}>
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={text => setNewPassword(text)}
          style={styles.input}
        />
        <Button title="Change Password" onPress={handlePasswordChange}/>

        <Button title="Login with Google" onPress={() => router.push('/(auth)/google-login')} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
    input: {
      color: '#808080',
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    regText: {
      color: '#808080',
      height: 40,
      margin: 12,
      padding: 10,
    }
});
