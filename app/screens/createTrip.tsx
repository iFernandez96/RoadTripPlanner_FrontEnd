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
import { router } from 'expo-router';
import tripService from '../context/tripService';
import authService from '../context/authService';

interface User {
  id: string;
  username: string;
}

type FriendRole = 'member' | 'creator' | 'driver' | 'planner';
type SupplyCategory = 'food' | 'gear'| 'emergency'| 'clothing'| 'electronics'| 'other';
interface Supply {
  name: string;
  quantity: string;
  category: SupplyCategory;
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

const CreateTrip: React.FC = () => {
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
    quantity: '',
    category: 'other',
    notes: ''
  });

  const [showSupplyModal, setShowSupplyModal] = useState<boolean>(false);
  const [currentStop, setCurrentStop] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const validateForm = (): boolean => {
    if (!newTrip.title.trim()) {
      Alert.alert('Required Field', 'Please enter a trip title');
      return false;
    }

    if (!newTrip.start_date) {
      Alert.alert('Required Field', 'Please enter a start date');
      return false;
    }

    if (!validateAndFormatDate(newTrip.start_date, 'Start Date')) {
      return false;
    }

    if (newTrip.end_date && !validateAndFormatDate(newTrip.end_date, 'End Date')) {
      return false;
    }

    if (newTrip.start_date && newTrip.end_date) {
      const startDate = new Date(newTrip.start_date);
      const endDate = new Date(newTrip.end_date);

      if (endDate < startDate) {
        Alert.alert('Invalid Dates', 'End date cannot be before start date');
        return false;
      }
    }

    if (!newTrip.start_location.trim()) {
      Alert.alert('Required Field', 'Please enter a start location');
      return false;
    }

    if (!newTrip.end_location.trim()) {
      Alert.alert('Required Field', 'Please enter an end location');
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
      setIsLoading(true);
      setIsSubmitting(true);

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

      if (newTrip.friends.length > 0) {
        await Promise.all(
          newTrip.friends.map(friend =>
            handleAddFriendToTrip(result.trip_id, friend.id, friend.role)
          )
        );
      }

      if (newTrip.supplies.length > 0) {
        await Promise.all(
          newTrip.supplies.map(supply =>
            handleAddSupplyToTrip(
              result.trip_id,
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
        'Trip created successfully!',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (error: any) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', `Failed to create trip: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleAddFriendToTrip = async (tripId: string, userId: string, role: string) => {
    try {
      const friendData = {
        trip_id: tripId,
        user_id: userId,
        role: role
      };

      console.log('Adding friend to trip:', JSON.stringify(friendData, null, 2));
      const result = await tripService.addFriendToTrip(friendData);
      console.log('Friend added to trip successfully:', result);
      return result;
    } catch (error: any) {
      console.error('Error adding friend to trip:', error);
      return null;
    }
  };

  const handleAddSupplyToTrip = async (tripId: string, quantity: string, notes: string, name: string, category: SupplyCategory) => {
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
      const result = await tripService.addSupplyToTrip(supplyData);
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
      quantity: '',
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, {height: 60}]}
                value={newTrip.description}
                onChangeText={(text) => setNewTrip({...newTrip, description: text})}
                placeholder="Brief description of your trip"
                multiline
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.start_date}
                  onChangeText={(text) => handleDateChange(text, 'start_date')}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={newTrip.end_date}
                  onChangeText={(text) => handleDateChange(text, 'end_date')}
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
                      <Text style={styles.buttonText}>Add Supply</Text>
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

export default CreateTrip;