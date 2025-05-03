import React, { useState, useEffect } from 'react';
import { styles } from '../css/createTrip';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import tripService from '../context/tripService';
import authService from '../context/authService';

interface User {
  id: string;
  username: string;
}

type FriendRole = 'member' | 'creator' | 'driver' | 'planner';
type SupplyCategory = 'food' | 'gear'| 'emergency'| 'clothing'| 'electronics'| 'other';
type StopType = 'pitstop' | 'overnight'| 'gas'| 'food'| 'attraction'| 'other';
interface Supply {
  name: string;
  quantity: number;
  category: SupplyCategory;
  notes: string;
}

interface Stop {
  name: string;
  type: StopType;
  notes: string;
}

interface TripFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_location: string;
  end_location: string;
  stops: string[];
  notes: string;
  friends: {id: string, username: string, role: FriendRole}[];
  supplies: Supply[];
}

const AdditionsTrip: React.FC = () => {
  const params = useLocalSearchParams();
  // Convert string params to numbers
  const tripId = typeof params.tripId === 'string' ? parseInt(params.tripId, 10) : 0;
  const stintId = typeof params.stintId === 'string' ? parseInt(params.stintId, 10) : 0;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [newTrip, setNewTrip] = useState<TripFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_location: '',
    end_location: '',
    stops: [],
    notes: '',
    friends: [],
    supplies: []
  });

  const [newSupply, setNewSupply] = useState<Supply>({
    name: '',
    quantity: 1,
    category: 'other',
    notes: ''
  });

  const [showSupplyModal, setShowSupplyModal] = useState<boolean>(false);
  const [currentStop, setCurrentStop] = useState<string>('');
  const [showStopsModal, setShowStopsModal] = useState<boolean>(false);
  const [newStop, setNewStop] = useState<Stop>({
    name: '',
    type: 'pitstop',
    notes: ''
  });

  useEffect(() => {
    fetchUsers();
    console.log("Received params - tripId:", tripId, "stintId:", stintId);

    // Validate tripId and stintId
    if (isNaN(tripId) || isNaN(stintId) || tripId <= 0 || stintId <= 0) {
      Alert.alert('Invalid Parameters', 'Trip ID or Stint ID is invalid');
    }
  }, [tripId, stintId]);

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


  const handleAddTrip = async () => {
    if (isSubmitting) return;
    try {
      setIsLoading(true);
      setIsSubmitting(true);

      if (isNaN(tripId) || isNaN(stintId) || tripId <= 0 || stintId <= 0) {
        Alert.alert('Error', 'Trip ID or Stint ID is invalid');
        setIsLoading(false);
        setIsSubmitting(false);
        return;
      }

      if (newTrip.stops.length > 0) {
        for (let i = 0; i < newTrip.stops.length; i++) {
          const stop = newTrip.stops[i];
          const stopType: StopType = "pitstop";

          await handleAddStopToTrip(
            tripId,
            stopType,
            stintId,
            stop,
            "Intermediate stop",
            30
          );
        }
      }

      if (newTrip.end_location && newTrip.end_location !== newTrip.start_location) {
        await handleAddFinalStopToTrip(
          tripId,
          'other',
          stintId,
          newTrip.end_location,
          "end",
          30
        );
      }

      if (newTrip.friends.length > 0) {
        await Promise.all(
          newTrip.friends.map(friend =>
            handleAddFriendToTrip(tripId, friend.id, friend.role)
          )
        );
      }

      if (newTrip.supplies.length > 0) {
        await Promise.all(
          newTrip.supplies.map(supply =>
            handleAddSupplyToTrip(
              tripId,
              supply.quantity,
              supply.notes,
              supply.name,
              supply.category
            )
          )
        );
      }

      Alert.alert(
        'Success',
        'Trip details added successfully!',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (error: any) {
      console.error('Error updating trip:', error);
      Alert.alert('Error', `Failed to update trip: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
      router.push('/')
    }
  };

  const handleAddStopToTrip = async (
    tripId: number,
    stopType: StopType,
    stintId: number,
    name: string,
    notes: string,
    duration: number | string
  ) => {
    try {
      const location = {
        address: name
      };
      const locationResponse = await tripService.getLocationCoord(location);

      const locationItem = locationResponse.location;
      const address = locationItem.address;
      const city = locationItem.city || '';
      const state = locationItem.state || '';
      const postalCode = locationItem.postal_code || '';
      const latitude = locationItem.latitude;
      const longitude = locationItem.longitude;

      const stopData = {
        name: name,
        latitude: latitude,
        longitude: longitude,
        address: address,
        stop_type: stopType,
        duration: duration,
        notes: notes,
        trip_id: tripId,
        stint_id: stintId,
        city: city,
        state: state,
        postal_code: postalCode
      };

      console.log('Adding Stop to trip:', JSON.stringify(stopData, null, 2));
      const result = await tripService.createStop(stopData);
      console.log('Stop added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding stop to trip:', error);
      Alert.alert('Error', `Failed to add stop: ${error.message}`);
      return null;
    }
  };

  const handleAddFinalStopToTrip = async (
    tripId: number,
    stopType: StopType,
    stintId: number,
    name: string,
    notes: string,
    duration: number | string
  ) => {
    try {
      const location = {
        address: name
      };
      const locationResponse = await tripService.getLocationCoord(location);

      const locationItem = locationResponse.location;
      const address = locationItem.address;
      const city = locationItem.city || '';
      const state = locationItem.state || '';
      const postalCode = locationItem.postal_code || '';
      const latitude = locationItem.latitude;
      const longitude = locationItem.longitude;

      const stopData = {
        name: name,
        latitude: latitude,
        longitude: longitude,
        address: address,
        stop_type: stopType,
        duration: duration,
        notes: notes,
        trip_id: tripId,
        stint_id: stintId,
        city: city,
        state: state,
        postal_code: postalCode
      };

      console.log('Adding Final Stop to trip:', JSON.stringify(stopData, null, 2));
      const result = await tripService.createStop(stopData);
      console.log('Final Stop added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding final stop to trip:', error);
      Alert.alert('Error', `Failed to add final stop: ${error.message}`);
      return null;
    }
  };

  const handleAddFriendToTrip = async (tripId: number, userId: string, role: string) => {
    try {
      const friendData = {
        trip_id: tripId,
        user_id: userId,
        role: role
      };

      console.log('Adding friend to trip:', JSON.stringify(friendData, null, 2));
      const result = await tripService.addFriendToTrip(tripId, friendData);
      console.log('Friend added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding friend to trip:', error);
      return null;
    }
  };

  const handleAddSupplyToTrip = async (tripId: number, quantity: number, notes: string, name: string, category: SupplyCategory) => {
    try {
      const supplyData = {
        trip_id: tripId,
        quantity: quantity,
        notes: notes,
        new_supply: {
          name: name,
          category: category
        }
      };

      console.log('Adding supply to trip:', JSON.stringify(supplyData, null, 2));
      const result = await tripService.addSupplyToTrip(tripId, supplyData);
      console.log('Supply added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding supply to trip:', error);
      return null;
    }
  };

  const handleAddSupply = () => {
    if (!newSupply.name.trim()) {
      Alert.alert('Required Field', 'Please enter a supply name');
      return;
    }

    setNewTrip({
      ...newTrip,
      supplies: [...newTrip.supplies, { ...newSupply }]
    });

    setNewSupply({
      name: '',
      quantity: 1,
      category: 'other',
      notes: ''
    });

    setShowSupplyModal(false);
  };

  const handleRemoveSupply = (index: number) => {
    const updatedSupplies = [...newTrip.supplies];
    updatedSupplies.splice(index, 1);
    setNewTrip({
      ...newTrip,
      supplies: updatedSupplies
    });
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

  const openStopsModal = () => {
    setNewStop({
      name: '',
      type: 'pitstop',
      notes: ''
    });
    setShowStopsModal(true);
  };

  const handleAddStopFromModal = () => {
    if (!newStop.name.trim()) {
      Alert.alert('Required Field', 'Please enter a stop name');
      return;
    }

    setNewTrip({
      ...newTrip,
      stops: [...newTrip.stops, newStop.name.trim()]
    });

    setNewStop({
      name: '',
      type: 'pitstop',
      notes: ''
    });

    setShowStopsModal(false);
  };

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...newTrip.stops];
    updatedStops.splice(index, 1);
    setNewTrip({
      ...newTrip,
      stops: updatedStops
    });
  };

  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);

  const handleAddFriend = (user: User) => {
    if (newTrip.friends.some(friend => friend.id === user.id)) {
      Alert.alert('Already Added', 'This user is already added to the trip');
      return;
    }

    setSelectedUserForRole(user);
    setShowRoleModal(true);
  };

  const handleRoleSelection = (role: FriendRole) => {
    if (selectedUserForRole && !newTrip.friends.some(friend => friend.id === selectedUserForRole.id)) {
      setNewTrip({
        ...newTrip,
        friends: [...newTrip.friends, { ...selectedUserForRole, role }]
      });
    }
    setShowRoleModal(false);
    setIsDropdownVisible(false);
    setSearchQuery('');
  };

  const handleRemoveFriend = (userId: string) => {
    setNewTrip({
      ...newTrip,
      friends: newTrip.friends.filter(friend => friend.id !== userId)
    });
  };

  const onClose = () => {
    router.back();
  };

  const validateAndFormatDate = (dateText: string, field: string): boolean => {
    if (!dateText) return true;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateText)) {
      Alert.alert('Invalid Date Format', `Please use YYYY-MM-DD format for ${field}`);
      return false;
    }

    const date = new Date(dateText);
    if (isNaN(date.getTime())) {
      Alert.alert('Invalid Date', `The ${field} is not a valid date`);
      return false;
    }

    return true;
  };

  const handleDateChange = (text: string, field: keyof TripFormData) => {
    setNewTrip({...newTrip, [field]: text});
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.modalTitle}>Add Trip Details</Text>

          <View style={styles.form}>

            <View style={styles.formGroup}>
              <Text style={styles.label}>End Location</Text>
              <TextInput
                style={styles.input}
                value={newTrip.end_location}
                onChangeText={(text) => setNewTrip({...newTrip, end_location: text})}
                placeholder="Where your trip ends"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Stops:</Text>


              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={openStopsModal}
              >
                <Text style={styles.dropdownButtonText}>
                  Add detailed stop
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showStopsModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStopsModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.dropdownContainer}>
                    <View style={styles.dropdownHeader}>
                      <Text style={styles.dropdownTitle}>Add Stop</Text>
                      <TouchableOpacity onPress={() => setShowStopsModal(false)}>
                        <Text style={styles.closeButton}>Cancel</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Name *</Text>
                      <TextInput
                        style={styles.input}
                        value={newStop.name}
                        onChangeText={(text) => setNewStop({...newStop, name: text})}
                        placeholder="Stop name"
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Type</Text>
                      <View style={styles.categoryContainer}>
                        {['pitstop', 'overnight', 'gas', 'food', 'attraction', 'other'].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.categoryButton,
                              newStop.type === type && styles.categoryButtonSelected
                            ]}
                            onPress={() => setNewStop({...newStop, type: type as StopType})}
                          >
                            <Text
                              style={[
                                styles.categoryButtonText,
                                newStop.type === type && styles.categoryButtonTextSelected
                              ]}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Notes</Text>
                      <TextInput
                        style={[styles.input, {height: 60}]}
                        value={newStop.notes}
                        onChangeText={(text) => setNewStop({...newStop, notes: text})}
                        placeholder="Additional notes"
                        multiline
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleAddStopFromModal}
                    >
                      <Text style={styles.cancelButtonText}>Add Stop</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {newTrip.stops.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Added Stops:</Text>
                  {newTrip.stops.map((stop, index) => (
                    <View key={index} style={styles.friendItem}>
                      <Text style={styles.listItem}>• {stop}</Text>
                      <TouchableOpacity onPress={() => handleRemoveStop(index)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Friends:</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsDropdownVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {newTrip.friends.length > 0 ? `${newTrip.friends.length} friend(s) selected` : 'Select friends'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsDropdownVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.dropdownContainer}>
                    <View style={styles.dropdownHeader}>
                      <Text style={styles.dropdownTitle}>Select Friends</Text>
                      <TouchableOpacity onPress={() => setIsDropdownVisible(false)}>
                        <Text style={styles.closeButton}>Close</Text>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search users..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />

                    {users.length === 0 ? (
                      <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Loading users...</Text>
                      </View>
                    ) : (
                      <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => handleAddFriend(item)}
                          >
                            <Text style={styles.userName}>{item.username}</Text>
                            <Text style={styles.userId}>ID: {item.id}</Text>
                          </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                          <Text style={styles.emptyList}>No users found</Text>
                        }
                      />
                    )}
                  </View>
                </View>
              </Modal>

              {newTrip.friends.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Selected Friends:</Text>
                  {newTrip.friends.map((friend, index) => (
                    <View key={index} style={styles.friendItem}>
                      <View style={styles.friendInfo}>
                        <Text style={styles.listItem}>• {friend.username}</Text>
                        <Text style={styles.roleTag}>{friend.role}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleRemoveFriend(friend.id)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <Modal
                visible={showRoleModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowRoleModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.roleModalContainer}>
                    <View style={styles.dropdownHeader}>
                      <Text style={styles.dropdownTitle}>Select Role for {selectedUserForRole?.username}</Text>
                      <TouchableOpacity onPress={() => setShowRoleModal(false)}>
                        <Text style={styles.closeButton}>Cancel</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.roleButtonsContainer}>
                      <TouchableOpacity
                        style={styles.roleButton}
                        onPress={() => handleRoleSelection('member')}
                      >
                        <Text style={styles.roleButtonText}>Member</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.roleButton}
                        onPress={() => handleRoleSelection('creator')}
                      >
                        <Text style={styles.roleButtonText}>Creator</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.roleButton}
                        onPress={() => handleRoleSelection('driver')}
                      >
                        <Text style={styles.roleButtonText}>Driver</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.roleButton}
                        onPress={() => handleRoleSelection('planner')}
                      >
                        <Text style={styles.roleButtonText}>Planner</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplies</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowSupplyModal(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {newTrip.supplies.length > 0 ? `${newTrip.supplies.length} supply item(s) added` : 'Add supplies'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showSupplyModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSupplyModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.dropdownContainer}>
                    <View style={styles.dropdownHeader}>
                      <Text style={styles.dropdownTitle}>Add Supply</Text>
                      <TouchableOpacity onPress={() => setShowSupplyModal(false)}>
                        <Text style={styles.closeButton}>Cancel</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Name *</Text>
                      <TextInput
                        style={styles.input}
                        value={newSupply.name}
                        onChangeText={(text) => setNewSupply({...newSupply, name: text})}
                        placeholder="Supply name"
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Quantity</Text>
                      <TextInput
                        style={styles.input}
                        value={newSupply.quantity}
                        onChangeText={(text) => setNewSupply({...newSupply, quantity: text})}
                        placeholder="How many?"
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Category</Text>
                      <View style={styles.categoryContainer}>
                        {['food', 'gear', 'emergency', 'clothing', 'electronics', 'other'].map((cat) => (
                          <TouchableOpacity
                            key={cat}
                            style={[
                              styles.categoryButton,
                              newSupply.category === cat && styles.categoryButtonSelected
                            ]}
                            onPress={() => setNewSupply({...newSupply, category: cat as SupplyCategory})}
                          >
                            <Text
                              style={[
                                styles.categoryButtonText,
                                newSupply.category === cat && styles.categoryButtonTextSelected
                              ]}
                            >

                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Notes</Text>
                      <TextInput
                        style={[styles.input, {height: 60}]}
                        value={newSupply.notes}
                        onChangeText={(text) => setNewSupply({...newSupply, notes: text})}
                        placeholder="Additional notes"
                        multiline
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleAddSupply}
                    >
                      <Text style={styles.cancelButtonText}>Add Supply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {newTrip.supplies.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.subLabel}>Added Supplies:</Text>
                  {newTrip.supplies.map((supply, index) => (
                    <View key={index} style={styles.supplyItem}>
                      <View style={styles.supplyInfo}>
                        <Text style={styles.listItem}>
                          • {supply.name} {supply.quantity ? `(${supply.quantity})` : ''}
                        </Text>
                        <Text style={styles.categoryTag}>{supply.category}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleRemoveSupply(index)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleAddTrip}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Trip</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default AdditionsTrip;