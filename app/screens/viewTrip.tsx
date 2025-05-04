import React, { useState, useEffect } from 'react';
import { styles } from '../css/viewTrip';
import tripService from '../context/tripService';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

interface Trip {
  id: number;
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

interface Supply {
  supply_id: number;
  name: string;
  category: string;
  created_at: string;
  quantity: number;
  notes: string;
}

interface User {
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface Participant {
  user_id: number;
}

const ViewTrip = () => {
  const params = useLocalSearchParams();
  const tripId = typeof params.tripId === 'string' ? parseInt(params.tripId, 10) : 0;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTripData = async () => {
      setIsLoading(true);
      try {
        // Fetch trip metadata
        const tripData = await retrieveTripData();

        // Fetch supplies
        const suppliesData = await retrieveTripSupplyData();

        // Fetch participants
        const participantsData = await retrieveTripParticipantsData();

        if (tripData) {
          setTrip(tripData);
        }

        if (suppliesData) {
          setSupplies(Array.isArray(suppliesData) ? suppliesData : [suppliesData]);
        }

        if (participantsData) {
          setParticipants(Array.isArray(participantsData) ? participantsData : [participantsData]);
        }
      } catch (error) {
        console.error('Error fetching trip data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

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

  const retrieveTripSupplyData = async () => {
    try {
      console.log('Retrieving trip supplies meta data:', tripId);
      const result = await tripService.getSuppliesById(tripId);
      console.log('Retrieved trip supplies meta data successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error retrieving trip supplies meta data:', error);
      Alert.alert('Error', `Failed retrieving trip supplies meta data: ${error.message}`);
      return null;
    }
  };

  const retrieveTripParticipantsData = async () => {
    try {
      console.log('Retrieving trip participants meta data:', tripId);
      const participantsResult = await tripService.getParticipantsById(tripId);
      console.log('Retrieved trip participants meta data successfully:', participantsResult);

      // If we have participants, get each user's details
      if (participantsResult) {
        const userDetailsPromises = Array.isArray(participantsResult)
          ? participantsResult.map((participant: Participant) => tripService.getUserById(participant.user_id))
          : [tripService.getUserById(participantsResult.user_id)];

        const userDetails = await Promise.all(userDetailsPromises);
        console.log('Retrieved user details successfully:', userDetails);
        return userDetails;
      }
      return [];
    } catch (error: any) {
      console.error('Error retrieving trip participants meta data:', error);
      Alert.alert('Error', `Failed retrieving trip participants meta data: ${error.message}`);
      return [];
    }
  };

  const onClose = () => {
    router.back();
  };

  const handleEditTrip = () => {
    router.push({
      pathname: '/screens/editTrip',
      params: { trip: tripId.toString() }
    });
  };

  const handleAdditionsTrip = () => {
    router.push({
      pathname: '/screens/additionsTrips',
      params: { trip: tripId.toString() }
    });
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.loadingText}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error message if trip data couldn't be loaded
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.errorText}>Could not load trip details</Text>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.modalTitle}>{trip.title}</Text>

          <View style={styles.form}>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Date</Text>
                <Text style={styles.valueText}>{trip.start_date || "Not specified"}</Text>
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Date</Text>
                <Text style={styles.valueText}>{trip.end_date || "Not specified"}</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Location</Text>
                <Text style={styles.valueText}>{trip.start_location || "Not specified"}</Text>
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Location</Text>
                <Text style={styles.valueText}>{trip.end_location || "Not specified"}</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Friends</Text>
              {participants.length > 0 ? (
                <View style={styles.listContainer}>
                  {participants.map((user, index) => (
                    <Text key={index} style={styles.listItem}>• {user.fullname || user.username}</Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No friends added</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplies</Text>
              {supplies.length > 0 ? (
                <View style={styles.listContainer}>
                  {supplies.map((supply, index) => (
                    <Text key={index} style={styles.listItem}>
                      • {supply.name} {supply.quantity > 1 ? `(${supply.quantity})` : ''}
                      {supply.notes ? ` - ${supply.notes}` : ''}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No supplies listed</Text>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleAdditionsTrip}
              >
                <Text style={styles.buttonText}>Add to Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleEditTrip}
              >
                <Text style={styles.buttonText}>Edit Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewTrip;