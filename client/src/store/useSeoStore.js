import { create } from "zustand";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/analysis`;

export const useSeoStore = create((set, get) => ({
  currentScan: null,
  history: [],
  isLoading: false,
  error: null,
  activePage: "home", // 'home' | 'dashboard' | 'history'
  progress: { percent: 0, stage: "" },

  setActivePage: (page) => set({ activePage: page }),

  // Triggers the backend scraper, analyzer, and Gemini AI pipeline
  runAnalysis: async (url) => {
    set({ 
      isLoading: true, 
      error: null, 
      currentScan: null,
      activePage: "dashboard",
    });

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.post(`${API_BASE_URL}/scan`, { url }, config);

      if (response.data.success) {
        set({
          currentScan: response.data.data,
          isLoading: false,
        });
        // Refresh history automatically after a scan
        get().fetchHistory();
      }
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to complete website audit.",
        isLoading: false,
        activePage: "home",
      });
    }
  },

  // Fetches past audits from MongoDB Atlas
  fetchHistory: async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get(`${BACKEND_URL}/api/history`, config);
      if (response.data.success) {
        set({ history: response.data.data });
      }
    } catch (err) {
      console.error("History fetch failed:", err.message);
    }
  },

  // Loads a specific audit by ID (used for shared links, public route)
  fetchScanById: async (id) => {
    set({ 
      isLoading: true, 
      error: null,
      currentScan: null,
      activePage: "dashboard",
    });
    try {
      const response = await axios.get(`${BACKEND_URL}/api/report/${id}`);
      if (response.data.success) {
        set({
          currentScan: response.data.data,
          isLoading: false,
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load audit report.",
        isLoading: false,
        activePage: "home",
      });
    }
  },

  lazyLoadScan: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.post(`${API_BASE_URL}/scan/${id}/lazy`, {}, config);
      if (response.data.success) {
        set({
          currentScan: response.data.data,
        });
      }
    } catch (err) {
      console.error("Lazy loading failed:", err.response?.data?.message || err.message);
    }
  },
}));

