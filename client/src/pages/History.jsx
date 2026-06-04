import React, { useEffect, useState } from "react";
import { useSeoStore } from "../store/useSeoStore.js";
import { Calendar, Globe, Award, Search, ArrowUpRight, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { history, fetchHistory } = useSeoStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleViewReport = (scan) => {
    // Set currentScan to the full database document and redirect to dashboard
    useSeoStore.setState({
      currentScan: scan,
      activePage: "dashboard"
    });
  };

  const filteredHistory = history.filter((item) =>
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP HEADER STATUS ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Telemetry Database
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Past SEO Audits
            </h2>
          </div>

          {/* Search/Filter input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search past audits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Dynamic scan items list */}
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-200 bg-white max-w-lg mx-auto shadow-sm">
            <ShieldAlert className="text-slate-300 mb-4" size={40} />
            <h3 className="text-lg font-bold text-slate-800">No Audits Found</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed font-semibold">
              {searchTerm ? "No past audits matches your search term." : "You haven't run any website SEO audits yet. Head back to New Audit to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistory.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-5 rounded-2xl bg-white border border-slate-200/85 hover:border-emerald-500/35 transition-all duration-300 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                    <h4 className="text-base font-extrabold text-slate-850 truncate group-hover:text-slate-950 transition-colors">
                      {item.url}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Award size={12} />
                      SEO Score: {Math.round(item.scores?.seo || 0)}
                    </span>
                  </div>
                </div>

                {/* Score badge & View detailed report trigger */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-full border border-emerald-500/20 bg-emerald-50 flex items-center justify-center font-black text-emerald-600 text-sm">
                    {Math.round(item.scores?.seo || 0)}
                  </div>
                  <button
                    onClick={() => handleViewReport(item)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all duration-300 shadow-sm active:scale-95"
                    title="View Audit Report"
                  >
                    <ArrowUpRight size={16} fill="currentColor" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
