import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // Automatically disables Redux DevTools in production to prevent 
  // users from inspecting your state tree and security flags in the browser.
  devTools: import.meta.env.MODE !== 'production',
});