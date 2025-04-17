import { Image, StyleSheet, Platform } from 'react-native';
import React from 'react';
import {TextInput} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';



export default function ProfileScreen() {
    const [username, onChangeTextU] = React.useState('testUser');
    const [password, onChangeTextP] = React.useState('password1');
    //const username = "testUser";
    //const password = "password1";
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
      <TextInput
          style={styles.input}
          value={"enter new username"}
          onChangeText={onChangeTextU}
          placeholder="enter new username"
        />
        <TextInput
          style={styles.input}
          value={"enter new password"}
          onChangeText={onChangeTextP}
          placeholder="enter new password"
        />
        <TextInput
          style={styles.input}
          value={"enter password to confirm"}
          placeholder="enter password to confirm"
        />
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
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
});
