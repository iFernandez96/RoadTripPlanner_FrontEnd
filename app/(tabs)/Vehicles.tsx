import React, { useState, useEffect } from 'react';
import styles from '../css/vehicles';
import tripService from '../context/tripService';
import { useAuth } from '../context/AuthContext';


import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  SectionList,
  Modal,
  Platform,
  Image,
  ScrollView,
  Picker,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RoadTripPlannerApp() {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripIds, setTripIds] = useState([]);
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [assignTripModalVisible, setAssignTripModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedStintId, setSelectedStintId] = useState('');
  const [collaboratorModalVisible, setCollaboratorModalVisible] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const [newVehicle, setNewVehicle] = useState({
    name: '',
    year: '',
    fuel_capacity: '',
    mpg: '',
    owner_id: ''
  });
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    role: 'member'
  });

  useEffect(() => {
    fetchVehicles();
    fetchUsers();
    fetchTripsIds();
  }, []);

  useEffect(() => {
    if (tripIds && tripIds.length > 0) {
      fetchTrips();
    }
  }, [tripIds]);
 const handleLogout = (): void => {
    logout();
  };
  useEffect(() => {
    if (selectedTripId) {
      fetchTripTimeline(selectedTripId);
    } else {
      setSelectedTripDetails(null);
      setSelectedStintId('');
    }
  }, [selectedTripId]);

  const fetchUsers = async () => {
    try {
      const usersData = await tripService.getUsersIds();
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error('Expected array of users but got:', usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTripsIds = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedTripIds = await tripService.getUsersTripsId();
      setTripIds(fetchedTripIds);
    } catch (err) {
      console.error('Failed to fetch trip IDs:', err);
      setError('Failed to load trips. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedTrips = await Promise.all(
        tripIds.map(id => tripService.getTripById(id))
      );

      setTrips(fetchedTrips.filter(trip => trip !== null));
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setError('Failed to load trips. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTripTimeline = async (tripId) => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedTripTimeline = await tripService.getTimelineById(tripId);
      setSelectedTripDetails(fetchedTripTimeline);
      console.log('Trip timeline fetched:', fetchedTripTimeline);
    } catch (err) {
      console.error('Failed to fetch TripTimeline details:', err);
      setError('Failed to load TripTimeline details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const vehicleData = await tripService.getVehicles();
      if (Array.isArray(vehicleData)) {
        setVehicles(vehicleData);
      } else {
        console.error('Expected array of vehicles but got:', vehicleData);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const vehicleData = {
        name: newVehicle.name,
        year: parseInt(newVehicle.year),
        fuel_capacity: parseFloat(newVehicle.fuel_capacity),
        mpg: parseFloat(newVehicle.mpg),
        owner_id: parseInt(newVehicle.owner_id)
      };

      console.log('Adding vehicle:', JSON.stringify(vehicleData, null, 2));
      const result = await tripService.addVehicle(vehicleData);
      console.log('Vehicle added successfully:', result);

      setVehicleModalVisible(false);
      fetchVehicles();

      setNewVehicle({
        name: '',
        year: '',
        fuel_capacity: '',
        mpg: '',
        owner_id: ''
      });

      return result;
    } catch (error) {
      console.error('Error adding Vehicle:', error);
      return null;
    }
  };
 const getOwnerId = (id) => {
   const vehicleId = typeof id === 'string' ? parseInt(id) : id;
   const vehicle = vehicles.find(v => v.vehicle_id === vehicleId || v.id === vehicleId);

   if (vehicle) {
     console.log(`Found vehicle, owner_id: ${vehicle.owner_id}`);
     return vehicle.owner_id;
   }

   console.log('Vehicle not found');
   return null;
 };
  const handleAssignVehicleToTrip = async () => {
    if (!selectedVehicle || !selectedTripId) {
      Alert.alert("Required Fields", "Please select a trip to assign this vehicle to.");
      return;
    }

    if (!selectedStintId && selectedTripDetails?.stints?.length > 0) {
      Alert.alert("Required Fields", "Please select a specific stint for this vehicle.");
      return;
    }

    try {
      const owId = getOwnerId(selectedVehicle.id)
      const vehicleData1 = {
              stint_id: parseInt(selectedStintId),
              vehicle_id: selectedVehicle.vehicle_id,
              driver_id: owId
            };

      await tripService.addVehicleToStint(parseInt(selectedStintId),vehicleData1);

      Alert.alert(
        "Success",
        `Vehicle "${selectedVehicle.name}" has been assigned to the selected stint.`,
        [{ text: "OK", onPress: () => setAssignTripModalVisible(false) }]
      );

      setSelectedTripId('');
      setSelectedStintId('');
      setSelectedVehicle(null);
      setSelectedTripDetails(null);
    } catch (error) {
      console.error('Error assigning vehicle to stint:', error);
      Alert.alert("Error", "Failed to assign vehicle to stint. Try again later.");
    }finally{
    setAssignTripModalVisible(false);

        router.push('/(tabs)/Vehicles')}
  };

  const handleVehiclePress = (vehicle) => {
    setSelectedVehicle(vehicle);
    setAssignTripModalVisible(true);
  };

  const getOwnerName = (ownerId) => {
    const owner = users.find(user => user.id === ownerId);
    return owner ? owner.fullname : 'Unknown';
  };

  const sections = [
    {
      title: "Vehicles",
      data: vehicles.length > 0 ? vehicles : ["empty-vehicles"],
      buttonTitle: "+ Add Vehicle",
      onButtonPress: () => setVehicleModalVisible(true)
    }
  ];

  const renderItem = ({ item, section }) => {
    if (item === "empty-vehicles") {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No vehicles added yet</Text>
          <Text style={styles.emptyStateSubtext}>Add a vehicle to calculate fuel costs and range</Text>
        </View>
      );
    }

    if (section.title === "Vehicles") {
      return (
        <TouchableOpacity
          style={styles.vehicleItem}
          onPress={() => handleVehiclePress(item)}
        >
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>{item.name} ({item.year})</Text>
            <Text style={styles.vehicleSpecs}>Fuel: {item.fuel_capacity} gal</Text>
            <Text style={styles.vehicleSpecs}>MPG: {item.mpg} </Text>
            <Text style={styles.vehicleOwner}>Owner: {getOwnerName(item.owner_id)}</Text>
          </View>
          <Text style={styles.tapToAssign}>Tap to assign to a trip</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={section.onButtonPress}
      >
        <Text style={styles.buttonText}>{section.buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Road Trip Planner</Text>
        <TouchableOpacity
                      onPress={handleLogout}
                      style={styles.logoutButton}
                    >
                      <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
        <Text style={styles.subtitle}>Manage Vehicles</Text>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => {
          if (typeof item === 'string') {
            return item;
          }
          return item.id ? item.id: `vehicle-${index}`;
        }}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.main}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={vehicleModalVisible}
        onRequestClose={() => setVehicleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Vehicle</Text>

              <View style={styles.form}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Vehicle Name</Text>
                  <TextInput
                    style={styles.input}
                    value={newVehicle.name}
                    onChangeText={(text) => setNewVehicle({...newVehicle, name: text})}
                    placeholder="e.g., Honda CR-V"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                    <Text style={styles.label}>Year</Text>
                    <TextInput
                      style={styles.input}
                      value={newVehicle.year}
                      onChangeText={(text) => setNewVehicle({...newVehicle, year: text})}
                      placeholder="EX: 2023"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Fuel Capacity</Text>
                    <TextInput
                      style={styles.input}
                      value={newVehicle.fuel_capacity}
                      onChangeText={(text) => setNewVehicle({...newVehicle, fuel_capacity: text})}
                      placeholder="EX: 15"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                    <Text style={styles.label}>MPG</Text>
                    <TextInput
                      style={styles.input}
                      value={newVehicle.mpg}
                      onChangeText={(text) => setNewVehicle({...newVehicle, mpg: text})}
                      placeholder="EX: 25"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Vehicle Owner</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={newVehicle.owner_id}
                      style={styles.picker}
                      onValueChange={(itemValue) => setNewVehicle({...newVehicle, owner_id: itemValue})}
                    >
                      <Picker.Item label="Select an owner" value="" />
                      {users.map(user => (
                        <Picker.Item
                          key={user.id}
                          label={`${user.fullname}`}
                          value={user.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setVehicleModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleAddVehicle}
                  >
                    <Text style={styles.buttonText}>Add Vehicle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={assignTripModalVisible}
        onRequestClose={() => setAssignTripModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Vehicle to Trip</Text>

            {selectedVehicle && (
              <View style={styles.selectedVehicleInfo}>
                <Text style={styles.selectedVehicleTitle}>Selected Vehicle:</Text>
                <Text style={styles.selectedVehicleName}>{selectedVehicle.name} ({selectedVehicle.year})</Text>
                <Text style={styles.vehicleSpecs}>Fuel: {selectedVehicle.fuel_capacity} gal | MPG: {selectedVehicle.mpg}</Text>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Select Trip</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedTripId}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      setSelectedTripId(itemValue);
                      setSelectedStintId('');
                    }}
                  >
                    <Picker.Item label="Select a trip" value="" />
                    {trips.map(trip => (
                      <Picker.Item
                        key={trip.trip_id}
                        label={trip.title}
                        value={trip.trip_id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {selectedTripDetails && selectedTripDetails.stints && selectedTripDetails.stints.length > 0 && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Select Stint</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedStintId}
                      style={styles.picker}
                      onValueChange={(itemValue) => setSelectedStintId(itemValue)}
                    >
                      <Picker.Item label="Select a stint" value="" />
                      {selectedTripDetails.stints.map(stint => (
                        <Picker.Item
                          key={stint.stintId}
                          label={`${stint.name} `}
                          value={stint.stintId}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setAssignTripModalVisible(false);
                    setSelectedTripId('');
                    setSelectedStintId('');
                    setSelectedTripDetails(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleAssignVehicleToTrip}
                  disabled={!selectedTripId || (selectedTripDetails?.stints?.length > 0 && !selectedStintId)}
                >
                  <Text style={styles.buttonText}>Assign Vehicle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}