import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { router } from 'expo-router';

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

const sampleTrip: Trip = {
  id: 1,
  title: "Pacific Coast Highway",
  description: "",
  start_date: "2025-06-01",
  end_date: "2025-06-10",
  start_location: "San Francisco",
  end_location: "San Diego",
  stops: ["Monterey", "Big Sur", "Santa Barbara", "Los Angeles"],
  notes: "",
  friends: ["Alex", "Jordan"],
  supplies: "Sunscreen, hiking shoes, camera, beach towels"
};

const ViewTrip = () => {
  const [trip, setTrip] = useState<Trip>(sampleTrip);
  useEffect(() => {

    setTrip(sampleTrip);
  }, []);

  const onClose = () => {
    router.back();
  };

  const handleEditTrip = () => {
      router.push('/screens/editTrip');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.modalTitle}>{trip.title}</Text>

          <View style={styles.form}>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Date</Text>
                <Text style={styles.valueText}>{trip.start_date}</Text>
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Date</Text>
                <Text style={styles.valueText}>{trip.end_date}</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Location</Text>
                <Text style={styles.valueText}>{trip.start_location}</Text>
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Location</Text>
                <Text style={styles.valueText}>{trip.end_location}</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Stops</Text>
              {trip.stops.length > 0 ? (
                <View style={styles.listContainer}>
                  {trip.stops.map((stop, index) => (
                    <Text key={index} style={styles.listItem}>• {stop}</Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No stops planned</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Friends</Text>
              {trip.friends.length > 0 ? (
                <View style={styles.listContainer}>
                  {trip.friends.map((friend, index) => (
                    <Text key={index} style={styles.listItem}>• {friend}</Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No friends added</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplies</Text>
              {trip.supplies ? (
                <Text style={styles.valueText}>{trip.supplies}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0f172a',
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#475569',
    fontSize: 15,
  },
  valueText: {
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  subLabel: {
    fontWeight: '500',
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 12,
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
  listContainer: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
});

export default ViewTrip;