import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSeoStore } from "./store/useSeoStore.js";
import { useAuthStore } from "./store/authStore.js";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Navbar from "./components/ui/Navbar.jsx";

export default function App() {
  const activePage = useSeoStore((state) => state.activePage);
  const setActivePage = useSeoStore((state) => state.setActivePage);
  const fetchScanById = useSeoStore((state) => state.fetchScanById);
  const { isAuthenticated, fetchCurrentUser, loading: authLoading } = useAuthStore();

  // Load current user profile on app load to restore session
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Handle shared report URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scanId = params.get("scanId");
    if (scanId) {
      fetchScanById(scanId);
    }
  }, [fetchScanById]);

  // Protected route redirects
  useEffect(() => {
    if (!authLoading && !isAuthenticated && (activePage === "history" || activePage === "dashboard")) {
      const params = new URLSearchParams(window.location.search);
      if (!params.get("scanId")) {
        setActivePage("login");
      }
    }
  }, [isAuthenticated, activePage, authLoading, setActivePage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800">
      {/* Soft Mint-Green Ambient Gradient Blending */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[250px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activePage === "home" && <Home />}
            {activePage === "dashboard" && <Dashboard />}
            {activePage === "history" && <History />}
            {activePage === "login" && <Login />}
            {activePage === "signup" && <Signup />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
