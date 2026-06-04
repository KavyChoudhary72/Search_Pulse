import React from "react";
import { useSeoStore } from "../../store/useSeoStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { ShieldCheck, History, Home, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const { activePage, setActivePage, currentScan } = useSeoStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/85 border-b border-slate-200/80 backdrop-blur-xl z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActivePage("home")} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck size={18} className="text-white font-black" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900 transition-colors duration-300">
            Search <span className="text-emerald-600 font-bold">Pulse</span>
          </span>
        </div>

        {/* Navigation Tabs & Auth */}
        {/* Navigation Tabs & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActivePage("home")}
            className={`flex items-center gap-2 px-3 sm:px-4 h-9 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 border ${
              activePage === "home"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                : "border-slate-200 bg-slate-50/50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            <Home size={14} className="shrink-0" />
            <span className="hidden sm:inline">New Audit</span>
          </button>

          {currentScan && (
            <button
              onClick={() => setActivePage("dashboard")}
              className={`flex items-center gap-2 px-3 sm:px-4 h-9 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 border ${
                activePage === "dashboard"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                  : "border-slate-200 bg-slate-50/50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <LayoutDashboard size={14} className="shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}

          {isAuthenticated && (
            <button
              onClick={() => setActivePage("history")}
              className={`flex items-center gap-2 px-3 sm:px-4 h-9 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 border ${
                activePage === "history"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                  : "border-slate-200 bg-slate-50/50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <History size={14} className="shrink-0" />
              <span className="hidden sm:inline">Scan History</span>
            </button>
          )}

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-200 mx-2 sm:mx-3 hidden xs:block" />

          {/* Authentication Actions */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="hidden md:flex flex-col items-end justify-center">
                <span className="text-xs font-black text-slate-800 leading-tight">
                  {user?.name}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {user?.role || "User"}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-400/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-black text-xs uppercase shadow-sm">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <button
                onClick={() => {
                  logout();
                  setActivePage("home");
                }}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300 active:scale-95"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActivePage("login")}
                className={`px-3 sm:px-4 h-9 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 border ${
                  activePage === "login"
                    ? "bg-slate-100 text-slate-800 border-slate-200"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActivePage("signup")}
                className="px-4 h-9 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 transition-all duration-300 active:scale-95 shadow-md shadow-emerald-500/10 flex items-center justify-center"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
