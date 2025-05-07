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

type Mode = 'geocode' | 'discover' | 'suggested';

interface LocationResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

interface Props {
  mode: Mode;
  locationId?: number;
  onSelect: (location: LocationResult) => void;
}

const SearchLocationInput: React.FC<Props> = ({ mode, locationId, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    console.log('Query submitted:', query);

    try {
      let data;

      if (mode === 'geocode') {
        const res = await tripService.getLocationCoord({ address: query });

        console.log('Raw response:', res);

        data = res?.location ? [res.location] : [];

        console.log('Parsed search results:', data);
      } else if (mode === 'discover') { // Possible feature
        // Add implementation: tripService.discoverNearby(query, locationId)
      } else if (mode === 'suggested') { // Another possible feature
        // Add implementation: tripService.getSuggestedLocations(locationId, query)
        if (!locationId) {
            throw new Error('locationId is required for suggested search');
          }
          data = await tripService.getSuggestedLocations({
            locationId,
            radius: 1000,
            limit: 10
          });
      }

      setResults(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search for a location..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {loading && <ActivityIndicator size="small" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => onSelect(item)}
          >
            <Text>{item.name || item.address}</Text>
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
    padding: 8,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 5,
    borderRadius: 4,
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
});

export default SearchLocationInput;
