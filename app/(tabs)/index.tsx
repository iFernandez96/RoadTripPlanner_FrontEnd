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
  Alert
} from 'react-native';

interface Trip {
  id: number;
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

export default function RoadTripPlannerApp() {
 const [trips, setTrips] = useState<Trip[]>([]);
   const [tripIds, setTripIds] = useState<number[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();
   const { logout } = useAuth();

   useEffect(() => {
     fetchTripsIds();
   }, []);

   useEffect(() => {
     if (tripIds.length > 0) {
       fetchTrips();
     } else if (!isLoading) {
       setTrips([]);
     }
   }, [tripIds]);

   const fetchTripsIds = async () => {
     try {
       setIsLoading(true);
       setError(null);

       const fetchedTripIds = await tripService.getUsersTripsId();
       setTripIds(fetchedTripIds);
     } catch (err) {
       console.error('Failed to fetch trip IDs:', err);
       setError('Failed to load trips. Please try again later.');
       setIsLoading(false);
     }
   };

   const fetchTrips = async () => {
     try {
       setIsLoading(true);
       setError(null);

       const fetchedTrips = await tripService.getMultipleTrips(tripIds);
       setTrips(fetchedTrips);
     } catch (err) {
       console.error('Failed to fetch trip details:', err);
       setError('Failed to load trip details. Please try again later.');
     } finally {
       setIsLoading(false);
     }
   };
  const handleLogout = (): void => {
    logout();
  };

  const openTripDetails = (trip: Trip) => {
    router.push({
      pathname: '/screens/viewTrip',
      params: { tripId: trip.id }
    });
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => openTripDetails(item)}
    >
      <Text style={styles.tripTitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.tripDescription}>{item.description}</Text>
      )}
      <View style={styles.tripInfoRow}>
        <Text style={styles.tripDates}>{item.start_date} → {item.end_date}</Text>
        <Text style={styles.tripLocations}>{item.start_location} → {item.end_location}</Text>
      </View>
      <View style={styles.viewDetailsContainer}>
        <Text style={styles.viewDetailsText}>View Details</Text>
      </View>
    </TouchableOpacity>
  );

  const handleCreateTrip = (): void => {
    router.push('/screens/createTrip');
  };

  const handleRefresh = () => {
    fetchTrips();
  };

  const TripOverview = () => (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Trips</Text>
        <View style={styles.headerButtonContainer}>
          {error && (
            <TouchableOpacity
              style={[styles.button, styles.refreshButton]}
              onPress={handleRefresh}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
          )}
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
          <ActivityIndicator size="large" color="#0066cc" />
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
            keyExtractor={(item) => item.id}
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
          <Text style={styles.subtitle}>Plan, organize, and collaborate on road trips effortlessly.</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.main}>
          <TripOverview />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}