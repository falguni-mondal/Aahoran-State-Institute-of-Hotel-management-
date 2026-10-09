import axios from 'axios';
import { store } from '../store/store.js';
import { setCredentials, logOut } from '../store/features/authSlice.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Central API instance for all protected and standard application requests
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial: Transmits the HttpOnly sihm_session cookie across requests
});

// Queue management to prevent race conditions during silent refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// =========================================
// 1. REQUEST INTERCEPTOR (In-Memory Token Injection)
// =========================================
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    // Attach the short-lived in-memory Access Token if present
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================================
// 2. RESPONSE INTERCEPTOR (Silent Refresh & RTR Protection)
// =========================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect our custom backend expired token flag
    const isTokenExpired =
      error.response?.status === 401 && error.response?.data?.isExpired === true;

    if (isTokenExpired && !originalRequest._retry) {
      // If a refresh is already underway by a concurrent request, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((queuedError) => Promise.reject(queuedError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use clean vanilla axios to bypass interceptors and avoid recursive loops
        const { data } = await axios.get(`${API_BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = data.accessToken;

        // Update Redux state with fresh access token and sync verified identity claims
        store.dispatch(
          setCredentials({
            accessToken: newAccessToken,
            ...(data.user ? { user: data.user } : {}),
          })
        );

        // Resolve all requests stalled in the queue
        processQueue(null, newAccessToken);

        // Retry the original request that initially failed
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, expired, or triggered reuse detection
        processQueue(refreshError, null);
        store.dispatch(logOut());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;