import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Modal,
    Platform
} from 'react-native';

// Mock data (same as original)
const mockTrips = [
    {
        id: 1,
        title: "Pacific Coast Highway",
        description: "San Francisco to San Diego along the coast",
        start_date: "2025-06-01",
        end_date: "2025-06-10"
    },
    {
        id: 2,
        title: "Southwest Loop",
        description: "Arizona and Utah National Parks",
        start_date: "2025-07-05",
        end_date: "2025-07-15"
    }
];

const mockStops = [
    {
        name: "Big Sur",
        type: "overnight",
        arrival: "June 2, 2025",
        departure: "June 3, 2025"
    },
    {
        name: "Santa Barbara",
        type: "pitstop",
        arrival: "June 4, 2025",
        departure: "June 4, 2025"
    }
];

const mockVehicles = [
    {
        name: "Honda CR-V",
        year: 2021,
        fuel_capacity: "14.0 gal",
        mpg_highway: 34,
        mpg_city: 28
    },
    {
        name: "Subaru Outback",
        year: 2020,
        fuel_capacity: "18.5 gal",
        mpg_highway: 33,
        mpg_city: 26
    }
];

const mockSupplies = [
    { name: "Water Bottles", category: "food", quantity: 12 },
    { name: "First Aid Kit", category: "emergency", quantity: 1 },
    { name: "Tent", category: "gear", quantity: 1 }
];

const mockCollaborators = [
    { name: "Alex", role: "planner" },
    { name: "Jamie", role: "driver" },
    { name: "Morgan", role: "member" }
];

// Components for each section
const TripOverview = () => (
    <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Trips</Text>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+ New Trip</Text>
        </TouchableOpacity>
        <FlatList
            data={mockTrips}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <Text style={styles.tripTitle}>{item.title}</Text>
                    <Text style={styles.tripDescription}>{item.description}</Text>
                    <Text style={styles.tripDates}>{item.start_date} → {item.end_date}</Text>
                </View>
            )}
        />
    </View>
);

const TripDetailView = () => (
    <View style={styles.card}>
        <Text style={styles.sectionTitle}>Trip Details</Text>
        <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.toggleButton}>
                <Text>Timeline View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleButton}>
                <Text>Map View</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={mockStops}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.stopItem}>
                    <Text style={styles.stopTitle}>{item.name} ({item.type})</Text>
                    <Text style={styles.stopDates}>Arrive: {item.arrival} | Depart: {item.departure}</Text>
                </View>
            )}
        />
    </View>
);

const SprintOverview = () => (
    <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sprint Overview</Text>
        <Text style={styles.description}>Assign vehicles, manage stops, and plan the route between stops.</Text>
    </View>
);

const StopDetail = () => {
    const [stopType, setStopType] = useState('');
    const [arrivalDate, setArrivalDate] = useState(new Date());
    const [departureDate, setDepartureDate] = useState(new Date());

    // Format date to string for display
    const formatDate = (date) => {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Stop Details</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Stop Name"
                />

                {/* Custom picker using TouchableOpacity instead of native Picker */}
                <TouchableOpacity style={styles.input}>
                    <Text style={stopType ? {} : styles.placeholderText}>
                        {stopType || "Select Stop Type"}
                    </Text>
                </TouchableOpacity>

                {/* Option buttons instead of a picker */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={[styles.optionButton, stopType === 'pitstop' && styles.selectedOption]}
                        onPress={() => setStopType('pitstop')}
                    >
                        <Text>Pitstop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, stopType === 'overnight' && styles.selectedOption]}
                        onPress={() => setStopType('overnight')}
                    >
                        <Text>Overnight</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionButton, stopType === 'gas' && styles.selectedOption]}
                        onPress={() => setStopType('gas')}
                    >
                        <Text>Gas</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Arrival Time</Text>
                <TouchableOpacity style={styles.dateInput}>
                    <Text>{formatDate(arrivalDate)}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Departure Time</Text>
                <TouchableOpacity style={styles.dateInput}>
                    <Text>{formatDate(departureDate)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.saveButton]}>
                    <Text style={styles.buttonText}>Save Stop</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const VehiclesAndSupplies = () => (
    <View style={styles.card}>
        <Text style={styles.sectionTitle}>Vehicles & Supplies</Text>

        <Text style={styles.subSectionTitle}>Vehicles</Text>
        <FlatList
            data={mockVehicles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.listRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text>{item.name} ({item.year}) - {item.mpg_city}/{item.mpg_highway} mpg</Text>
                </View>
            )}
        />

        <Text style={styles.subSectionTitle}>Supplies</Text>
        <FlatList
            data={mockSupplies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.listRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text>{item.name} - {item.category} (x{item.quantity})</Text>
                </View>
            )}
        />
    </View>
);

const Collaborators = () => (
    <View style={styles.card}>
        <Text style={styles.sectionTitle}>Collaborators</Text>
        <FlatList
            data={mockCollaborators}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.listRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text>{item.name} - {item.role}</Text>
                </View>
            )}
        />
    </View>
);

// This duplicate declaration is removed

// Make sure we have a clear default export
export default function RoadTripPlannerApp() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Road Trip Planner</Text>
                    <Text style={styles.subtitle}>Plan, organize, and collaborate on road trips effortlessly.</Text>
                </View>

                <View style={styles.main}>
                    <TripOverview />
                    <TripDetailView />
                    <SprintOverview />
                    <StopDetail />
                    <VehiclesAndSupplies />
                    <Collaborators />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    main: {
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    subSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#3b82f6', // blue-500 equivalent
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#22c55e', // green-500 equivalent
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    toggleButton: {
        backgroundColor: '#e5e7eb', // gray-200 equivalent
        padding: 8,
        borderRadius: 6,
        marginRight: 10,
    },
    listItem: {
        backgroundColor: '#f3f4f6', // gray-100 equivalent
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    tripTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    tripDescription: {
        color: '#4b5563', // gray-600 equivalent
    },
    tripDates: {
        fontSize: 12,
        color: '#6b7280', // gray-500 equivalent
        marginTop: 4,
    },
    stopItem: {
        borderLeftWidth: 4,
        borderLeftColor: '#60a5fa', // blue-400 equivalent
        paddingLeft: 12,
        marginBottom: 10,
    },
    stopTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    stopDates: {
        fontSize: 12,
        color: '#4b5563', // gray-600 equivalent
    },
    description: {
        color: '#4b5563', // gray-600 equivalent
    },
    form: {
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db', // gray-300 equivalent
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
    },
    label: {
        marginBottom: 4,
        fontWeight: '500',
    },
    datePickerContainer: {
        marginBottom: 12,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    optionButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 2,
    },
    selectedOption: {
        backgroundColor: '#e0f2fe',
        borderColor: '#3b82f6',
    },
    placeholderText: {
        color: '#9ca3af',
    },
    listRow: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
    },
    bulletPoint: {
        marginRight: 8,
        fontSize: 16,
    },
});
