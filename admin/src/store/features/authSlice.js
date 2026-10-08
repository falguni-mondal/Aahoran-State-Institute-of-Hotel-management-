import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/axios.js';

// Module-scoped in-flight promise to deduplicate concurrent refresh calls
let inFlightRefreshPromise = null;

// =========================================
// 1. ASYNC THUNK: DEDUPLICATED SESSION REHYDRATION
// =========================================
export const checkAuthSession = createAsyncThunk(
  'auth/checkAuthSession',
  async (_, { rejectWithValue }) => {
    // If a refresh handshake is already pending in the network layer, reuse its promise
    if (inFlightRefreshPromise) {
      try {
        return await inFlightRefreshPromise;
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message || 'No active administrative session detected.'
        );
      }
    }

    // Initialize the single shared network request
    inFlightRefreshPromise = apiClient
      .get('/auth/refresh')
      .then((res) => res.data)
      .finally(() => {
        inFlightRefreshPromise = null; // Clean up when settled
      });

    try {
      const data = await inFlightRefreshPromise;
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'No active administrative session detected.'
      );
    }
  }
);

// =========================================
// 2. INITIAL STATE
// =========================================
const initialState = {
  user: null, // { id, email, role }
  accessToken: null,
  isAuthenticated: false,
  is2faVerified: false,
  isInitializing: true,
  error: null,
};

// =========================================
// 3. SLICE DEFINITION
// =========================================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, token } = action.payload;

      if (user) {
        state.user = user;
      }

      state.accessToken = accessToken || token;
      state.isAuthenticated = true;
      state.is2faVerified = true;
      state.isInitializing = false;
      state.error = null;
    },

    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.is2faVerified = false;
      state.isInitializing = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthSession.pending, (state) => {
        state.isInitializing = true;
        state.error = null;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        const { user, accessToken } = action.payload;

        if (user) {
          state.user = user;
        }

        state.accessToken = accessToken;
        state.isAuthenticated = true;
        state.is2faVerified = true;
        state.isInitializing = false;
        state.error = null;
      })
      .addCase(checkAuthSession.rejected, (state, action) => {
        // Only clear credentials if we aren't already authenticated
        if (!state.isAuthenticated) {
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
          state.is2faVerified = false;
        }
        state.isInitializing = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRole = (state) => state.auth.user?.role;
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIs2faVerified = (state) => state.auth.is2faVerified;
export const selectIsInitializing = (state) => state.auth.isInitializing;

export default authSlice.reducer;