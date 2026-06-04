import React, { useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useSeoStore } from "../store/useSeoStore.js";
import { KeyRound, Mail, Loader2, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, loading, error } = useAuthStore();
  const setActivePage = useSeoStore((state) => state.setActivePage);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      setActivePage("home");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-400/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-teal-400/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-450 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back to Search Pulse
          </h2>
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Login to start scanning websites
          </p>
        </div>

        {/* Errors */}
        {(formError || error) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <span>{formError || error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors shadow-sm font-semibold"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors shadow-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-350 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-emerald-500/10 active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Redirect link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 font-bold">
            Don't have an account?{" "}
            <span
              onClick={() => setActivePage("signup")}
              className="text-emerald-600 hover:text-emerald-500 cursor-pointer font-black transition-colors"
            >
              Get Started
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
