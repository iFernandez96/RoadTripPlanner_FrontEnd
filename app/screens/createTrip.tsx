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
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import tripService from '../context/tripService';
import authService from '../context/authService';

interface TripFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_location: string;
  end_location: string;
  stops: string[];
  notes: string;
  friends: string[];
  supplies: string;
}

const CreateTrip: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
  const [currentFriend, setCurrentFriend] = useState<string>('');

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
        is_public:true
      };

      console.log('Sending trip data to API:', JSON.stringify(tripData, null, 2));
      const result = await tripService.createTrip(tripData);

      console.log('Trip created successfully:', result);

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

  const handleAddStop = () => {
    if (currentStop.trim()) {
      setNewTrip({
        ...newTrip,
        stops: [...newTrip.stops, currentStop.trim()]
      });
      setCurrentStop('');
    }
  };

  const handleAddFriend = () => {
    if (currentFriend.trim()) {
      setNewTrip({
        ...newTrip,
        friends: [...newTrip.friends, currentFriend.trim()]
      });
      setCurrentFriend('');
    }
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
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, {flex: 1, marginRight: 8}]}
                  value={currentFriend}
                  onChangeText={setCurrentFriend}
                  placeholder="Ex: Bob123"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddFriend}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              {newTrip.friends.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Added Friends:</Text>
                  {newTrip.friends.map((friend, index) => (
                    <Text key={index} style={styles.listItem}>• {friend}</Text>
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