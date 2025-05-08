import React, { useState, useEffect } from 'react';
import { styles } from '../css/viewTrip';
import tripService from '../context/tripService';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// Define types for the data structures
interface Leg {
  leg_id: number;
  distance: number;
  estimated_travel_time: number;
  route_type: string;
  polyline: string | null;
  notes: string | null;
  start_stop_name: string;
  end_stop_name: string;
}

interface Stop {
  stop_id: number;
  location_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  stop_type: string;
  arrival_time: string;
  departure_time: string;
  duration: number;
  sequence_number: number;
  notes: string;
}

interface TimelineItem {
  type: string;
  sequenceNumber: number;
  data: Stop | Leg;
}

interface Stint {
  stintId: number;
  name: string;
  sequenceNumber: number;
  distance: number;
  estimatedDuration: number;
  notes: string;
  continuesFromPrevious: boolean;
  startTime: string;
  endTime: string;
  startLocationName: string;
  timeline: TimelineItem[];
  googleMapsUrl: string;
  vehicles: any[];
}

interface User {
  user_id: number;
  username: string;
  fullname: string;
  role: string;
  joined_at: string;
}

interface Supply {
  supply_id: number;
  name: string;
  category: string;
  quantity: number;
  notes: string;
}

interface Trip {
  tripId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalDistance: number;
  totalDuration: number;
  stints: Stint[];
  participants: User[];
  supplies: Supply[];
}

const ViewTrip = () => {
  const params = useLocalSearchParams();
  const tripId = typeof params.tripId === 'string' ? parseInt(params.tripId, 10) : 0;

  const [tripDetails, setTripDetails] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTripTimeline(tripId);
  }, [tripId]);

  const fetchTripTimeline = async (tripId) => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedTripTimeline = await tripService.getTimelineById(tripId);
      setTripDetails(fetchedTripTimeline);
      console.log('Trip timeline fetched:', fetchedTripTimeline);
    } catch (err) {
      console.error('Failed to fetch TripTimeline details:', err);
      setError('Failed to load timeline details.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    router.back();
  };

  const handleEditTrip = () => {
    router.push({
      pathname: '/screens/editTrip',
      params: { trip: tripId.toString() }
    });
  };

  const handleAdditionsTrip = () => {
    router.push({
      pathname: '/screens/addToTrip',
      params: { trip: tripId.toString() }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return "Unknown";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}` : ''}`;
    }
    return `${mins} min${mins > 1 ? 's' : ''}`;
  };

  const openMapsLink = (url) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open maps link:', err);
      Alert.alert('Error', 'Could not open maps application');
    });
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.loadingText}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error message if trip data couldn't be loaded
  if (error || !tripDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.errorText}>{error || 'Could not load trip details'}</Text>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.modalTitle}>{tripDetails.title}</Text>

          {tripDetails.description && (
            <Text style={styles.description}>{tripDetails.description}</Text>
          )}

          <View style={styles.tripSummary}>
            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Start Date</Text>
                <Text style={styles.valueText}>{formatDate(tripDetails.startDate)}</Text>
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>End Date</Text>
                <Text style={styles.valueText}>{formatDate(tripDetails.endDate)}</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Total Distance</Text>
                <Text style={styles.valueText}>{tripDetails.totalDistance} mi</Text>
              </View>

              <View style={[styles.formGroup, {flex: 1}]}>
                <Text style={styles.label}>Total Duration</Text>
                <Text style={styles.valueText}>{formatDuration(tripDetails.totalDuration)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Trip Timeline</Text>

            {tripDetails.stints.map((stint, stintIndex) => (
              <View key={stint.stintId} style={styles.stintContainer}>
                <View style={styles.stintHeader}>
                  <Text style={styles.stintTitle}>
                    {stint.sequenceNumber}. {stint.name}
                  </Text>
                  <Text style={styles.stintDetails}>
                    {formatDuration(stint.estimatedDuration)} • {stint.distance} mi
                  </Text>
                </View>

                {stint.notes && (
                  <Text style={styles.stintNotes}>{stint.notes}</Text>
                )}

                <TouchableOpacity
                  style={styles.mapsButton}
                  onPress={() => openMapsLink(stint.googleMapsUrl)}
                >
                  <Text style={styles.mapsButtonText}>Open in Maps</Text>
                </TouchableOpacity>

                <View style={styles.timelineContainer}>
                  {stint.timeline.sort((a, b) => a.sequenceNumber - b.sequenceNumber).map((item, index) => {
                    if (item.type === 'departure') {
                      const departureData = item.data as Stop;
                      return (
                        <View key={`departure-${index}`} style={styles.timelineItem}>
                          <View style={styles.timelineDot} />
                          <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>Departure</Text>
                            <Text style={styles.timelineLocation}>{departureData.name}</Text>
                            <Text style={styles.timelineTime}>{formatTime(departureData.departure_time)}</Text>
                            {departureData.notes && (
                              <Text style={styles.timelineNotes}>{departureData.notes}</Text>
                            )}
                          </View>
                        </View>
                      );
                    } else if (item.type === 'stop') {
                      const stopData = item.data as Stop;
                      return (
                        <View key={`stop-${index}`} style={styles.timelineItem}>
                          <View style={styles.timelineBar} />
                          <View style={styles.timelineDot} />
                          <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>
                              {stopData.stop_type === 'pitstop' ? 'Pit Stop' :
                               stopData.stop_type === 'other' ? 'Stop' :
                               stopData.stop_type === 'overnight' ? 'Overnight Stay' : 'Destination'}
                            </Text>
                            <Text style={styles.timelineLocation}>{stopData.name}</Text>
                            <Text style={styles.timelineTime}>
                              Arrive: {formatTime(stopData.arrival_time)}
                              {stopData.departure_time !== stopData.arrival_time &&
                                ` • Depart: ${formatTime(stopData.departure_time)}`}
                            </Text>
                            {stopData.duration > 0 && (
                              <Text style={styles.timelineDuration}>
                                Stay: {formatDuration(stopData.duration)}
                              </Text>
                            )}
                            {stopData.notes && (
                              <Text style={styles.timelineNotes}>{stopData.notes}</Text>
                            )}
                          </View>
                        </View>
                      );
                    } else if (item.type === 'leg') {
                      const legData = item.data as Leg;
                      return (
                        <View key={`leg-${index}`} style={styles.timelineLeg}>
                          <View style={styles.timelineBar} />
                          <View style={styles.timelineContent}>
                            <View style={styles.timelineLegDetails}>
                              <Text>
                                <Text style={{fontWeight: '600'}}>Travel: </Text>
                                {legData.distance} mi • {formatDuration(legData.estimated_travel_time)}
                                {legData.route_type && ` • ${legData.route_type}`}
                              </Text>
                              <Text style={{marginTop: 2}}>
                                <Text style={{fontWeight: '600'}}>Route: </Text>
                                {legData.start_stop_name} → {legData.end_stop_name}
                              </Text>
                              {legData.notes && (
                                <Text style={{marginTop: 4, fontStyle: 'italic'}}>{legData.notes}</Text>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Participants</Text>
            {tripDetails.participants && tripDetails.participants.length > 0 ? (
              <View style={styles.listContainer}>
                {tripDetails.participants.map((user, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {user.fullname || user.username} ({user.role})
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No participants added</Text>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Supplies</Text>
            {tripDetails.supplies && tripDetails.supplies.length > 0 ? (
              <View style={styles.listContainer}>
                {tripDetails.supplies.map((supply, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {supply.name} {supply.quantity > 1 ? `(${supply.quantity})` : ''}
                    {supply.category ? ` - ${supply.category}` : ''}
                    {supply.notes ? ` - ${supply.notes}` : ''}
                  </Text>
                ))}
              </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewTrip;