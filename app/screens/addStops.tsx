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

type StopType = 'pitstop' | 'overnight'| 'gas'| 'food'| 'attraction'| 'other';

interface Stop {
  name: string;
  type: StopType;
  notes: string;
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
  friends: {id: string, username: string, role: FriendRole}[];
  supplies: Supply[];
}

const AddStops: React.FC = () => {
  const params = useLocalSearchParams();
  // Convert string params to numbers
  const tripId = typeof params.tripId === 'string' ? parseInt(params.tripId, 10) : 0;
  const stintId = typeof params.stintId === 'string' ? parseInt(params.stintId, 10) : 1;;

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
    supplies: []
  });

  const [newSupply, setNewSupply] = useState<Supply>({
    name: '',
    quantity: 1,
    category: 'other',
    notes: ''
  });

  const [showSupplyModal, setShowSupplyModal] = useState<boolean>(false);
  const [currentStop, setCurrentStop] = useState<string>('');
  const [showStopsModal, setShowStopsModal] = useState<boolean>(false);
  const [newStop, setNewStop] = useState<Stop>({
    name: '',
    type: 'pitstop',
    notes: ''
  });

  useEffect(() => {

    console.log("Received params - tripId:", tripId, "stintId:", stintId);

    // Validate tripId and stintId
    if (isNaN(tripId) || isNaN(stintId) || tripId <= 0 || stintId <= 0) {
      Alert.alert('Invalid Parameters', 'Trip ID or Stint ID is invalid');
    }
  }, [tripId, stintId]);


  const handleAddTrip = async () => {
    if (isSubmitting) return;
    try {
      setIsLoading(true);
      setIsSubmitting(true);

      if (isNaN(tripId) || isNaN(stintId) || tripId <= 0 || stintId <= 0) {
        Alert.alert('Error', 'Trip ID or Stint ID is invalid');
        setIsLoading(false);
        setIsSubmitting(false);
        return;
      }

      if (newTrip.stops.length > 0) {
        for (let i = 0; i < newTrip.stops.length; i++) {
          const stop = newTrip.stops[i];
          const stopType: StopType = "pitstop";

          await handleAddStopToTrip(
            tripId,
            stopType,
            stintId,
            stop,
            "Intermediate stop",
            30
          );
        }
      }

      if (newTrip.end_location && newTrip.end_location !== newTrip.start_location) {
        await handleAddFinalStopToTrip(
          tripId,
          'other',
          stintId,
          newTrip.end_location,
          "end",
          30
        );
      }

      Alert.alert(
        'Success',
        'Trip details added successfully!',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (error: any) {
      console.error('Error updating trip:', error);
      Alert.alert('Error', `Failed to update trip: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
        router.push({
                       pathname: '/screens/additionsTrips',
                       params: {
                         tripId: tripId
                       }
                     });
     }
  };

  const handleAddStopToTrip = async (
    tripId: number,
    stopType: StopType,
    stintId: number,
    name: string,
    notes: string,
    duration: number | string
  ) => {
    try {
      const location = {
        address: name
      };
      const locationResponse = await tripService.getLocationCoord(location);

      const locationItem = locationResponse.location;
      const address = locationItem.address;
      const city = locationItem.city || '';
      const state = locationItem.state || '';
      const postalCode = locationItem.postal_code || '';
      const latitude = locationItem.latitude;
      const longitude = locationItem.longitude;

      const stopData = {
        name: name,
        latitude: latitude,
        longitude: longitude,
        address: address,
        stop_type: stopType,
        duration: duration,
        notes: notes,
        trip_id: tripId,
        stint_id: stintId,
        city: city,
        state: state,
        postal_code: postalCode
      };

      console.log('Adding Stop to trip:', JSON.stringify(stopData, null, 2));
      const result = await tripService.createStop(stopData);
      console.log('Stop added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding stop to trip:', error);
      Alert.alert('Error', `Failed to add stop: ${error.message}`);
      return null;
    }
  };

  const handleAddFinalStopToTrip = async (
    tripId: number,
    stopType: StopType,
    stintId: number,
    name: string,
    notes: string,
    duration: number | string
  ) => {
    try {
      const location = {
        address: name
      };
      const locationResponse = await tripService.getLocationCoord(location);

      const locationItem = locationResponse.location;
      const address = locationItem.address;
      const city = locationItem.city || '';
      const state = locationItem.state || '';
      const postalCode = locationItem.postal_code || '';
      const latitude = locationItem.latitude;
      const longitude = locationItem.longitude;

      const stopData = {
        name: name,
        latitude: latitude,
        longitude: longitude,
        address: address,
        stop_type: stopType,
        duration: duration,
        notes: notes,
        trip_id: tripId,
        stint_id: stintId,
        city: city,
        state: state,
        postal_code: postalCode
      };

      console.log('Adding Final Stop to trip:', JSON.stringify(stopData, null, 2));
      const result = await tripService.createStop(stopData);
      console.log('Final Stop added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding final stop to trip:', error);
      Alert.alert('Error', `Failed to add final stop: ${error.message}`);
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

  const openStopsModal = () => {
    setNewStop({
      name: '',
      type: 'pitstop',
      notes: ''
    });
    setShowStopsModal(true);
  };

  const handleAddStopFromModal = () => {
    if (!newStop.name.trim()) {
      Alert.alert('Required Field', 'Please enter a stop name');
      return;
    }

    setNewTrip({
      ...newTrip,
      stops: [...newTrip.stops, newStop.name.trim()]
    });

    setNewStop({
      name: '',
      type: 'pitstop',
      notes: ''
    });

    setShowStopsModal(false);
  };

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...newTrip.stops];
    updatedStops.splice(index, 1);
    setNewTrip({
      ...newTrip,
      stops: updatedStops
    });
  };

  const onClose = () => {
    router.back();
  };
  const onSkip = () => {
      router.push('/');
    };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.modalTitle}>Add Trip Stops</Text>

          <View style={styles.form}>

            <View style={styles.formGroup}>
              <Text style={styles.label}>End Location</Text>
              <TextInput
                style={styles.input}
                value={newTrip.end_location}
                onChangeText={(text) => setNewTrip({...newTrip, end_location: text})}
                placeholder="Where your trip ends"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Stops:</Text>


              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={openStopsModal}
              >
                <Text style={styles.dropdownButtonText}>
                  Add detailed stop
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showStopsModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStopsModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.dropdownContainer}>
                    <View style={styles.dropdownHeader}>
                      <Text style={styles.dropdownTitle}>Add Stop</Text>
                      <TouchableOpacity onPress={() => setShowStopsModal(false)}>
                        <Text style={styles.closeButton}>Cancel</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Name *</Text>
                      <TextInput
                        style={styles.input}
                        value={newStop.name}
                        onChangeText={(text) => setNewStop({...newStop, name: text})}
                        placeholder="Stop name"
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Type</Text>
                      <View style={styles.categoryContainer}>
                        {['pitstop', 'overnight', 'gas', 'food', 'attraction', 'other'].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.categoryButton,
                              newStop.type === type && styles.categoryButtonSelected
                            ]}
                            onPress={() => setNewStop({...newStop, type: type as StopType})}
                          >
                            <Text
                              style={[
                                styles.categoryButtonText,
                                newStop.type === type && styles.categoryButtonTextSelected
                              ]}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Notes</Text>
                      <TextInput
                        style={[styles.input, {height: 60}]}
                        value={newStop.notes}
                        onChangeText={(text) => setNewStop({...newStop, notes: text})}
                        placeholder="Additional notes"
                        multiline
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleAddStopFromModal}
                    >
                      <Text style={styles.cancelButtonText}>Add Stop</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {newTrip.stops.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Added Stops:</Text>
                  {newTrip.stops.map((stop, index) => (
                    <View key={index} style={styles.friendItem}>
                      <Text style={styles.listItem}>• {stop}</Text>
                      <TouchableOpacity onPress={() => handleRemoveStop(index)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
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
                style={[styles.button, styles.cancelButton]}
                onPress={onSkip}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Skip For Now</Text>
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

export default AddStops;