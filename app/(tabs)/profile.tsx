import { Image, StyleSheet, Button,TextInput, Text} from 'react-native';
import React from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';


export default function ProfileScreen() {
    var username = 'testUser';
    var password = 'password1';
    var num = '1';
    const [newUser, onChangeTextU] = React.useState('enter new username');
    const [newPass, onChangeTextP] = React.useState('enter new password');
    const [oldPass, onChangeTextO] = React.useState('enter old password to confirm');
    const changeU= () =>{
        if(oldPass==password){
            username = newUser;
        }
        num = num + 1;
    }
    const changeP= () =>{
        if(oldPass==password){
            password = newPass;
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
        <ThemedText type="title">Welcome! {username} {num}</ThemedText>
      </ThemedView>
      <SafeAreaProvider>
        <SafeAreaView>
            <Text style={styles.regText}>Enter old Password first </Text>
            <TextInput
             style={styles.input}
             value={oldPass}
             onChangeText={onChangeTextO}
             defaultValue=''
             placeholder="enter password to confirm"
            />
            <Text style={styles.regText}>Enter New Username then press red button</Text>
            <TextInput
            style={styles.input}
            value={newUser}
            onChangeText={onChangeTextU}
            defaultValue=''
            placeholder="enter new username"
            />
            <Button
                title="press to change username"
                color='#FF0000'
                onPress={() => (changeU)}
            />
            <Text style={styles.regText}>Enter New Password then press blue button</Text>
            <TextInput
             style={styles.input}
             value={newPass}
             onChangeText={onChangeTextP}
             defaultValue=''
             placeholder="enter new password"
            />
            <Button
                title="press to change password"
                color='#0000FF'
                onPress={() => (changeP)}
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
    },
    regText: {
      color: '#808080',
      height: 40,
      margin: 12,
      padding: 10,
    }
});
