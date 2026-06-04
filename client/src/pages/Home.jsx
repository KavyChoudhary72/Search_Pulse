import React, { useState } from "react";
import { useSeoStore } from "../store/useSeoStore.js";
import { 
  Globe, 
  ArrowRight, 
  Loader2, 
  Cpu, 
  ShieldAlert, 
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuthStore } from "../store/authStore.js";


export default function Home() {
  const [url, setUrl] = useState("");
  const { runAnalysis, isLoading, error, progress } = useSeoStore();
  const { isAuthenticated } = useAuthStore();
  const setActivePage = useSeoStore((state) => state.setActivePage);


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      setActivePage("login");
      return;
    }

    if (url.trim()) {
      let targetUrl = url.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
      }
      runAnalysis(targetUrl);
    }
  };

  return (
    <div className="w-full relative overflow-x-hidden min-h-screen bg-white text-slate-800 font-sans">
      {/* 1. MINT-GREEN TO WHITE HERO GRADIENT PANEL */}
      <div className="relative w-full pt-24 pb-36 sm:pt-28 sm:pb-44 lg:pt-32 lg:pb-52 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 via-slate-50 to-white flex flex-col items-center text-center overflow-hidden">
        
        {/* Soft background ambient lights */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-[30%] right-[-5%] w-[250px] h-[250px] bg-teal-400/5 blur-[80px] rounded-full pointer-events-none -z-10 animate-pulse" />





        {/* Content Wrapper (Centers the heading and input elements) */}
        <div className="relative w-full max-w-4xl flex flex-col items-center z-10">

          {/* Hero Main Typography */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl leading-[1.1] mb-6 text-slate-900 relative z-20">
            Maximize Your Traffic with <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Smart AI SEO Strategies!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mb-10 font-bold leading-relaxed relative z-20">
            Instantly scan website code, measure page speeds, audit tags, and get easy AI-powered step-by-step suggestions to grow your traffic.
          </p>

          {/* Live Search Check Box Container */}
          <div className="w-full max-w-2xl px-4 mb-6 relative z-20">
            <form
              onSubmit={handleSubmit}
              className="relative z-10 group p-2 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-emerald-500/5 focus-within:border-emerald-400/80 transition-all duration-300"
            >
              <div className="relative flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center w-full pl-3">
                  <Globe className="text-slate-400 group-focus-within:text-emerald-500 transition-colors shrink-0" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your website URL (e.g., mysite.com)..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent pl-3 py-4 text-slate-800 placeholder-slate-400 font-semibold rounded-xl border-none outline-none focus:ring-0 text-sm sm:text-base"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !url}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-black tracking-wide hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Scanning...
                    </>
                  ) : (
                    <>
                      Start Scan
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-sm font-semibold flex items-center gap-2"
              >
                <ShieldAlert size={16} className="text-rose-500" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 2. LIGHT MINT & WHITE FEATURES SECTION */}
      <div className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <span className="px-3.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-xs font-bold tracking-widest uppercase mb-4">
            How we help
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight max-w-2xl leading-tight mb-16">
            Get more visitors to your website <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              with simple tools
            </span>
          </h2>

          {/* Three Feature Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Column 1 */}
            <div className="flex flex-col items-center p-8 rounded-2xl bg-slate-50/50 border border-slate-100 relative group hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <Globe size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">Search Intent Scanner</h3>
              <p className="text-sm text-slate-505 leading-relaxed font-semibold">
                Checks if your page content matches exactly what your target audience is typing in search engines.
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-center p-8 rounded-2xl bg-slate-50/50 border border-slate-100 relative group hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">AI Copywriter Helper</h3>
              <p className="text-sm text-slate-505 leading-relaxed font-semibold">
                Helps you write headlines and summaries that look natural, score highly, and get more clicks.
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-center p-8 rounded-2xl bg-slate-50/50 border border-slate-100 relative group hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">Structural Page Audits</h3>
              <p className="text-sm text-slate-505 leading-relaxed font-semibold">
                Inspects headings, image tags, and code structures so Google and search engines can read them easily.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PREMIUM WHITE & MINT HOME FOOTER */}
      <footer className="w-full bg-emerald-50/40 border-t border-emerald-500/10 py-16 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Brand Info Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-450 flex items-center justify-center shadow-md shadow-emerald-500/10 text-white font-black text-xs">
                S
              </div>
              <span className="text-slate-800 font-black tracking-tight text-base">
                Search <span className="text-emerald-600">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-slate-505 max-w-sm leading-relaxed font-bold">
              The ultimate next-generation search intent and page speed crawler. Optimize, analyze, and scale your organic visibility instantly with AI.
            </p>
          </div>

          {/* Copyright & Meta column */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-4 text-emerald-700/80 mb-2">
              <span className="hover:text-emerald-600 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-emerald-600 cursor-pointer transition-colors">Terms of Service</span>
            </div>
            <p className="text-slate-505 font-extrabold">
              &copy; {new Date().getFullYear()} Search Pulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
