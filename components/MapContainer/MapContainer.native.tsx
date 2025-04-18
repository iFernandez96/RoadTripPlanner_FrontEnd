// components/MapContainer/MapContainer.native.tsx
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapContainerProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  mapType: string;
  showsTraffic: boolean;
  showsUserLocation: boolean;
  markers: Array<{
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title: string;
    description: string;
  }>;
  route: Array<{
    latitude: number;
    longitude: number;
  }>;
}

const MapContainer = forwardRef<MapView, MapContainerProps>(
  ({ initialRegion, mapType, showsTraffic, showsUserLocation, markers, route }, ref) => {
    return (
      <MapView
        ref={ref}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        mapType={mapType as any}
        showsTraffic={showsTraffic}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={true}
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
    );
  }
);

export default MapContainer;