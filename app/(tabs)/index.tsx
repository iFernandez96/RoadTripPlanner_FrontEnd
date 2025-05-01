import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import styles from '../css/index';
import { useAuth } from '../context/AuthContext';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
  Platform
} from 'react-native';

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

const initialTrips: Trip[] = [
  {
    id: 1,
    title: "Pacific Coast Highway",
    start_date: "2025-06-01",
    end_date: "2025-06-10",
    start_location: "San Francisco",
    end_location: "San Diego",
    stops: ["Monterey", "Big Sur", "Santa Barbara", "Los Angeles"],
    friends: ["Alex", "Jordan"],
    supplies: "Sunscreen, hiking shoes, camera, beach towels"
  },
  {
    id: 2,
    title: "Southwest Loop",
    start_date: "2025-07-05",
    end_date: "2025-07-15",
    start_location: "Phoenix",
    end_location: "Phoenix",
    stops: ["Grand Canyon", "Zion", "Bryce Canyon", "Monument Valley"],
    friends: ["Chris", "Taylor", "Morgan"],
    supplies: "Water bottles, hiking boots, tent, camping gear, first aid kit"
  }
];

export default function RoadTripPlannerApp() {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [tripDetailsModalVisible, setTripDetailsModalVisible] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { logout } = useAuth();
  const handleLogout = (): void => {
    logout();
  };

  const openTripDetails = () => {
    router.push('/screens/viewTrip');
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => openTripDetails()}
    >
      <Text style={styles.tripTitle}>{item.title}</Text>
      <Text style={styles.tripDescription}>{item.description}</Text>
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

  const TripOverview = () => (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Trips</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateTrip}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>+ New Trip</Text>
        </TouchableOpacity>
      </View>

      {trips.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTrip}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No trips planned yet!</Text>
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