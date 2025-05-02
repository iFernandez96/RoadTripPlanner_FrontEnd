import React, { useState, useEffect } from 'react';
import { styles } from '../css/createTrip';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal
} from 'react-native';
import { router } from 'expo-router';
import tripService from '../context/tripService';
import authService from '../context/authService';

interface User {
  id: string;
  username: string;
}

interface TripFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_location: string;
  end_location: string;
  stops: string[];
  notes: string;
  friends: {id: string, username: string}[];
  supplies: string;
}

const CreateTrip: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newTrip, setNewTrip] = useState<TripFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_location: '',
    end_location: '',
    stops: [],
    notes: '',
    friends: [],
    supplies: ''
  });

  const [currentStop, setCurrentStop] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await tripService.getUsersIds();
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error('Expected array of users but got:', usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddTrip = async () => {
    if (isSubmitting) return;

    if (!newTrip.title || !newTrip.start_date || !newTrip.start_location || !newTrip.end_location) {
      Alert.alert('Required Fields', 'Please fill in all the required fields (title, start date, start and end locations)');
      return;
    }

    try {
      setIsLoading(true);
      setIsSubmitting(true);

      const tripData = {
        title: newTrip.title,
        description: newTrip.description || '',
        start_date: newTrip.start_date,
        end_date: newTrip.end_date || newTrip.start_date,
        is_public: true
      };

      console.log('Sending trip data to API:', JSON.stringify(tripData, null, 2));
      const result = await tripService.createTrip(tripData);

      console.log('Trip created successfully:', result);

      if (newTrip.friends.length > 0) {
        await Promise.all(
          newTrip.friends.map(friend =>
            handleAddFriendToTrip(result.trip_id, friend.id, 'member')
          )
        );
      }

      Alert.alert(
        'Success',
        'Trip created successfully!',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (error: any) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', `Failed to create trip: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleAddFriendToTrip = async (tripId: string, userId: string, role: string) => {
    try {
      const friendData = {
        trip_id: tripId,
        user_id: userId,
        role: role
      };

      console.log('Adding friend to trip:', JSON.stringify(friendData, null, 2));
      const result = await tripService.addFriendToTrip(tripId,friendData);
      console.log('Friend added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding friend to trip:', error);
      return null;
    }
  };

  const handleAddStop = () => {
    if (currentStop.trim()) {
      setNewTrip({
        ...newTrip,
        stops: [...newTrip.stops, currentStop.trim()]
      });
      setCurrentStop('');
    }
  };

  const handleAddFriend = (user: User) => {
    if (!newTrip.friends.some(friend => friend.id === user.id)) {
      setNewTrip({
        ...newTrip,
        friends: [...newTrip.friends, user]
      });
    }
    setIsDropdownVisible(false);
    setSearchQuery('');
  };

  const handleRemoveFriend = (userId: string) => {
    setNewTrip({
      ...newTrip,
      friends: newTrip.friends.filter(friend => friend.id !== userId)
    });
  };

  const onClose = () => {
    router.back();
  };

  const validateAndFormatDate = (dateText: string, field: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateText && !dateRegex.test(dateText)) {
      Alert.alert('Invalid Date', `Please use YYYY-MM-DD format for ${field}`);
      return false;
    }

    if (dateText) {
      const date = new Date(dateText);
      if (isNaN(date.getTime())) {
        Alert.alert('Invalid Date', `The ${field} is not a valid date`);
        return false;
      }
    }
    return true;
  };

  const handleDateChange = (text: string, field: keyof TripFormData) => {
    setNewTrip({...newTrip, [field]: text});
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.modalTitle}>Add New Trip</Text>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Trip Title *</Text>
              <TextInput
                style={styles.input}
                value={newTrip.title}
                onChangeText={(text) => setNewTrip({...newTrip, title: text})}
                placeholder="Ex: Bois Trip"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, {height: 60}]}
                value={newTrip.description}
                onChangeText={(text) => setNewTrip({...newTrip, description: text})}
                placeholder="Brief description of your trip"
                multiline
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.start_date}
                  onChangeText={(text) => handleDateChange(text, 'start_date')}
                  placeholder="YYYY-MM-DD"
                  onBlur={() => validateAndFormatDate(newTrip.start_date, 'Start Date')}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Location *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.start_location}
                  onChangeText={(text) => setNewTrip({...newTrip, start_location: text})}
                  placeholder="Ex: Salinas"
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Location *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.end_location}
                  onChangeText={(text) => setNewTrip({...newTrip, end_location: text})}
                  placeholder="Ex: San Francisco"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Stops:</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, {flex: 1, marginRight: 8}]}
                  value={currentStop}
                  onChangeText={setCurrentStop}
                  placeholder="Ex: San Jose"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddStop}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              {newTrip.stops.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Added Stops:</Text>
                  {newTrip.stops.map((stop, index) => (
                    <Text key={index} style={styles.listItem}>• {stop}</Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Friends:</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsDropdownVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {newTrip.friends.length > 0 ? `${newTrip.friends.length} friend(s) selected` : 'Select friends'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsDropdownVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.dropdownContainer}>
                    <View style={styles.dropdownHeader}>
                      <Text style={styles.dropdownTitle}>Select Friends</Text>
                      <TouchableOpacity onPress={() => setIsDropdownVisible(false)}>
                        <Text style={styles.closeButton}>Close</Text>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search users..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />

                    {users.length === 0 ? (
                      <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Loading users...</Text>
                      </View>
                    ) : (
                      <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => handleAddFriend(item)}
                          >
                            <Text style={styles.userName}>{item.username}</Text>
                            <Text style={styles.userId}>ID: {item.id}</Text>
                          </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                          <Text style={styles.emptyList}>No users found</Text>
                        }
                      />
                    )}
                  </View>
                </View>
              </Modal>

              {newTrip.friends.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Selected Friends:</Text>
                  {newTrip.friends.map((friend, index) => (
                    <View key={index} style={styles.friendItem}>
                      <Text style={styles.listItem}>• {friend.username}</Text>
                      <TouchableOpacity onPress={() => handleRemoveFriend(friend.id)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplies</Text>
              <TextInput
                style={[styles.input, {height: 80}]}
                value={newTrip.supplies}
                onChangeText={(text) => setNewTrip({...newTrip, supplies: text})}
                placeholder="List your supplies here"
                multiline
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleAddTrip}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Trip</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTrip;