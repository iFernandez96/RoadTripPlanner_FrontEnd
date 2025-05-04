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
  const tripId = typeof params.tripId === 'string' ? parseInt(params.tripId, 10) : 0;

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


  useEffect(() => {
    fetchUsers();
    console.log("Received params - tripId:", tripId);

  }, [tripId]);

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
const onSkip = () => {
      router.push('/');
    };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.modalTitle}>Add Trip Friends & Supplies</Text>

          <View style={styles.form}>

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
                style={[styles.button, styles.cancelButton]}
                onPress={onSkip}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Skip For Now</Text>
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