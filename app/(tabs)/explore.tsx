import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import ENV from '../../config';
interface DirectionsResponse {
  routes: Array<{
    legs: Array<{
      steps: Array<{
        polyline: {
          points: string;
        };
      }>;
    }>;
    overview_polyline: {
      points: string;
    };
  }>;
}

interface Waypoint {
  id: string;
  location: string;
}

const decodePolyline = (encoded: string) => {
  const poly = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return poly;
};

export default function DirectionsMapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [route, setRoute] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [waypointInput, setWaypointInput] = useState<string>('');
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<string>('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('Could not fetch location');
      }
    })();
  }, []);

  const addWaypoint = () => {
    if (waypointInput.trim() === '') return;

    const newWaypoint = {
      id: Date.now().toString(),
      location: waypointInput.trim()
    };

    setWaypoints([...waypoints, newWaypoint]);
    setWaypointInput('');
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const getDirections = async () => {
    if (!origin || !destination) {
      setErrorMsg('Origin and destination are required');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      let waypointsParam = '';
      if (waypoints.length > 0) {
        waypointsParam = '&waypoints=' + waypoints.map(wp => encodeURIComponent(wp.location)).join('|');
      }
      const apiKey = ENV.apiKey;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypointsParam}&key=${apiKey}`;

      const response = await fetch(url);
      const data: DirectionsResponse = await response.json();

      if (data.routes.length === 0) {
        setErrorMsg('No routes found');
        setLoading(false);
        return;
      }
      setDistance(data.routes[0].legs[0].distance.text)
      // Decode the polyline
      const points = decodePolyline(data.routes[0].overview_polyline.points);
      setRoute(points);
      const allLocations = [
        { title: 'Origin', location: origin },
        ...waypoints.map(wp => ({ title: 'Waypoint', location: wp.location })),
        { title: 'Destination', location: destination }
      ];

      const newMarkers = [];
      for (const loc of allLocations) {
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(loc.location)}&key=${apiKey}`;
          const geocodeResponse = await fetch(geocodeUrl);
          const geocodeData = await geocodeResponse.json();

          if (geocodeData.results && geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].geometry.location;
            newMarkers.push({
              coordinate: { latitude: lat, longitude: lng },
              title: loc.title,
              description: loc.location
            });
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      }

      setMarkers(newMarkers);

      if (points.length > 0 && mapRef.current) {
        mapRef.current.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        });
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      setErrorMsg('Error fetching directions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ marginTop:75,flexGrow: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.inputContent}>
          <Text style={styles.title}>Directions</Text>

          <TextInput
            style={styles.input}
            placeholder="Origin (e.g., Salinas, CA)"
            value={origin}
            onChangeText={setOrigin}
          />

          <TextInput
            style={styles.input}
            placeholder="Destination (e.g., San Francisco, CA)"
            value={destination}
            onChangeText={setDestination}
          />

          <View style={styles.waypointInputContainer}>
            <TextInput
              style={[styles.input, styles.waypointInput]}
              placeholder="Add waypoint (e.g., San Jose, CA)"
              value={waypointInput}
              onChangeText={setWaypointInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={addWaypoint}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {waypoints.length > 0 && (
            <View style={styles.waypointsList}>
              <Text style={styles.waypointsTitle}>Waypoints:</Text>
              {waypoints.map((waypoint) => (
                <View key={waypoint.id} style={styles.waypointItem}>
                  <Text style={styles.waypointText}>{waypoint.location}</Text>
                  <TouchableOpacity onPress={() => removeWaypoint(waypoint.id)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.getDirectionsButton}
            onPress={getDirections}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'Get Directions'}
            </Text>
          </TouchableOpacity>
         {distance && (
           <Text style={styles.title}>
             Distance: {distance}
           </Text>
         )}
        </View>

        {/* Map Section */}
        <View style={{ height: 600 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
              />
            ))}

            {route.length > 0 && (
              <Polyline
                coordinates={route}
                strokeWidth={4}
                strokeColor="#4285F4"
              />
            )}
          </MapView>
        </View>
      </View>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    maxHeight: Dimensions.get('window').height * 0.4,
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  waypointInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  waypointInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    width: 70,
  },
  getDirectionsButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  waypointsList: {
    marginBottom: 12,
  },
  waypointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  waypointItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  waypointText: {
    flex: 1,
  },
  removeText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#E53935',
    marginTop: 8,
  },
});