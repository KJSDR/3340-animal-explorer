import * as React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
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
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: theme.colors.text },
    subtitle: { fontSize: 16, color: theme.colors.subtext, textAlign: 'center' },
  });

export default function FavoritesScreen() {
  const favorites = useSelector((state) => state.animals.favorites);
  const theme = React.useContext(ThemeContext);
  const styles = createStyles(theme);

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