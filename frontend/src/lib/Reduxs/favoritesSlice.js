import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const property = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item._id === property._id
      );

      if (existingIndex !== -1) {
        // Remove it
        state.items.splice(existingIndex, 1);
      } else {
        // Add it
        state.items.push(property);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
