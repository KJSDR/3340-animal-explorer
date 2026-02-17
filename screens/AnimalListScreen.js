import * as React from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchAnimals, addFavorite, removeFavorite } from '../features/animals/animalsSlice';

export default function AnimalListScreen() {
  const dispatch = useDispatch();
  const { animals, favorites, status, error } = useSelector((state) => state.animals);

  // SIGNPOST 3: Fetch animals on component mount
  React.useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch]);

  // SIGNPOST 6: Persist favorites to AsyncStorage
  React.useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (url) => {
    const isFav = favorites.includes(url);
    dispatch(isFav ? removeFavorite(url) : addFavorite(url));
  };

  if (status === 'loading' && animals.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.help}>Loading animals…</Text>
      </View>
    );
  }

  if (status === 'failed' && animals.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
        <Pressable style={styles.button} onPress={() => dispatch(fetchAnimals())}>
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={animals}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={styles.listContent}
        // SIGNPOST 4: Pull-to-refresh
        refreshing={status === 'loading'}
        onRefresh={() => dispatch(fetchAnimals())}
        renderItem={({ item }) => {
          const isFav = favorites.includes(item);
          return (
            <View style={styles.card}>
              <Image source={{ uri: item }} style={styles.image} />
              <View style={styles.row}>
                <Text style={styles.label}>{isFav ? '★ Favorite' : '☆ Not favorite'}</Text>
                <Pressable style={styles.button} onPress={() => toggleFavorite(item)}>
                  <Text style={styles.buttonText}>{isFav ? 'Remove' : 'Favorite'}</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 12 },
  card: { marginBottom: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, overflow: 'hidden' },
  image: { height: 220, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  label: { fontSize: 16 },
  button: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f4511e' },
  buttonText: { color: 'white', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  error: { color: '#b00020', fontSize: 16, marginBottom: 10, textAlign: 'center' },
  help: { marginTop: 10, color: '#444' },
});