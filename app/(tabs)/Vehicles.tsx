import React, { useState } from 'react';
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
  sectionSeparator: {
    height: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
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
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },

  vehicleItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vehicleImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#e2e8f0',
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  vehicleSpecs: {
    color: '#475569',
    marginBottom: 2,
    fontSize: 14,
  },

  collaboratorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#e2e8f0',
  },
  collaboratorInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collaboratorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  roleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },

  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
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
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#0f172a',
    textAlign: 'center',
  },

  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 12,
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
  saveButton: {
    backgroundColor: '#22c55e',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 12,
    flex: 1,
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },

  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedRoleOption: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
  },
  roleOptionText: {
    fontWeight: '600',
    color: '#64748b',
  },
});