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

interface TimelineData {
  trip_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_distance: number;
  total_duration: number;
  stints: StintData[];
}

interface StintData {
  stint_id: number;
  name: string;
  sequence_number: number;
  distance: number;
  estimated_duration: number;
  notes: string;
  start_time: string;
  end_time: string;
  continues_from_previous: boolean;
  start_location_name: string;
  end_location_name: string;
  timeline?: TimelineItem[];
}

interface TimelineItem {
  type: string;
  sequence_number: number;
  item: any;
}

const CreateStint: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTripDetails, setSelectedTripDetails] = useState<TimelineData | null>(null);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSequenceNumber, setLastSequenceNumber] = useState<number>(0);
  const [usedBasicTripData, setUsedBasicTripData] = useState<boolean>(false);

  const params = useLocalSearchParams();
  const tripId = typeof params.tripId === 'string' ? parseInt(params.tripId, 10) : 0;

  const [newTrip, setNewTrip] = useState<TripFormData>({
    title: '',
    description: '',
    start_date: '',
    start_location: '',
    notes: ''
  });

  const [newStint, setNewStint] = useState({
    name: '',
    notes: ''
  });


  const formatDateForAPI = (dateString: string): string => {

    if (dateString.includes('T')) {
      return dateString;
    }

    return `${dateString}T00:00:00Z`;
  };


  useEffect(() => {
    const loadTripData = async () => {
      try {
        await fetchTripTimeline(tripId);
      } catch (error) {
        console.error("Failed to load trip timeline:", error);

        const tripBasicData = await retrieveTripData();
        if (tripBasicData) {
          setTripData(tripBasicData);
          setUsedBasicTripData(true);


          setNewTrip(prev => ({
            ...prev,
            title: tripBasicData.title || '',
            description: tripBasicData.description || '',
            start_date: tripBasicData.start_date || ''
          }));
        }
      }
    };

    loadTripData();
  }, [tripId]);

  useEffect(() => {
    if (selectedTripDetails && selectedTripDetails.stints && selectedTripDetails.stints.length > 0) {
      const lastStint = selectedTripDetails.stints.reduce((max, stint) =>
        stint.sequence_number > max.sequence_number ? stint : max,
        selectedTripDetails.stints[0]
      );
      setLastSequenceNumber(lastStint.sequence_number);

      setNewTrip(prev => ({
        ...prev,
        start_date: selectedTripDetails.start_date,
        title: selectedTripDetails.title,
        description: selectedTripDetails.description
      }));
    }
  }, [selectedTripDetails]);

  const validateForm = (): boolean => {
    const stints = selectedTripDetails?.stints || [];
    const hasExistingStints = stints.length > 0;

    if (hasExistingStints) {
      if (!newStint.name.trim()) {
        Alert.alert('Required Field', 'Please enter a stint name');
        return false;
      }
    } else {
      if (!newTrip.start_location.trim()) {
        Alert.alert('Required Field', 'Please enter a start location');
        return false;
      }

      if (!newTrip.start_date) {
        Alert.alert('Required Field', 'Start date is missing. Please try again.');
        return false;
      }
    }

    return true;
  };

  const fetchTripTimeline = async (tripId) => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedTripTimeline = await tripService.getTimelineById(tripId);
      setSelectedTripDetails(fetchedTripTimeline);
      console.log('Trip timeline fetched:', fetchedTripTimeline);
    } catch (err) {
      console.error('Failed to fetch TripTimeline details:', err);
      setError('Failed to load timeline details. Using basic trip information instead.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveTripData = async () => {
    try {
      setIsLoading(true);
      console.log('Retrieving trip meta data:', tripId);
      const result = await tripService.getTripById(tripId);
      console.log('Retrieved trip meta data successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error retrieving trip meta data:', error);
      Alert.alert('Error', `Failed retrieving trip data: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
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

      const stints = selectedTripDetails?.stints || [];
      const hasExistingStints = stints.length > 0;

      if (hasExistingStints) {
        const stintData = {
          name: newStint.name || "New Stint",
          sequence_number: lastSequenceNumber + 1,
          trip_id: tripId,
          notes: newStint.notes || "Additional stint: "+newStint.name
        };

        console.log('Adding new sequential stint:', JSON.stringify(stintData, null, 2));
        const result = await tripService.createStint(stintData);
        console.log('New sequential stint added successfully:', result);

        if (result && result.stint_id) {
          setIsLoading(false);
          setIsSubmitting(false);

          router.push({
            pathname: '/screens/addStops',
            params: {
              tripId: tripId,
              stintId: result.stint_id
            }
          });
        } else {
          throw new Error('Failed to create new stint');
        }
      } else {
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
      }
    } catch (error: any) {
      console.error('Error creating stint:', error);
      Alert.alert('Error', `Failed to create stint: ${error.message}`);
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
          notes: "Our journey begins here: " + initialStopName
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

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  const hasExistingStints = selectedTripDetails?.stints && selectedTripDetails.stints.length > 0;

  const tripDisplayData = selectedTripDetails || tripData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.modalTitle}>
            {hasExistingStints ? 'Add New Stint To Trip' : 'Add First Stint To Trip'}
          </Text>

          {tripDisplayData && (
            <View style={styles.tripInfoContainer}>
              <Text style={styles.tripTitle}>{tripDisplayData.title}</Text>
              <Text style={styles.tripDates}>
                {formatDateForDisplay(tripDisplayData.start_date)}
              </Text>

              {hasExistingStints && (
                <Text style={styles.existingStintsInfo}>
                  Trip has {selectedTripDetails?.stints.length} existing stint(s)
                </Text>
              )}
            </View>
          )}


          <View style={styles.form}>
            {hasExistingStints ? (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Stint Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={newStint.name}
                    onChangeText={(text) => setNewStint({...newStint, name: text})}
                    placeholder="Ex: Sierra Nevada Mountains"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Notes</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newStint.notes}
                    onChangeText={(text) => setNewStint({...newStint, notes: text})}
                    placeholder="Any details about this part of the trip"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.formGroup}>
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
              </>
            )}
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
                <Text style={styles.buttonText}>
                  {hasExistingStints ? 'Add Stint' : 'Add First Stint'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateStint;