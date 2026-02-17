import * as React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function FavoritesScreen() {
  const favorites = useSelector((state) => state.animals.favorites);

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No favorites yet</Text>
        <Text style={styles.subtitle}>Go to Explore and tap Favorite on an image.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 12 },
  card: { marginBottom: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, overflow: 'hidden' },
  image: { height: 220, width: '100%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
});