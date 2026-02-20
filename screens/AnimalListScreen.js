import * as React from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchAnimals, addFavorite, removeFavorite } from '../features/animals/animalsSlice';
import { ThemeContext } from '../ThemeContext';

const createStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    listContent: { padding: theme.spacing.md },
    card: {
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      backgroundColor: theme.colors.card,
    },
    image: { height: 220, width: '100%' },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    label: { fontSize: 16, color: theme.colors.text },
    button: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: 14,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.primary,
    },
    buttonText: { color: 'white', fontWeight: '600' },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    error: { color: theme.colors.error, fontSize: 16, marginBottom: 10, textAlign: 'center' },
    help: { marginTop: 10, color: theme.colors.helpText },
  });

export default function AnimalListScreen() {
  const dispatch = useDispatch();
  const { animals, favorites, status, error } = useSelector((state) => state.animals);
  const theme = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  React.useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch]);

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
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