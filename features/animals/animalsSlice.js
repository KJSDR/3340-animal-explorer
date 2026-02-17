import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// SIGNPOST 2: Fetch 10 random dog images
export const fetchAnimals = createAsyncThunk(
  'animals/fetchAnimals',
  async () => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const data = await response.json();
    return data.message; // Returns array of image URLs
  }
);

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    animals: [],
    favorites: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // SIGNPOST 5: Add favorite (avoid duplicates)
    addFavorite: (state, action) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    // SIGNPOST 5: Remove favorite
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(url => url !== action.payload);
    },
    // SIGNPOST 7: Set favorites from AsyncStorage
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.animals = action.payload;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addFavorite, removeFavorite, setFavorites } = animalsSlice.actions;
export default animalsSlice.reducer;