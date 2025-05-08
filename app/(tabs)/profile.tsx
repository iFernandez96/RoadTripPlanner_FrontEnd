import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import styles from '../css/profile';

import { useAuth } from '../context/AuthContext';
import tripService from '../context/tripService';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    user_id: 0,
    username: '',
    fullname: '',
    email: '',
    password: '',
    picture: null
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userInfo = await tripService.getMe();

      setUserData({
        user_id: userInfo.user_id,
        username: userInfo.username,
        fullname: userInfo.fullname,
        email: userInfo.email,
        password: '',
        picture: userInfo.picture
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('Failed to load user information. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedData = {
        username: userData.username,
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password || undefined
      };

      Object.keys(updatedData).forEach(key =>
        updatedData[key] === undefined && delete updatedData[key]
      );

      await tripService.UpdateUserByID(userData.user_id, updatedData);

      setIsLoading(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');

      fetchUserInfo();
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update profile. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Road Trip Planner</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Manage your profile information</Text>
        </View>

        <View style={styles.main}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchUserInfo}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.profileContainer}>
              {/* Profile Display */}
              <View style={styles.profileHeader}>
                <Text style={styles.profileTitle}>Your Profile</Text>
                {!isEditing ? (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {!isEditing ? (
                <View style={styles.profileInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Username:</Text>
                    <Text style={styles.infoValue}>{userData.username}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Full Name:</Text>
                    <Text style={styles.infoValue}>{userData.fullname}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{userData.email}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.profileForm}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Username:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={userData.username}
                      onChangeText={(text) => handleInputChange('username', text)}
                      placeholder="Username"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Full Name:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={userData.fullname}
                      onChangeText={(text) => handleInputChange('fullname', text)}
                      placeholder="Full Name"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Email:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={userData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      placeholder="Email"
                      keyboardType="email-address"
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Password:</Text>
                    <TextInput
                      style={styles.formInput}
                      value={userData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      placeholder="New Password (leave blank to keep current)"
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.formButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEditing(false);
                        fetchUserInfo();
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleUpdateProfile}
                    >
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}