import { Image, StyleSheet, TextInput, Button} from 'react-native';
import React, { useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


export default function ProfileScreen() {
    const [username, setUsername] = useState('initialUsername');
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('initialPassword');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const handleUsernameChange = () => {
      if(oldPassword==password){
        setUsername(newUsername);
      }
    }
    const handlePasswordChange = () => {
      if(oldPassword==password){
        setPassword(newPassword);
      }
    }
    return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
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
