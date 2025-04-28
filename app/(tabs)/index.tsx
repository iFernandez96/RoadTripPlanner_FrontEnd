import React, { useState } from 'react';
import { useRouter } from 'expo-router';

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

const initialTrips = [
  {
    id: 1,
    title: "Pacific Coast Highway",
    description: "San Francisco to San Diego along the coast",
    start_date: "2025-06-01",
    end_date: "2025-06-10",
    stops: ["Monterey", "Big Sur", "Santa Barbara", "Los Angeles"],
    notes: "Remember to book hotels with ocean views. Plan for stops at state beaches along the way."
  },
  {
    id: 2,
    title: "Southwest Loop",
    description: "Arizona and Utah National Parks",
    start_date: "2025-07-05",
    end_date: "2025-07-15",
    stops: ["Grand Canyon", "Zion", "Bryce Canyon", "Monument Valley"],
    notes: "High temperatures expected. Bring plenty of water and sun protection."
  }
];

export default function RoadTripPlannerApp() {
  const [trips, setTrips] = useState(initialTrips);
  const [newTripModalVisible, setNewTripModalVisible] = useState(false);
  const [tripDetailsModalVisible, setTripDetailsModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

  const [newTrip, setNewTrip] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    stops: [],
    notes: ''
  });

  const handleAddTrip = () => {
    if (newTrip.title && newTrip.start_date && newTrip.end_date) {
      const trip = {
        id: trips.length + 1,
        ...newTrip,
        stops: newTrip.stops || []
      };
      setTrips([...trips, trip]);
      setNewTripModalVisible(false);
      setNewTrip({ title: '', description: '', start_date: '', end_date: '', stops: [], notes: '' });
    }
  };

  const openTripDetails = (trip) => {
    setSelectedTrip(trip);
    setTripDetailsModalVisible(true);
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => openTripDetails(item)}
    >
      <Text style={styles.tripTitle}>{item.title}</Text>
      <Text style={styles.tripDescription}>{item.description}</Text>
      <Text style={styles.tripDates}>{item.start_date} → {item.end_date}</Text>
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



  const TripDetailsModal = () => {
    if (!selectedTrip) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={tripDetailsModalVisible}
        onRequestClose={() => setTripDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.tripDetailHeader}>
              <Text style={styles.modalTitle}>{selectedTrip.title}</Text>
              <Text style={styles.tripDetailDates}>{selectedTrip.start_date} → {selectedTrip.end_date}</Text>
            </View>

            <ScrollView style={styles.tripDetailsScrollView}>
              <View style={styles.tripDetailSection}>
                <Text style={styles.tripDetailSectionTitle}>Description</Text>
                <Text style={styles.tripDetailText}>{selectedTrip.description}</Text>
              </View>

              {selectedTrip.stops && selectedTrip.stops.length > 0 && (
                <View style={styles.tripDetailSection}>
                  <Text style={styles.tripDetailSectionTitle}>Planned Stops</Text>
                  {selectedTrip.stops.map((stop, index) => (
                    <View key={index} style={styles.stopItem}>
                      <Text style={styles.stopNumber}>{index + 1}</Text>
                      <Text style={styles.stopName}>{stop}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedTrip.notes && (
                <View style={styles.tripDetailSection}>
                  <Text style={styles.tripDetailSectionTitle}>Notes</Text>
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesText}>{selectedTrip.notes}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.button, {marginTop: 16}]}
              onPress={() => setTripDetailsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Road Trip Planner</Text>
          <Text style={styles.subtitle}>Plan, organize, and collaborate on road trips effortlessly.</Text>
        </View>

        <View style={styles.main}>
          <TripOverview />
        </View>
      </ScrollView>
      <TripDetailsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', 
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af', 
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b', 
    textAlign: 'center',
    marginTop: 8,
  },
  main: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
 
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a', 
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#334155', 
  },
  button: {
    backgroundColor: '#3b82f6', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9', 
    marginRight: 12,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelButtonText: {
    color: '#64748b', 
    fontWeight: '600',
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#e2e8f0',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  listItem: {
    backgroundColor: '#f8fafc', 
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', 
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a', 
    marginBottom: 4,
  },
  tripDescription: {
    color: '#475569', 
    marginBottom: 8,
  },
  tripDates: {
    fontSize: 14,
    color: '#64748b', 
    fontWeight: '500',
  },
  viewDetailsContainer: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  viewDetailsText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b', 
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#94a3b8', 
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0f172a', 
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 4,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0', 
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#475569', 
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  tripDetailHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  tripDetailDates: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  tripDetailsScrollView: {
    maxHeight: 400,
  },
  tripDetailSection: {
    marginBottom: 24,
  },
  tripDetailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  tripDetailText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  stopNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontWeight: '600',
  },
  stopName: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: '#fef3c7', 
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  notesText: {
    fontSize: 15,
    color: '#78350f', 
    lineHeight: 22,
  },
});