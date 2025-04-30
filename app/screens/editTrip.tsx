import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

const EditTrip = () => {
  const [trip, setTrip] = useState<Trip>(sampleTrip);
  const [currentStop, setCurrentStop] = useState('');
  const [currentFriend, setCurrentFriend] = useState('');

  useEffect(() => {

    setTrip(sampleTrip);
  }, []);

  const handleUpdateTrip = () => {
    if (!trip.title || !trip.start_date || !trip.end_date || !trip.start_location || !trip.end_location) {
      Alert.alert('Required Fields', 'Please fill in all the required fields');
      return;
    }

    console.log('Updating trip:', trip);
    Alert.alert(
      'Trip Updated',
      'Your trip has been successfully updated!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleAddStop = () => {
    if (currentStop.trim()) {
      setTrip({
        ...trip,
        stops: [...trip.stops, currentStop.trim()]
      });
      setCurrentStop('');
    }
  };

  const handleRemoveStop = (indexToRemove: number) => {
    setTrip({
      ...trip,
      stops: trip.stops.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleAddFriend = () => {
    if (currentFriend.trim()) {
      setTrip({
        ...trip,
        friends: [...trip.friends, currentFriend.trim()]
      });
      setCurrentFriend('');
    }
  };

  const handleRemoveFriend = (indexToRemove: number) => {
    setTrip({
      ...trip,
      friends: trip.friends.filter((_, index) => index !== indexToRemove)
    });
  };

  const onClose = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', onPress: () => router.back() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.modalTitle}>Edit Trip</Text>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Trip Title *</Text>
              <TextInput
                style={styles.input}
                value={trip.title}
                onChangeText={(text) => setTrip({...trip, title: text})}
                placeholder="Ex: Bois Trip"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={trip.start_date}
                  onChangeText={(text) => setTrip({...trip, start_date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Date *</Text>
                <TextInput
                  style={styles.input}
                  value={trip.end_date}
                  onChangeText={(text) => setTrip({...trip, end_date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Location *</Text>
                <TextInput
                  style={styles.input}
                  value={trip.start_location}
                  onChangeText={(text) => setTrip({...trip, start_location: text})}
                  placeholder="Ex: Salinas"
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Location *</Text>
                <TextInput
                  style={styles.input}
                  value={trip.end_location}
                  onChangeText={(text) => setTrip({...trip, end_location: text})}
                  placeholder="Ex: San Francisco"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Stops</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, {flex: 1, marginRight: 8}]}
                  value={currentStop}
                  onChangeText={setCurrentStop}
                  placeholder="Ex: San Jose"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddStop}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              {trip.stops.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Stops:</Text>
                  {trip.stops.map((stop, index) => (
                    <View key={index} style={styles.listItemContainer}>
                      <Text style={styles.listItem}>• {stop}</Text>
                      <TouchableOpacity onPress={() => handleRemoveStop(index)}>
                        <Text style={styles.removeButton}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Friends</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, {flex: 1, marginRight: 8}]}
                  value={currentFriend}
                  onChangeText={setCurrentFriend}
                  placeholder="Ex: Bob123"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddFriend}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              {trip.friends.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Friends:</Text>
                  {trip.friends.map((friend, index) => (
                    <View key={index} style={styles.listItemContainer}>
                      <Text style={styles.listItem}>• {friend}</Text>
                      <TouchableOpacity onPress={() => handleRemoveFriend(index)}>
                        <Text style={styles.removeButton}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplies</Text>
              <TextInput
                style={[styles.input, {height: 80}]}
                value={trip.supplies}
                onChangeText={(text) => setTrip({...trip, supplies: text})}
                placeholder="List your supplies here"
                multiline
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateTrip}
              >
                <Text style={styles.buttonText}>Update Trip</Text>
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
  saveButton: {
    backgroundColor: '#22c55e',
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
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
    flex: 1,
  },
  removeButton: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 14,
    padding: 4,
  },
});

export default EditTrip;