import React, { useState, useEffect } from 'react';
import { styles } from '../css/viewTrip';

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


export default ViewTrip;