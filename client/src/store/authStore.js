import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "https://search-pulse-backend.onrender.com");
const API_BASE_URL = `${BACKEND_URL}/api/auth`;

// Automatically initialize header if token already exists in localStorage
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!token,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const { token: userToken, data } = response.data;
      
      localStorage.setItem("token", userToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      
      set({
        user: data,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid email or password.";
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
      const { token: userToken, data } = response.data;
      
      localStorage.setItem("token", userToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      
      set({
        user: data,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed.";
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (err) {
      console.error("Logout request error:", err.message);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  fetchCurrentUser: async () => {
    const curToken = localStorage.getItem("token");
    if (!curToken) {
      set({ isAuthenticated: false, user: null, loading: false });
      return;
    }
    
    set({ loading: true, error: null });
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${curToken}`;
      const response = await axios.get(`${API_BASE_URL}/me`);
      set({
        user: response.data.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      console.error("Fetch current user failed:", err.message);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
