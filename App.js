import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from './store';
import AnimalListScreen from './screens/AnimalListScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { setFavorites } from './features/animals/animalsSlice';
import { ThemeContext } from './ThemeContext';
import { lightTheme, darkTheme } from './theme';

const Tab = createBottomTabNavigator();

function RootNav() {
  const dispatch = useDispatch();
  const favoritesCount = useSelector((state) => state.animals.favorites.length);
  const theme = React.useContext(ThemeContext);

  React.useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          dispatch(setFavorites(JSON.parse(stored)));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };
    loadFavorites();
  }, [dispatch]);

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Explore: focused ? 'paw' : 'paw-outline',
              Favorites: focused ? 'heart' : 'heart-outline',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Explore" component={AnimalListScreen} />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      <Provider store={store}>
        <RootNav />
      </Provider>
    </ThemeContext.Provider>
  );
}