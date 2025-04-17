import { Image, StyleSheet, Button} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';


export default function ProfileScreen() {
    var username = 'testUser';
    var password = 'password1'
    const [newUser, onChangeTextU] = React.useState('enter new username');
    const [newPass, onChangeTextP] = React.useState('enter new password');
    //const username = "testUser";
    const [oldPass, onChangeTextO] = React.useState('enter old password to confirm');
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
      <SafeAreaProvider>
        <SafeAreaView>
            <TextInput
            style={styles.input}
            value={newUser}
            onChangeText={onChangeTextU}
            placeholder="enter new username"
            />
            <TextInput
             style={styles.input}
             value={newPass}
             onChangeText={onChangeTextP}
             placeholder="enter new password"
            />
            <TextInput
             style={styles.input}
             value={oldPass}
             onChangeText={onChangeTextO}
             placeholder="enter password to confirm"
            />
            <Button
                title="press to confirm"
                color='#FF0000'
                onPress={() => username = newUser}
            />
        </SafeAreaView>
      </SafeAreaProvider>
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
    }
});
