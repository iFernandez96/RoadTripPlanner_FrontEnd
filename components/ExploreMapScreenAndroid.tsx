// components/MapContainer/MapContainer.android.tsx
import React, { forwardRef } from 'react';
import { ExpoMap, ExpoMarker, ExpoPolyline } from 'expo-maps';

interface MapContainerProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  mapType?: string;
  showsTraffic?: boolean;
  showsUserLocation?: boolean;
  markers?: Array<{
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title: string;
    description: string;
  }>;
  route?: Array<{
    latitude: number;
    longitude: number;
  }>;
}

// Make Android use the same component as other platforms
const MapContainer = forwardRef<ExpoMap, MapContainerProps>(
  ({ initialRegion, mapType = 'standard', showsTraffic = false, showsUserLocation = true, markers = [], route = [] }, ref) => {
    return (
      <ExpoMap
        ref={ref}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        mapType={mapType}
        showsTraffic={showsTraffic}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={true}
      >
        {markers.map((marker, index) => (
          <ExpoMarker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}

        {route.length > 0 && (
          <ExpoPolyline
            coordinates={route}
            strokeWidth={4}
            strokeColor="#4285F4"
          />
        )}
      </ExpoMap>
    );
  }
);

export default MapContainer;