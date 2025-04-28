import React, { useState } from 'react';
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

const CreateTrip = () => {
  const [newTrip, setNewTrip] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_location: '',
    end_location: '',
    stops: [],
    notes: '',
    friends: [],
    supplies: ''
  });

  const [currentStop, setCurrentStop] = useState('');
  const [currentFriend, setCurrentFriend] = useState('');

  const handleAddTrip = () => {
    if (!newTrip.title || !newTrip.start_date || !newTrip.end_date || !newTrip.start_location || !newTrip.end_location) {
      Alert.alert('Required Fields', 'Please fill in all the required fields');
      return;
    }
    console.log('Saving trip:', newTrip);
    router.replace('/');
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

  const handleAddFriend = () => {
    if (currentFriend.trim()) {
      setNewTrip({
        ...newTrip,
        friends: [...newTrip.friends, currentFriend.trim()]
      });
      setCurrentFriend('');
    }
  };

  const onClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.modalTitle}>Add New Trip</Text>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Trip Title *</Text>
              <TextInput
                style={styles.input}
                value={newTrip.title}
                onChangeText={(text) => setNewTrip({...newTrip, title: text})}
                placeholder="Ex: Bois Trip"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.start_date}
                  onChangeText={(text) => setNewTrip({...newTrip, start_date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Date *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.end_date}
                  onChangeText={(text) => setNewTrip({...newTrip, end_date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Location *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.start_location}
                  onChangeText={(text) => setNewTrip({...newTrip, start_location: text})}
                  placeholder="Ex: Salinas"
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Location *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.end_location}
                  onChangeText={(text) => setNewTrip({...newTrip, end_location: text})}
                  placeholder="Ex: San Francisco"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Stops:</Text>
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
              {newTrip.stops.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Added Stops:</Text>
                  {newTrip.stops.map((stop, index) => (
                    <Text key={index} style={styles.listItem}>• {stop}</Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Friends:</Text>
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
              {newTrip.friends.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Added Friends:</Text>
                  {newTrip.friends.map((friend, index) => (
                    <Text key={index} style={styles.listItem}>• {friend}</Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplies</Text>
              <TextInput
                style={[styles.input, {height: 80}]}
                value={newTrip.supplies}
                onChangeText={(text) => setNewTrip({...newTrip, supplies: text})}
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
                onPress={handleAddTrip}
              >
                <Text style={styles.buttonText}>Add Trip</Text>
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
  listItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
});

export default CreateTrip;