// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import tripService from '../context/tripService';

// const SearchLocationInput = ({ onSelect }: { onSelect: (location: any) => void }) => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (!query.trim()) return;

//     console.log('Search query submitted:', query);

//     try {
//       setLoading(true);
//       const coordRes = await tripService.getLocationCoord({ address: query });
//       console.log('Response from getLocationCoord:', coordRes);

//       const location = coordRes?.location;
//       if (!location) { 
//         console.warn('No location found for query');
//         return;
//       }

//       const suggestions = await tripService.getSuggestedLocations({
//         locationId: location.location_id,
//         radius: 1000,
//         limit: 10
//       });

//       console.log('Suggestions received:', suggestions);
//       setResults(suggestions);
//     } catch (error) {
//       console.error('Suggestion search error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View>
//       <TextInput
//         style={styles.input}
//         placeholder="Search for nearby suggestions..."
//         value={query}
//         onChangeText={setQuery}
//         onSubmitEditing={handleSearch}
//         returnKeyType="search"
//       />
//       {loading && <ActivityIndicator />}
//       <FlatList
//         data={results}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={async () => {
//               const resolved = await tripService.getLocationCoord({
//                 address: item.location.address
//               });
//               onSelect(resolved?.location);
//             }}
//           >
//             <Text>{item.location.name}</Text>
//             <Text style={styles.subText}>{item.location.address}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 6,
//     borderColor: '#ccc',
//     marginBottom: 10,
//   },
//   subText: {
//     fontSize: 12,
//     color: '#555',
//   },
// });

// export default SearchLocationInput;

import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import tripService from '../context/tripService';

const SearchLocationInput = ({ onSelect }: { onSelect: (location: any) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    console.log('Searching with query:', query);
    setLoading(true);

    try {
      // Step 1: resolve the query to get a stopId (using getLocationCoord)
      const coordRes = await tripService.getLocationCoord({ address: query });
      const location = coordRes?.location;

      if (!location?.location_id) {
        console.warn('No locationId found from geocoding');
        return;
      }

      // Step 2: fetch discover-nearby results using stopId
      const results = await tripService.discoverNearby({
        query,
        locationId: location.location_id,
        radius: 1000,
        limit: 10,
      });

      console.log('Discover-nearby results:', results);
      setResults(results);
    } catch (err) {
      console.error('Error during discover-nearby:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search for nearby places (e.g., gas, food)"
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {loading && <ActivityIndicator />}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              console.log('Selected discover result:', item);
              const resolved = await tripService.getLocationCoord({ address: item.address });
              console.log('Final resolved location:', resolved?.location);
              onSelect(resolved?.location);
            }}
          >
            <Text>{item.name}</Text>
            <Text style={styles.subText}>{item.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  subText: {
    fontSize: 12,
    color: '#555',
  },
});

export default SearchLocationInput;

