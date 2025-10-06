import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import AuthReducer from "./authSlice.js";
import FavoritesReducer from "./favoritesSlice.js"; 

// Auth Persist Config
const authPersistConfig = {
  key: "auth",
  storage,
};

// Favorites Persist Config
const favoritesPersistConfig = {
  key: "favorites",
  storage,
};

// Wrap reducers
const persistedAuthReducer = persistReducer(authPersistConfig, AuthReducer);
const persistedFavoritesReducer = persistReducer(favoritesPersistConfig, FavoritesReducer);

// Store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    favorites: persistedFavoritesReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persister = persistStore(store);
export default store;
