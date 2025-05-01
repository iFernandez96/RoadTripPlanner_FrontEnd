import React, { useState } from 'react';
import styles from '../css/vehicles';

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
  Image
} from 'react-native';

const mockVehicles = [
  {
    id: 1,
    name: "Honda CR-V",
    year: 2021,
    fuel_capacity: "14.0 gal",
    mpg_highway: 34,
    mpg_city: 28,
    image: "/api/placeholder/120/80"
  },
  {
    id: 2,
    name: "Subaru Outback",
    year: 2020,
    fuel_capacity: "18.5 gal",
    mpg_highway: 33,
    mpg_city: 26,
    image: "/api/placeholder/120/80"
  }
];

const mockCollaborators = [
  { id: 1, name: "Alex", role: "planner", avatar: "/api/placeholder/40/40" },
  { id: 2, name: "Jamie", role: "driver", avatar: "/api/placeholder/40/40" },
  { id: 3, name: "Morgan", role: "member", avatar: "/api/placeholder/40/40" }
];

export default function RoadTripPlannerApp() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [collaborators, setCollaborators] = useState(mockCollaborators);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [collaboratorModalVisible, setCollaboratorModalVisible] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    year: '',
    fuel_capacity: '',
    mpg_highway: '',
    mpg_city: ''
  });
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    role: 'member'
  });

  const handleAddVehicle = () => {
    if (newVehicle.name && newVehicle.year) {
      const vehicle = {
        id: vehicles.length + 1,
        ...newVehicle,
        image: "/api/placeholder/120/80"
      };
      setVehicles([...vehicles, vehicle]);
      setVehicleModalVisible(false);
      setNewVehicle({
        name: '',
        year: '',
        fuel_capacity: '',
        mpg_highway: '',
        mpg_city: ''
      });
    }
  };

  const handleAddCollaborator = () => {
    if (newCollaborator.name) {
      const collaborator = {
        id: collaborators.length + 1,
        ...newCollaborator,
        avatar: "/api/placeholder/40/40"
      };
      setCollaborators([...collaborators, collaborator]);
      setCollaboratorModalVisible(false);
      setNewCollaborator({
        name: '',
        role: 'member'
      });
    }
  };

  const roles = {
    planner: { color: '#3b82f6', label: 'Planner' },
    driver: { color: '#22c55e', label: 'Driver' },
    member: { color: '#a855f7', label: 'Member' }
  };

  const sections = [
    {
      title: "Vehicles",
      data: vehicles.length > 0 ? vehicles : ["empty-vehicles"],
      buttonTitle: "+ Add Vehicle",
      onButtonPress: () => setVehicleModalVisible(true)
    },
    {
      title: "Collaborators",
      data: collaborators.length > 0 ? collaborators : ["empty-collaborators"],
      buttonTitle: "+ Add Person",
      onButtonPress: () => setCollaboratorModalVisible(true)
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

    if (item === "empty-collaborators") {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No collaborators yet</Text>
          <Text style={styles.emptyStateSubtext}>Add people to collaborate on this trip</Text>
        </View>
      );
    }

    if (section.title === "Vehicles") {
      return (
        <View style={styles.vehicleItem}>
          <Image
            source={{ uri: item.image }}
            style={styles.vehicleImage}
            alt={item.name}
          />
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>{item.name} ({item.year})</Text>
            <Text style={styles.vehicleSpecs}>Fuel: {item.fuel_capacity}</Text>
            <Text style={styles.vehicleSpecs}>MPG: {item.mpg_city} city / {item.mpg_highway} highway</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.collaboratorItem}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
          alt={`${item.name}'s avatar`}
        />
        <View style={styles.collaboratorInfo}>
          <Text style={styles.collaboratorName}>{item.name}</Text>
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: roles[item.role]?.color || '#9ca3af' }
            ]}
          >
            <Text style={styles.roleText}>
              {roles[item.role]?.label || 'Member'}
            </Text>
          </View>
        </View>
      </View>
    );
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
        <Text style={styles.subtitle}>Manage Vehicles & People</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => {
          if (typeof item === 'string') {
            return item;
          }
          return item.id.toString();
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
                    placeholder="2023"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formGroup, {flex: 1}]}>
                  <Text style={styles.label}>Fuel Capacity</Text>
                  <TextInput
                    style={styles.input}
                    value={newVehicle.fuel_capacity}
                    onChangeText={(text) => setNewVehicle({...newVehicle, fuel_capacity: text})}
                    placeholder="15.0 gal"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                  <Text style={styles.label}>City MPG</Text>
                  <TextInput
                    style={styles.input}
                    value={newVehicle.mpg_city}
                    onChangeText={(text) => setNewVehicle({...newVehicle, mpg_city: text})}
                    placeholder="25"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formGroup, {flex: 1}]}>
                  <Text style={styles.label}>Highway MPG</Text>
                  <TextInput
                    style={styles.input}
                    value={newVehicle.mpg_highway}
                    onChangeText={(text) => setNewVehicle({...newVehicle, mpg_highway: text})}
                    placeholder="30"
                    keyboardType="numeric"
                  />
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
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={collaboratorModalVisible}
        onRequestClose={() => setCollaboratorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Collaborator</Text>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={newCollaborator.name}
                  onChangeText={(text) => setNewCollaborator({...newCollaborator, name: text})}
                  placeholder="e.g., Alex"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Role</Text>
                <View style={styles.roleSelector}>
                  {Object.entries(roles).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.roleOption,
                        newCollaborator.role === key && styles.selectedRoleOption,
                        { borderColor: value.color }
                      ]}
                      onPress={() => setNewCollaborator({...newCollaborator, role: key})}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          newCollaborator.role === key && { color: value.color }
                        ]}
                      >
                        {value.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setCollaboratorModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleAddCollaborator}
                >
                  <Text style={styles.buttonText}>Add Person</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
