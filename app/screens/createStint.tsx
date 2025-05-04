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
import { router, useLocalSearchParams } from 'expo-router';
import tripService from '../context/tripService';
import authService from '../context/authService';

interface TripFormData {
  title: string;
  description: string;
  start_date: string;
  start_location: string;
  notes: string;
}

interface TripData {
  trip_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_distance: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  creator_id: number;
}

const CreateStint: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tripData, setTripData] = useState<TripData | null>(null);

  const params = useLocalSearchParams();
  const tripId = typeof params.tripId === 'string' ? parseInt(params.tripId, 10) : 0;

  const [newTrip, setNewTrip] = useState<TripFormData>({
    title: '',
    description: '',
    start_date: '',
    start_location: '',
    notes: ''
  });

  // Format date for API (YYYY-MM-DD to ISO format)
  const formatDateForAPI = (dateString: string): string => {
    // If already in ISO format, return as is
    if (dateString.includes('T')) {
      return dateString;
    }

    // Otherwise, convert YYYY-MM-DD to ISO format
    return `${dateString}T00:00:00Z`;
  };

  // Load trip data when component mounts
  useEffect(() => {
    const loadTripData = async () => {
      setIsLoading(true);
      try {
        const data = await retrieveTripData();
        if (data) {
          setTripData(data);
          // Populate the start date from trip data
          setNewTrip(prev => ({
            ...prev,
            start_date: data.start_date
          }));
        }
      } catch (error) {
        console.error("Failed to load trip data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTripData();
  }, [tripId]);

  const validateForm = (): boolean => {
    if (!newTrip.start_location.trim()) {
      Alert.alert('Required Field', 'Please enter a start location');
      return false;
    }

    // No need to validate start_date anymore since we're getting it from the trip data
    // But we should check it's present
    if (!newTrip.start_date) {
      Alert.alert('Required Field', 'Start date is missing. Please try again.');
      return false;
    }

    return true;
  };

  const retrieveTripData = async () => {
    try {
      console.log('Retrieving trip meta data:', tripId);
      const result = await tripService.getTripById(tripId);
      console.log('Retrieved trip meta data successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error retrieving trip meta data:', error);
      Alert.alert('Error', `Failed retrieving trip meta data: ${error.message}`);
      return null;
    }
  };

  const handleAddTrip = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setIsSubmitting(true);

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
          pathname: '/screens/addStops',
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
    startDate: string
  ) => {
    try {
      const location = {
        address: initialStopName
      };
      const locationResponse = await tripService.getLocationCoord(location);
      const locationItem = locationResponse.location;
      console.log(locationItem);
      const address = locationItem.address;
      const city = locationItem.city || '';
      const state = locationItem.state || '';
      const postalCode = locationItem.postal_code || '';
      const latitude = locationItem.latitude;
      const longitude = locationItem.longitude;

      // Convert the YYYY-MM-DD format to ISO format for the API
      const formattedDate = formatDateForAPI(startDate);
      console.log('Formatted date for API:', formattedDate);

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
        start_time: formattedDate
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

  // Format date for display (converts ISO to YYYY-MM-DD)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (e) {
      return dateString;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.modalTitle}>Add New Stint To Trip</Text>

          {tripData && (
            <View style={styles.tripInfoContainer}>
              <Text style={styles.tripTitle}>{tripData.title}</Text>
              <Text style={styles.tripDates}>
                {formatDateForDisplay(tripData.start_date)} - {formatDateForDisplay(tripData.end_date)}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.formRow}>
            </View>
          </View>

          <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
            <Text style={styles.label}>Start Location *</Text>
            <TextInput
              style={styles.input}
              value={newTrip.start_location}
              onChangeText={(text) => setNewTrip({...newTrip, start_location: text})}
              placeholder="Ex: Salinas California"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Starting Date</Text>
            <Text style={styles.dateDisplay}>
              {formatDateForDisplay(newTrip.start_date) || 'Loading date...'}
            </Text>
            <Text style={styles.helpText}>Using trip's start date</Text>
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

export default CreateStint;