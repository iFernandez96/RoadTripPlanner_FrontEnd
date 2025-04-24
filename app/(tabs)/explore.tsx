// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, View, Text, Dimensions, TextInput, ScrollView, TouchableOpacity } from 'react-native';
// import MapView, { Marker, Polyline, PROVIDER_GOOGLE, MapTypes } from 'react-native-maps';
// import * as Location from 'expo-location';
// import ENV from '../../config';
// import { MaterialIcons } from '@expo/vector-icons';

// interface DirectionsResponse {
//   routes: Array<{
//     legs: Array<{
//       steps: Array<{
//         polyline: {
//           points: string;
//         };
//       }>;
//       distance: {
//         text: string;
//         value: number;
//       };
//       duration: {
//         text: string;
//         value: number;
//       };
//     }>;
//     overview_polyline: {
//       points: string;
//     };
//   }>;
// }

// interface DistanceMatrixResponse {
//   destination_addresses: string[];
//   origin_addresses: string[];
//   rows: Array<{
//     elements: Array<{
//       distance: {
//         text: string;
//         value: number;
//       };
//       duration: {
//         text: string;
//         value: number;
//       };
//       status: string;
//     }>;
//   }>;
//   status: string;
// }

// interface Waypoint {
//   id: string;
//   location: string;
// }

// const decodePolyline = (encoded: string) => {
//   const poly = [];
//   let index = 0, lat = 0, lng = 0;

//   while (index < encoded.length) {
//     let b, shift = 0, result = 0;

//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);

//     const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
//     lat += dlat;

//     shift = 0;
//     result = 0;

//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);

//     const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
//     lng += dlng;

//     poly.push({
//       latitude: lat / 1e5,
//       longitude: lng / 1e5,
//     });
//   }

//   return poly;
// };

// export default function DirectionsMapScreen() {
//   const mapRef = useRef<MapView | null>(null);
//   const [origin, setOrigin] = useState<string>('');
//   const [destination, setDestination] = useState<string>('');
//   const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
//   const [route, setRoute] = useState<any[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [initialRegion, setInitialRegion] = useState({
//     latitude: 37.78825,
//     longitude: -122.4324,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [waypointInput, setWaypointInput] = useState<string>('');
//   const [markers, setMarkers] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [distance, setDistance] = useState<string>('');
//   const [mapType, setMapType] = useState<MapTypes>('standard');
//   const [showTraffic, setShowTraffic] = useState<boolean>(false);
//   const [showUserLocation, setShowUserLocation] = useState<boolean>(true);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       try {
//         let location = await Location.getCurrentPositionAsync({});
//         setInitialRegion({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         });
//       } catch (error) {
//         setErrorMsg('Could not fetch location');
//       }
//     })();
//   }, []);

//   const calculateDistanceAndDuration = (data: DirectionsResponse) => {
//     try {
//       if (!data.routes || data.routes.length === 0) {
//         setDistance('No route found');
//         return;
//       }

//       let totalDistance = 0;
//       let totalDuration = 0;
//       let distanceDetails = [];

//       data.routes[0].legs.forEach((leg, index) => {
//         if (leg.distance && leg.duration) {
//           totalDistance += leg.distance.value;
//           totalDuration += leg.duration.value;

//           let from = index === 0 ? 'Origin' : `Waypoint ${index}`;
//           let to = index === data.routes[0].legs.length - 1 ? 'Destination' : `Waypoint ${index + 1}`;

//           distanceDetails.push({
//             from: from,
//             to: to,
//             distance: leg.distance.text,
//             duration: leg.duration.text
//           });
//         }
//       });
//       const totalDistanceMiles = (totalDistance / 1609.34).toFixed(2);

//       const hours = Math.floor(totalDuration / 3600);
//       const minutes = Math.floor((totalDuration % 3600) / 60);

//       const totalDurationText = hours > 0
//         ? `${hours} hr ${minutes} min`
//         : `${minutes} min`;

//       setDistance(`${totalDistanceMiles} mi, ${totalDurationText}`);

//       console.log("Route details:", distanceDetails);
//     } catch (error) {
//       console.error('Error calculating distance:', error);
//       setDistance('Error calculating distance');
//     }
//   };

//   const calculateDistanceMatrix = (data: DistanceMatrixResponse) => {
//     try {
//       if (!data.rows || data.rows.length === 0 || !data.rows[0].elements || data.rows[0].elements.length === 0) {
//         setDistance('No distance data found');
//         return;
//       }

//       const element = data.rows[0].elements[0];
//       if (element.status !== 'OK') {
//         setDistance(`Error: ${element.status}`);
//         return;
//       }

//       const distanceMiles = (element.distance.value / 1609.34).toFixed(2);
//       const durationSecs = element.duration.value;

//       const hours = Math.floor(durationSecs / 3600);
//       const minutes = Math.floor((durationSecs % 3600) / 60);

//       const durationText = hours > 0
//         ? `${hours} hr ${minutes} min`
//         : `${minutes} min`;

//       setDistance(`${distanceMiles} mi, ${durationText}`);
//     } catch (error) {
//       console.error('Error calculating distance matrix:', error);
//       setDistance('Error calculating distance');
//     }
//   };

//   const addWaypoint = () => {
//     if (waypointInput.trim() === '') return;

//     const newWaypoint = {
//       id: Date.now().toString(),
//       location: waypointInput.trim()
//     };

//     setWaypoints([...waypoints, newWaypoint]);
//     setWaypointInput('');
//   };

//   const removeWaypoint = (id: string) => {
//     setWaypoints(waypoints.filter(wp => wp.id !== id));
//   };

//   const getDirections = async () => {
//     if (!origin || !destination) {
//       setErrorMsg('Origin and destination are required');
//       return;
//     }

//     setLoading(true);
//     setErrorMsg(null);

//     try {
//       let waypointsParam = '';
//       if (waypoints.length > 0) {
//         waypointsParam = '&waypoints=' + waypoints.map(wp => encodeURIComponent(wp.location)).join('|');
//       }
//       const apiKey = ENV.apiKey;
//       const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypointsParam}&key=${apiKey}`;

//       const response = await fetch(url);
//       const data: DirectionsResponse = await response.json();

//       if (data.routes.length === 0) {
//         setErrorMsg('No routes found');
//         setLoading(false);
//         return;
//       }

//       calculateDistanceAndDuration(data);
//       // Decode the polyline
//       const points = decodePolyline(data.routes[0].overview_polyline.points);
//       setRoute(points);
//       const allLocations = [
//         { title: 'Origin', location: origin },
//         ...waypoints.map(wp => ({ title: 'Waypoint', location: wp.location })),
//         { title: 'Destination', location: destination }
//       ];

//       const newMarkers = [];
//       for (const loc of allLocations) {
//         try {
//           const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(loc.location)}&key=${apiKey}`;
//           const geocodeResponse = await fetch(geocodeUrl);
//           const geocodeData = await geocodeResponse.json();

//           if (geocodeData.results && geocodeData.results.length > 0) {
//             const { lat, lng } = geocodeData.results[0].geometry.location;
//             newMarkers.push({
//               coordinate: { latitude: lat, longitude: lng },
//               title: loc.title,
//               description: loc.location
//             });
//           }
//         } catch (error) {
//           console.error('Geocoding error:', error);
//         }
//       }

//       setMarkers(newMarkers);

//       if (points.length > 0 && mapRef.current) {
//         mapRef.current.fitToCoordinates(points, {
//           edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//           animated: true
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching directions:', error);
//       setErrorMsg('Error fetching directions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDistanceAndTime = async () => {
//     if (!origin || !destination) {
//       setErrorMsg('Origin and destination are required');
//       return;
//     }

//     setLoading(true);
//     setErrorMsg(null);

//     try {
//       const apiKey = ENV.apiKey;
//       const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//       const response = await fetch(url);
//       const data: DistanceMatrixResponse = await response.json();

//       if (data.status !== 'OK') {
//         setErrorMsg(`API Error: ${data.status}`);
//         setLoading(false);
//         return;
//       }

//       calculateDistanceMatrix(data);

//     } catch (error) {
//       console.error('Error fetching distance matrix:', error);
//       setErrorMsg('Error fetching distance information');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const zoomIn = () => {
//     if (mapRef.current) {
//       const region = {
//         ...initialRegion,
//         latitudeDelta: initialRegion.latitudeDelta / 2,
//         longitudeDelta: initialRegion.longitudeDelta / 2,
//       };
//       mapRef.current.animateToRegion(region, 300);
//       setInitialRegion(region);
//     }
//   };

//   const zoomOut = () => {
//     if (mapRef.current) {
//       const region = {
//         ...initialRegion,
//         latitudeDelta: initialRegion.latitudeDelta * 2,
//         longitudeDelta: initialRegion.longitudeDelta * 2,
//       };
//       mapRef.current.animateToRegion(region, 300);
//       setInitialRegion(region);
//     }
//   };

//   const recenterMap = async () => {
//     try {
//       let location = await Location.getCurrentPositionAsync({});
//       const region = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       };

//       if (mapRef.current) {
//         mapRef.current.animateToRegion(region, 300);
//         setInitialRegion(region);
//       }
//     } catch (error) {
//       setErrorMsg('Could not fetch location');
//     }
//   };

//   const toggleMapType = () => {
//     setMapType(mapType === 'standard' ? 'satellite' : 'standard');
//   };

//   const toggleTraffic = () => {
//     setShowTraffic(!showTraffic);
//   };

//   return (
//     <ScrollView contentContainerStyle={{ marginTop: 75, flexGrow: 1 }}>
//       <View style={{ flex: 1, backgroundColor: '#fff' }}>
//         <View style={styles.inputContent}>
//           <Text style={styles.title}>Distance and Directions</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Origin (e.g., Salinas, CA)"
//             value={origin}
//             onChangeText={setOrigin}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Destination (e.g., San Francisco, CA)"
//             value={destination}
//             onChangeText={setDestination}
//           />

//           <View style={styles.waypointInputContainer}>
//             <TextInput
//               style={[styles.input, styles.waypointInput]}
//               placeholder="Add waypoint (e.g., San Jose, CA)"
//               value={waypointInput}
//               onChangeText={setWaypointInput}
//             />
//             <TouchableOpacity style={styles.addButton} onPress={addWaypoint}>
//               <Text style={styles.buttonText}>Add</Text>
//             </TouchableOpacity>
//           </View>

//           {waypoints.length > 0 && (
//             <View style={styles.waypointsList}>
//               <Text style={styles.waypointsTitle}>Waypoints:</Text>
//               {waypoints.map((waypoint) => (
//                 <View key={waypoint.id} style={styles.waypointItem}>
//                   <Text style={styles.waypointText}>{waypoint.location}</Text>
//                   <TouchableOpacity onPress={() => removeWaypoint(waypoint.id)}>
//                     <Text style={styles.removeText}>✕</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           )}

//           <View style={styles.buttonsContainer}>
//             <TouchableOpacity
//               style={[styles.actionButton, styles.distanceButton]}
//               onPress={getDistanceAndTime}
//               disabled={loading}
//             >
//               <Text style={styles.buttonText}>
//                 {loading ? 'Loading...' : 'Get Distance'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.actionButton, styles.directionsButton]}
//               onPress={getDirections}
//               disabled={loading}
//             >
//               <Text style={styles.buttonText}>
//                 {loading ? 'Loading...' : 'Get Directions'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {errorMsg && (
//             <Text style={styles.errorText}>{errorMsg}</Text>
//           )}

//           {distance && (
//             <Text style={styles.distanceText}>
//               Distance and Time: {distance}
//             </Text>
//           )}
//         </View>

//         <View style={{ height: 600 }}>
//           <MapView
//             ref={mapRef}
//             style={{ flex: 1 }}
//             provider={PROVIDER_GOOGLE}
//             initialRegion={initialRegion}
//             mapType={mapType}
//             showsTraffic={showTraffic}
//             showsUserLocation={showUserLocation}
//             showsMyLocationButton={false}
//             showsCompass={false}
//             showsScale={true}
//           >
//             {markers.map((marker, index) => (
//               <Marker
//                 key={index}
//                 coordinate={marker.coordinate}
//                 title={marker.title}
//                 description={marker.description}
//               />
//             ))}

//             {route.length > 0 && (
//               <Polyline
//                 coordinates={route}
//                 strokeWidth={4}
//                 strokeColor="#4285F4"
//               />
//             )}
//           </MapView>

//           <View style={styles.mapControls}>
//             <TouchableOpacity style={styles.mapControlButton} onPress={zoomIn}>
//               <MaterialIcons name="add" size={24} color="#333" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.mapControlButton} onPress={zoomOut}>
//               <MaterialIcons name="remove" size={24} color="#333" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.mapControlButton} onPress={recenterMap}>
//               <MaterialIcons name="my-location" size={24} color="#333" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.mapControlButton} onPress={toggleMapType}>
//               <MaterialIcons name={mapType === 'standard' ? 'satellite' : 'map'} size={24} color="#333" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.mapControlButton, showTraffic ? styles.activeButton : null]}
//               onPress={toggleTraffic}
//             >
//               <MaterialIcons name="traffic" size={24} color={showTraffic ? "#4285F4" : "#333"} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   inputContainer: {
//     maxHeight: Dimensions.get('window').height * 0.4,
//     width: '100%',
//     backgroundColor: '#f8f9fa',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   inputContent: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
//   waypointInputContainer: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   waypointInput: {
//     flex: 1,
//     marginBottom: 0,
//     marginRight: 8,
//   },
//   addButton: {
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     width: 70,
//   },
//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   actionButton: {
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     flex: 1,
//   },
//   distanceButton: {
//     backgroundColor: '#FF9800',
//     marginRight: 8,
//   },
//   directionsButton: {
//     backgroundColor: '#4285F4',
//     marginLeft: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   waypointsList: {
//     marginBottom: 12,
//   },
//   waypointsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   waypointItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#e8f0fe',
//     padding: 12,
//     borderRadius: 6,
//     marginBottom: 8,
//   },
//   waypointText: {
//     flex: 1,
//   },
//   removeText: {
//     color: '#E53935',
//     fontWeight: 'bold',
//     fontSize: 16,
//     paddingHorizontal: 8,
//   },
//   mapContainer: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   errorText: {
//     color: '#E53935',
//     marginBottom: 8,
//   },
//   distanceText: {
//     fontSize: 16,
//     fontWeight: '500',
//     backgroundColor: '#e8f0fe',
//     padding: 12,
//     borderRadius: 6,
//     marginTop: 8,
//   },

//   mapControls: {
//     position: 'absolute',
//     right: 16,
//     top: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     borderRadius: 8,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   mapControlButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   activeButton: {
//     backgroundColor: 'rgba(232, 240, 254, 0.8)',
//   },
// });