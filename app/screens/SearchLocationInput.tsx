import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import tripService from '../context/tripService';

interface LocationResult {
  location: {
    location_id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    [key: string]: any;
  };
  distance: number;
}

interface Props {
  locationId: number;
  radius?: number;
  limit?: number;
  onSelect: (location: LocationResult['location']) => void;
}

const SearchLocationInput: React.FC<Props> = ({
  locationId,
  radius = 1000,
  limit = 10,
  onSelect,
}) => {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tripService.getSuggestedLocations({
        locationId,
        radius,
        limit,
      });
      setResults(data);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setError('Could not load suggested stops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchSuggestions();
    }
  }, [locationId]);

  return (
    <View>
      {loading && <ActivityIndicator size="small" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.location.location_id}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => onSelect(item.location)}
          >
            <Text>{item.location.name}</Text>
            <Text style={styles.subText}>{item.location.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
