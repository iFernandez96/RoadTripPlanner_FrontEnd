// components/ExploreMapScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { ExpoMap } from 'expo-maps';
import ENV from '../config';

// Interfaces remain the same

const decodePolyline = (encoded: string) => {
  // Polyline decoding function remains the same
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

export default function ExploreMapScreen() {
  const mapRef = useRef<ExpoMap>(null);
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [route, setRoute] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialRegion, setInitialRegion] = useState<MapRegion>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [waypointInput, setWaypointInput] = useState<string>('');
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<string>('');
  const [mapType, setMapType] = useState<string>('standard');
  const [showTraffic, setShowTraffic] = useState<boolean>(false);
  const [showUserLocation, setShowUserLocation] = useState<boolean>(true);

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

  // All other functions remain the same, but use ExpoMap instead of MapView
  // calculateDistanceAndDuration, calculateDistanceMatrix, etc.

  // Map control functions use the new ExpoMap ref
  const zoomIn = () => {
    if (mapRef.current) {
      const region = {
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta / 2,
        longitudeDelta: initialRegion.longitudeDelta / 2,
      };
      mapRef.current.animateToRegion(region, 300);
      setInitialRegion(region);
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      const region = {
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta * 2,
        longitudeDelta: initialRegion.longitudeDelta * 2,
      };
      mapRef.current.animateToRegion(region, 300);
      setInitialRegion(region);
    }
  };

  const recenterMap = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 300);
        setInitialRegion(region);
      }
    } catch (error) {
      setErrorMsg('Could not fetch location');
    }
  };

  // UI toggles remain the same
  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const toggleTraffic = () => {
    setShowTraffic(!showTraffic);
  };

  // JSX rendering remains largely the same but uses MapContainer which has been updated
  return (
    <ScrollView contentContainerStyle={{ marginTop: 75, flexGrow: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Input section remains the same */}
        <View style={styles.inputContent}>
          {/* Form inputs for origin, destination, waypoints remain the same */}
          {/* Action buttons remain the same */}
        </View>

        <View style={{ height: 600 }}>
          <MapContainer
            ref={mapRef}
            initialRegion={initialRegion}
            mapType={mapType}
            showsTraffic={showTraffic}
            showsUserLocation={showUserLocation}
            markers={markers}
            route={route}
          />

          <View style={styles.mapControls}>
            {/* Map control buttons remain the same */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  // Style definitions remain the same
});