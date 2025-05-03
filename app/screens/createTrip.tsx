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

interface TripFormData {
  title: string;
  description: string;
  start_date: string;
  start_location: string;
  notes: string;
}

const CreateTrip: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  const [newTrip, setNewTrip] = useState<TripFormData>({
    title: '',
    description: '',
    start_date: '',
    start_location: '',
    notes: ''
  });


  const validateForm = (): boolean => {
    if (!newTrip.title.trim()) {
      Alert.alert('Required Field', 'Please enter a trip title');
      return false;
    }

    if (!newTrip.start_date) {
      Alert.alert('Required Field', 'Please enter a start date');
      return false;
    }

    if (!validateAndFormatDate(newTrip.start_date, 'Start Date')) {
      return false;
    }


    if (newTrip.start_date && newTrip.end_date) {
      const startDate = new Date(newTrip.start_date);
    }

    if (!newTrip.start_location.trim()) {
      Alert.alert('Required Field', 'Please enter a start location');
      return false;
    }


    return true;
  };

  const handleAddTrip = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
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
      const tripId = result.trip_id;
      console.log('Trip created successfully:', result);

      const initialStint = await handleAddInitialStintToTrip(
        tripId,
        "Departure",
        newTrip.start_location,
        "Starting our journey",
        newTrip.start_date
      );

      console.log('Initial stint created:', initialStint);

      if (initialStint && initialStint.stint_id) {
        setIsLoading(false);
        setIsSubmitting(false);

        // Navigate to additionsTrips with tripId and stintId parameters
        router.push({
          pathname: '/screens/additionsTrips',
          params: {
            tripId: tripId,
            stintId: initialStint.stint_id
          }
        });
      } else {
        throw new Error('Failed to create initial stint');
      }
    } catch (error: any) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', `Failed to create trip: ${error.message}`);
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleAddInitialStintToTrip = async (
    tripId: number | string,
    nameStint: string,
    initialStopName: string,
    notes: string,
    startTime: string
  ) => {
    try {
      const location={
         address:initialStopName
         }
     const locationResponse = await tripService.getLocationCoord(location);
      const locationItem = locationResponse.location;
      console.log(locationItem)
      const address = locationItem.address;
      const city = locationItem.city || '';
      const state = locationItem.state || '';
      const postalCode = locationItem.postal_code || '';
      const latitude = locationItem.latitude;
      const longitude = locationItem.longitude;
      const startDate = new Date(startTime);
      console.log(startDate.toISOString());
      const stintData = {
        name: nameStint,
        trip_id: tripId,
        initialStop: {
          name: initialStopName,
          latitude: latitude,
          longitude: longitude,
          address: address,
          city: city,
          state: state,
          postal_code: postalCode,
          stopType: "departure",
          notes: "Our journey begins here"
        },
        notes: notes,
        start_time: '2025-05-15T09:00:00Z'
      };

      console.log('Adding Stint to trip:', JSON.stringify(stintData, null, 2));
      const result = await tripService.createStint(stintData);
      console.log('Stint added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding initial stint to trip:', error);
      Alert.alert('Error', `Failed to add initial stint: ${error.message}`);
      return null;
    }
  };

  const onClose = () => {
    router.back();
  };

  const validateAndFormatDate = (dateText: string, field: string): boolean => {
    if (!dateText) return true;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateText)) {
      Alert.alert('Invalid Date Format', `Please use YYYY-MM-DD format for ${field}`);
      return false;
    }

    const date = new Date(dateText);
    if (isNaN(date.getTime())) {
      Alert.alert('Invalid Date', `The ${field} is not a valid date`);
      return false;
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
                />
              </View>
            </View>
              </View>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Location *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.start_location}
                  onChangeText={(text) => setNewTrip({...newTrip, start_location: text})}
                  placeholder="Ex: Salinas"
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
        </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTrip;