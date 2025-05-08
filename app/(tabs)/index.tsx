import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import styles from '../css/index';
import { useAuth } from '../context/AuthContext';
import tripService from '../context/tripService';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput
} from 'react-native';

interface Trip {
  id: number;
  trip_id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_location: string;
  end_location: string;
  stops?: string[];
  notes?: string;
  friends?: string[];
  supplies?: string;
}

interface NewTrip {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_location: string;
  end_location: string;
}

export default function RoadTripPlannerApp() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripIds, setTripIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [expandedTripId, setExpandedTripId] = useState<number | null>(null);
  const router = useRouter();
  const { logout, getToken } = useAuth();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newTrip, setNewTrip] = useState<NewTrip>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_location: '',
    end_location: ''
  });

  useEffect(() => {
    fetchTripsIds();
  }, []);

  useEffect(() => {
    if (tripIds.length > 0) {
      fetchTrips();
    } else {
      setIsLoading(false);
      setTrips([]);
    }
  }, [tripIds]);

  const fetchTripsIds = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        console.log('No auth token available');
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        return;
      }

      const fetchedTripIds = await tripService.getUsersTripsId();
      console.log('Fetched trip IDs:', fetchedTripIds);
      setTripIds(fetchedTripIds);

      if (fetchedTripIds.length === 0) {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch trip IDs:', err);
      setError('Failed to load trips. Please try again later.');
      setIsLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      setError(null);

      if (!isLoading) {
        setIsLoading(true);
      }

      const fetchedTrips = await tripService.getMultipleTrips(tripIds);
      console.log('Fetched trips:', fetchedTrips);
      setTrips(fetchedTrips);

    } catch (err) {
      console.error('Failed to fetch trip details:', err);
      setError('Failed to load trip details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      // Router navigation handled by AuthContext
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleTripOptions = (tripId: number) => {
    setExpandedTripId(expandedTripId === tripId ? null : tripId);
  };

  const navigateToScreen = (screenPath: string, tripId: number) => {
    router.push({
      pathname: screenPath,
      params: { tripId: tripId.toString() }
    });
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <View style={styles.listItem} key={item.trip_id.toString()}>
      <TouchableOpacity
        style={styles.tripHeader}
        onPress={() => toggleTripOptions(item.trip_id)}
      >
        <Text style={styles.tripTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.tripDescription}>{item.description}</Text>
        )}
        <View style={styles.tripInfoRow}>
          <Text style={styles.tripDates}>
            {item.start_date} → {item.end_date || item.start_date}
          </Text>
          <Text style={styles.tripLocations}>
            {item.start_location || 'N/A'} → {item.end_location || 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>

      {expandedTripId === item.trip_id && (
        <View style={styles.tripOptionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.viewDetailsOption]}
            onPress={() => navigateToScreen('/screens/viewTrip', item.trip_id)}
          >
            <Text style={styles.optionButtonText}>View Trip Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.addStintOption]}
            onPress={() => navigateToScreen('/screens/createStint', item.trip_id)}
          >
            <Text style={styles.optionButtonText}>Add Stint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.addStopsOption]}
            onPress={() => navigateToScreen('/screens/addStops', item.trip_id)}
          >
            <Text style={styles.optionButtonText}>Add Stops</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.addSuppliesOption]}
            onPress={() => navigateToScreen('/screens/additionsTrips', item.trip_id)}
          >
            <Text style={styles.optionButtonText}>Add Supplies/Participants</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleCreateTrip = (): void => {
    setModalVisible(true);
  };

  const validateForm = (): boolean => {
    if (!newTrip.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a trip title');
      return false;
    }
    if (!newTrip.start_date.trim()) {
      Alert.alert('Validation Error', 'Please enter a start date');
      return false;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newTrip.start_date)) {
      Alert.alert('Validation Error', 'Please enter a valid date in YYYY-MM-DD format');
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
      setIsSubmitting(true);

      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Your session has expired. Please log in again.');
        setIsSubmitting(false);
        return;
      }

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

      setNewTrip({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        start_location: '',
        end_location: ''
      });
      setModalVisible(false);

      fetchTripsIds();

    } catch (error: any) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', `Failed to create trip: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchTripsIds();
  };

  const handleInputChange = (field: keyof NewTrip, value: string) => {
    setNewTrip(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const TripOverview = () => (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Trips</Text>
        <View style={styles.headerButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.refreshButton]}
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateTrip}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>+ New Trip</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading trips...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : trips.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={trips}
            keyExtractor={(item) => item.trip_id.toString()}
            renderItem={renderTrip}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No trips found!</Text>
          <Text style={styles.emptyStateSubtext}>Tap the button above to create your first trip.</Text>
        </View>
      )}
    </View>
  );

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

          <Text style={styles.subtitle}>Plan, organize, and collaborate on road trips effortlessly.</Text>
        </View>

        <View style={styles.main}>
          <TripOverview />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create New Trip</Text>

            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trip title"
              value={newTrip.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />

            <Text style={styles.inputLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter trip description"
              value={newTrip.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline={true}
              numberOfLines={4}
            />

            <Text style={styles.inputLabel}>Start Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={newTrip.start_date}
              onChangeText={(text) => handleInputChange('start_date', text)}
            />

            <View style={styles.buttonContainer1}>
              <TouchableOpacity
                style={[styles.button1, styles.cancelButton1]}
                onPress={() => {
                  setNewTrip({
                    title: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    start_location: '',
                    end_location: ''
                  });
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText1}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button1, styles.createButton1]}
                onPress={handleAddTrip}
                disabled={isSubmitting}
              >
                <Text style={styles.createButtonText1}>
                  {isSubmitting ? 'Creating...' : 'Create Trip'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
