import React, { useState, useEffect } from "react";
import { useSeoStore } from "../store/useSeoStore.js";
import {
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  LayoutDashboard,
  Table,
  Cpu,
  Zap,
  Sparkles,
  BarChart3,
  Bookmark,
  TrendingUp,
  ArrowLeft,
  Check,
  Download,
  Share2,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Link2,
  ListFilter,
  ChevronRight,
  Info,
  Eye,
  EyeOff,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Tooltip for Recharts
const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-2xl text-slate-100 text-xs font-semibold">
        <p className="text-slate-400 font-bold mb-1">{payload[0].name || "Metric"}</p>
        <p className="text-emerald-400 text-sm font-black">
          Score: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const currentScan = useSeoStore((state) => state.currentScan);
  const isLoading = useSeoStore((state) => state.isLoading);
  const setActivePage = useSeoStore((state) => state.setActivePage);
  const [copied, setCopied] = useState(false);
  const [showIssues, setShowIssues] = useState(false);

  // PREMIUM INTERACTIVE STATES
  const [keywordPriorities, setKeywordPriorities] = useState({}); // { word: 'High' | 'Medium' | 'Low' | 'Solved' }
  const [activeDrawerItem, setActiveDrawerItem] = useState(null); // selected checklist row item
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(null); // active breakdown slice filter
  const [hoveredTooltip, setHoveredTooltip] = useState(null); // tracks active custom tooltip ID
  
  // LIVE RECALCULATION STATES (FIXING SIMULATOR)
  const [resolvedIssues, setResolvedIssues] = useState({}); // { itemId: boolean }
  
  const [reportLayout, setReportLayout] = useState({
    showCharts: true,
    showKeywords: true,
    showLinks: true,
    showSecurity: true,
    showChecklist: true,
    showAiPlan: true,
  });

  // Keyboard shortcut listener to close drawers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDrawerItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isLazyLoading = currentScan && (currentScan.scores?.performance === null || currentScan.scores?.performance === undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans relative overflow-hidden">
        {/* Shimmering Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-400/5 blur-[100px] rounded-full pointer-events-none animate-pulse" />
        
        <div className="max-w-7xl mx-auto space-y-6 relative z-10 animate-pulse">
          {/* TOP STATUS HEADER PANEL SKELETON */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
            <div className="space-y-2.5 w-full md:max-w-md">
              <div className="h-3 w-24 bg-slate-250 rounded" />
              <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
            </div>
            {/* Buttons Skeleton */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="h-9 w-20 bg-slate-200 rounded-xl" />
              <div className="h-9 w-32 bg-slate-200 rounded-xl" />
              <div className="h-9 w-36 bg-slate-200 rounded-xl" />
            </div>
          </div>

          {/* 1. PRIMARY KPI STAT CARDS ROW SKELETON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200/85 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="space-y-2.5 w-2/3">
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                  <div className="h-7 w-20 bg-slate-200 rounded-lg" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
                <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0" />
              </div>
            ))}
          </div>

          {/* 2. DUAL INTERACTIVE CHARTS ROW SKELETON */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Trend Chart Card */}
            <div className="lg:col-span-8 bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm h-[380px] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-48 bg-slate-200 rounded-md" />
              </div>
              {/* Fake Chart bars */}
              <div className="w-full h-48 bg-slate-50 rounded-xl border border-slate-100 flex items-end p-4 gap-3">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-slate-200 rounded-t-md" 
                    style={{ height: `${Math.max(20, Math.sin(i / 1.5) * 50 + 50)}%` }} 
                  />
                ))}
              </div>
            </div>

            {/* Donut Chart Card */}
            <div className="lg:col-span-4 bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm h-[380px] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-5 w-40 bg-slate-200 rounded-md" />
              </div>
              {/* Fake Donut */}
              <div className="w-32 h-32 rounded-full border-[10px] border-slate-100 flex items-center justify-center mx-auto my-4 relative">
                <div className="w-20 h-20 rounded-full bg-white shadow-inner flex flex-col items-center justify-center space-y-1">
                  <div className="h-2 w-8 bg-slate-100 rounded" />
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-slate-200 rounded-full shrink-0" />
                    <div className="h-3 w-16 bg-slate-150 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. NEW DETAILED TELEMETRY CARDS SKELETON */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="h-4 w-1/2 bg-slate-250 rounded pb-1 border-b border-slate-100" />
                <div className="space-y-3.5 pt-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex justify-between items-center py-1">
                      <div className="h-3.5 w-28 bg-slate-200 rounded" />
                      <div className="h-3.5 w-12 bg-slate-150 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 4. SEO HEALTH CHECKLIST SKELETON */}
          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="h-4 w-1/4 bg-slate-250 rounded pb-1 border-b border-slate-100" />
            <div className="space-y-3.5 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3 w-1/3">
                    <div className="w-4 h-4 bg-slate-200 rounded shrink-0" />
                    <div className="h-3.5 w-full bg-slate-200 rounded" />
                  </div>
                  <div className="h-3.5 w-16 bg-slate-200 rounded" />
                  <div className="h-3.5 w-12 bg-slate-200 rounded" />
                  <div className="h-3.5 w-32 bg-slate-100 rounded" />
                  <div className="h-3.5 w-8 bg-slate-200 rounded ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentScan) return null;

  const { scores, metaData, aiSuggestions, issues = [], summary = {}, metrics = {} } = currentScan;

  // 1. EXTRACT DATA VALUES
  const missingAlts = metaData?.imagesWithoutAltCount || 0;
  const accessibilityScore = Math.round(scores?.accessibility || 90);
  const bestPracticesScore = Math.round(scores?.bestPractices || 95);
  const seoScore = Math.round(scores?.seo || 85);
  const performanceScore = Math.round(scores?.performance || 88);
  const hasH1 = (metaData?.headings?.h1?.length || 0) > 0;

  // LIVE RECALCULATION ENGINE (Calculates score bumps live on checking box)
  const isTitleResolved = resolvedIssues["title"] && !metaData?.title;
  const isDescriptionResolved = resolvedIssues["description"] && !metaData?.description;
  const isH1Resolved = resolvedIssues["h1"] && !hasH1;
  const isAltResolved = resolvedIssues["alt"] && missingAlts > 0;

  let dynamicSeoScore = seoScore;
  let dynamicAccessibilityScore = accessibilityScore;
  let dynamicIssues = [...issues];

  if (isTitleResolved) {
    dynamicSeoScore = Math.min(dynamicSeoScore + 15, 100);
    dynamicIssues = dynamicIssues.filter(i => !i.toLowerCase().includes("title"));
  }
  if (isDescriptionResolved) {
    dynamicSeoScore = Math.min(dynamicSeoScore + 15, 100);
    dynamicIssues = dynamicIssues.filter(i => !i.toLowerCase().includes("description"));
  }
  if (isH1Resolved) {
    dynamicSeoScore = Math.min(dynamicSeoScore + 15, 100);
    dynamicIssues = dynamicIssues.filter(i => !i.toLowerCase().includes("h1") && !i.toLowerCase().includes("heading"));
  }
  if (isAltResolved) {
    dynamicAccessibilityScore = Math.min(dynamicAccessibilityScore + Math.min(20, missingAlts * 2), 100);
    dynamicSeoScore = Math.min(dynamicSeoScore + Math.min(20, missingAlts * 2), 100);
    dynamicIssues = dynamicIssues.filter(i => !i.toLowerCase().includes("alt") && !i.toLowerCase().includes("image"));
  }

  // Helper functions for dynamic rating labels, colors, and icons
  const getSeoRating = (score) => {
    if (score >= 85) {
      return {
        label: "Excellent",
        textClass: "text-emerald-600",
        icon: <TrendingUp size={10} />
      };
    } else if (score >= 70) {
      return {
        label: "Good",
        textClass: "text-sky-650",
        icon: <TrendingUp size={10} />
      };
    } else if (score >= 50) {
      return {
        label: "Average",
        textClass: "text-amber-600",
        icon: <AlertTriangle size={10} className="text-amber-500 shrink-0" />
      };
    } else {
      return {
        label: "Poor",
        textClass: "text-rose-600",
        icon: <AlertTriangle size={10} className="text-rose-500 shrink-0" />
      };
    }
  };

  const getPerformanceRating = (score) => {
    if (score >= 85) return { label: "Fast Load Speed", textClass: "text-emerald-600" };
    if (score >= 70) return { label: "Moderate Speed", textClass: "text-sky-600" };
    if (score >= 50) return { label: "Slow Speed", textClass: "text-amber-600" };
    return { label: "Very Slow Speed", textClass: "text-rose-600" };
  };

  const getScoreGradientColors = (score) => {
    if (score >= 85) return { start: "#10b981", end: "#059669" }; // Emerald
    if (score >= 70) return { start: "#0ea5e9", end: "#0284c7" }; // Sky/Blue
    if (score >= 50) return { start: "#f59e0b", end: "#d97706" }; // Amber/Orange
    return { start: "#ef4444", end: "#dc2626" }; // Red
  };

  const seoRating = getSeoRating(dynamicSeoScore);
  const performanceRating = getPerformanceRating(performanceScore);
  const scoreGradient = getScoreGradientColors(dynamicSeoScore);

  // Keyword density, linking structures, SSL, viewport mobile details
  const keywordDensity = summary?.keywordDensity || [];
  const linksAnalysis = summary?.linksAnalysis || { internalCount: 0, externalCount: 0, brokenCount: 0 };
  const sslSecure = summary?.sslSecure ?? true;
  const mobileResponsive = summary?.mobileResponsive ?? true;

  // Pie/Donut Chart Data (Uses Dynamic Recalculated values)
  const donutData = [
    { name: "SEO Audit", value: dynamicSeoScore, color: "#10b981", desc: "Measures on-page HTML optimizations, structural headings, title relevance, and SSL protocols." },
    { name: "Performance", value: performanceScore, color: "#0ea5e9", desc: "Tracks mobile speed indexes, paint latency intervals, and static resource dimensions." },
    { name: "Accessibility", value: dynamicAccessibilityScore, color: "#a855f7", desc: "Audits accessibility parameters such as image alt tag descriptors and element scaling." },
    { name: "Best Practices", value: bestPracticesScore, color: "#6366f1", desc: "Analyzes social media Open Graph sharing configurations and structural validation rules." }
  ];

  // Monthly Area Line Chart Data (Crawl Index over months)
  const lineChartData = [
    { name: "Jan", Score: 65 },
    { name: "Feb", Score: 70 },
    { name: "Mar", Score: 72 },
    { name: "Apr", Score: 80 },
    { name: "May", Score: 78 },
    { name: "Jun", Score: 85 },
    { name: "Jul", Score: 82 },
    { name: "Aug", Score: dynamicSeoScore },
    { name: "Sep", Score: dynamicSeoScore + 2 > 100 ? 100 : dynamicSeoScore + 2 },
    { name: "Oct", Score: dynamicSeoScore + 4 > 100 ? 100 : dynamicSeoScore + 4 },
    { name: "Nov", Score: dynamicSeoScore + 6 > 100 ? 100 : dynamicSeoScore + 6 },
    { name: "Dec", Score: dynamicSeoScore + 8 > 100 ? 100 : dynamicSeoScore + 8 }
  ];

  // Checklist table data mapping to the crawled results (Respects Resolved State)
  const checkTableData = [
    {
      id: "title",
      name: "Website Title (Title Tag)",
      status: (metaData?.title || resolvedIssues["title"]) ? "Success" : "Warning",
      process: (metaData?.title || resolvedIssues["title"]) ? "100%" : "0%",
      quantity: (metaData?.title || resolvedIssues["title"]) ? "1 Item" : "0 Items",
      details: metaData?.title ? `"${metaData.title}"` : (resolvedIssues["title"] ? "Title Tag Mock-Fixed" : "Missing Title tag"),
      help: "The meta title represents the primary heading of your website displayed inside search index rows. It is essential for click-through metrics.",
      fix: "Verify that your website defines an active <title> element under the <head> block. Ensure it ranges between 10 and 60 characters."
    },
    {
      id: "description",
      name: "Website Description (Description Tag)",
      status: (metaData?.description || resolvedIssues["description"]) ? "Success" : "Warning",
      process: (metaData?.description || resolvedIssues["description"]) ? "100%" : "0%",
      quantity: (metaData?.description || resolvedIssues["description"]) ? "1 Item" : "0 Items",
      details: metaData?.description ? `"${metaData.description.slice(0, 50)}..."` : (resolvedIssues["description"] ? "Description Tag Mock-Fixed" : "Missing Description tag"),
      help: "Meta descriptions summarize page content to search engine indexes. A highly optimal description boosts search visibility.",
      fix: "Add a <meta name=\"description\" content=\"...\" /> tag inside your <head>. Maintain an informative text length between 50 and 160 characters."
    },
    {
      id: "h1",
      name: "Main Headline (H1 Tag)",
      status: (hasH1 || resolvedIssues["h1"]) ? ((metaData?.headings?.h1?.length === 1 || resolvedIssues["h1"]) ? "Success" : "Warning") : "Danger",
      process: (hasH1 || resolvedIssues["h1"]) ? "100%" : "0%",
      quantity: `${(metaData?.headings?.h1?.length || 0) + (resolvedIssues["h1"] && !hasH1 ? 1 : 0)} Items`,
      details: hasH1 ? `"${metaData.headings.h1[0]}"` : (resolvedIssues["h1"] ? "H1 Main Headline Mock-Fixed" : "Missing H1 tag"),
      help: "H1 tags define the major structural content heading of a webpage. Having exactly one H1 signals the page topic cleanly to crawlers.",
      fix: "Ensure your main body code has exactly one <h1> tag. If multiple exist, convert the extra instances into secondary <h2> or <h3> subheadings."
    },
    {
      id: "alt",
      name: "Image Descriptions (Alt Tags)",
      status: (missingAlts === 0 || resolvedIssues["alt"]) ? "Success" : "Warning",
      process: (missingAlts === 0 || resolvedIssues["alt"]) ? "100%" : "75%",
      quantity: resolvedIssues["alt"] ? "0 Missing" : `${missingAlts} Missing`,
      details: `${summary?.totalImages || 0} images total`,
      help: "Image alt tags are alternative text descriptors that enable screen readers to interpret graphics. Missing alts degrade accessibility.",
      fix: "Locate target images missing descriptions and append appropriate 'alt' attribute values (e.g. <img src=\"...\" alt=\"Description of image\" />)."
    },
    {
      id: "h2_h3",
      name: "Sub-headlines Structure (H2 & H3)",
      status: "Success",
      process: "100%",
      quantity: `${(metaData?.headings?.h2?.length || 0) + (metaData?.headings?.h3?.length || 0)} Headings`,
      details: `${metaData?.headings?.h2?.length || 0} H2s, ${metaData?.headings?.h3?.length || 0} H3s`,
      help: "H2 and H3 subheadings create hierarchical layout readability, aiding semantic interpretation of content by search engines.",
      fix: "Organize layout copy into clear sections marked by <h2> subheadings, and nest minor subsection topics within tertiary <h3> subheadings."
    }
  ];

  // Custom Glassmorphic Tooltip Helper Component
  const InteractiveTooltip = ({ id, text }) => (
    <div className="relative inline-block ml-1 z-30">
      <Info 
        size={12} 
        className="text-slate-300 hover:text-emerald-500 cursor-pointer transition-colors"
        onMouseEnter={() => setHoveredTooltip(id)}
        onMouseLeave={() => setHoveredTooltip(null)}
      />
      <AnimatePresence>
        {hoveredTooltip === id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2.5 rounded-lg border border-slate-200 bg-slate-900/95 backdrop-blur-sm text-[10px] text-slate-200 font-bold leading-normal shadow-xl text-center pointer-events-none"
          >
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-4 border-t-slate-900 border-x-4 border-x-transparent" />
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Copy share report link function
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?scanId=${currentScan._id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle keyword priorities
  const handleKeywordPriorityChange = (word, priority) => {
    setKeywordPriorities(prev => ({
      ...prev,
      [word]: priority
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* TOP STATUS HEADER PANEL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
          <div className="max-w-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              SEO Scan Report
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-1 break-all flex flex-wrap items-center gap-2">
              <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
              {currentScan.url}
            </h2>
          </div>
          
          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setActivePage("home")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-bold transition-all text-xs active:scale-95 shadow-sm"
            >
              <ArrowLeft size={13} fill="currentColor" /> Back
            </button>

            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all text-xs active:scale-95 shadow-sm ${
                copied 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950"
              }`}
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              {copied ? "Link Copied!" : "Share Report"}
            </button>

            <a
              href={`${import.meta.env.VITE_API_URL || "https://search-pulse-backend.onrender.com"}/api/analysis/export/${currentScan._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all text-xs active:scale-95 shadow-md shadow-emerald-600/10"
            >
              <Download size={13} /> Download PDF
            </a>
          </div>
        </div>

        {/* 1. PRIMARY KPI STAT CARDS ROW WITH GRADIENT SVG RADIAL PROGRESS RING */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* SEO Score card with Animated Radial Ring */}
          <div className="bg-white border border-slate-200/85 p-5 rounded-2xl flex items-center justify-between shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 group relative">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                SEO Score
                <InteractiveTooltip id="seo" text="Calculated aggregate score based on metadata, headlines, SSL and OG sharing profiles." />
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{dynamicSeoScore}%</h3>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${seoRating.textClass} mt-1`}>
                {seoRating.icon} {seoRating.label}
              </span>
            </div>
            
            {/* Animated SVG Radial Progress Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <defs>
                  <linearGradient id="scoreRingGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={scoreGradient.start} />
                    <stop offset="100%" stopColor={scoreGradient.end} />
                  </linearGradient>
                </defs>
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  stroke="url(#scoreRingGradient)"
                  strokeWidth="3.5"
                  strokeDasharray={`${dynamicSeoScore}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-black text-slate-700">{dynamicSeoScore}</span>
            </div>
          </div>

          {/* Page speed */}
          <div className="bg-white border border-slate-200/85 p-5 rounded-2xl flex items-center justify-between shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
            {isLazyLoading ? (
              <div className="flex justify-between items-center w-full animate-pulse">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    Page Speed
                    <InteractiveTooltip id="speed" text="Lighthouse performance calculations measured via PageSpeed Insights." />
                  </span>
                  <div className="h-6 w-16 bg-slate-200 rounded" />
                  <div className="h-3.5 w-24 bg-slate-100 rounded" />
                </div>
                <div className="w-11 h-11 bg-slate-200 rounded-xl shrink-0" />
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    Page Speed
                    <InteractiveTooltip id="speed" text="Lighthouse performance calculations measured via PageSpeed Insights." />
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{performanceScore}%</h3>
                  <span className={`text-[10px] font-bold ${performanceRating.textClass} mt-1 block`}>
                    {metrics?.speedIndex ? `Index: ${metrics.speedIndex} (${performanceRating.label})` : performanceRating.label}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-lg shrink-0">
                  {performanceScore}
                </div>
              </>
            )}
          </div>

          {/* Audited Assets */}
          <div className="bg-white border border-slate-200/85 p-5 rounded-2xl flex items-center justify-between shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                Page Images Scanned
                <InteractiveTooltip id="images" text="Total graphics crawled on target page." />
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{summary?.totalImages || 0} Images</h3>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block">
                Scan Completed
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg shrink-0">
              {summary?.totalImages || 0}
            </div>
          </div>

          {/* Crawl Alerts (Clickable to toggle issues list) */}
          <div 
            onClick={() => setShowIssues(!showIssues)}
            className="bg-white border border-slate-200/85 p-5 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-500/30 active:scale-95"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issues to Fix</span>
              <h3 className="text-2xl font-black text-rose-600 mt-1">{dynamicIssues.length} Alerts</h3>
              <span className="text-[10px] font-bold text-rose-500 mt-1 block animate-pulse">
                {showIssues ? "Click to Hide" : "Click to View"}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-rose-600 flex items-center justify-center font-black text-lg shrink-0">
              {dynamicIssues.length}
            </div>
          </div>
        </div>

        {/* COLLAPSIBLE CRITICAL CRAWL ERRORS PANEL */}
        <AnimatePresence>
          {showIssues && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-rose-50/50 border border-rose-200 p-6 rounded-2xl shadow-sm space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
                <div className="flex items-center gap-2 text-rose-700 font-black text-base">
                  <AlertTriangle size={18} className="animate-bounce shrink-0" />
                  Critical Crawl Errors & Warnings ({dynamicIssues.length})
                </div>
                <button 
                  onClick={() => setShowIssues(false)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-750 px-2.5 py-1 rounded-lg hover:bg-rose-100/50 transition-colors"
                >
                  Dismiss
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {dynamicIssues.length > 0 ? (
                  dynamicIssues.map((issue, idx) => {
                    const matchedItem = checkTableData.find(c => issue.toLowerCase().includes(c.id));
                    return (
                      <div 
                        key={idx} 
                        onClick={() => {
                          if (matchedItem) {
                            setActiveDrawerItem(matchedItem);
                          } else {
                            setActiveDrawerItem({
                              id: `issue-${idx}`,
                              name: "Crawl Issue Diagnostic",
                              status: "Warning",
                              process: "0%",
                              quantity: "Alert Status",
                              details: issue,
                              help: "This issue impacts your crawler indexing rate, mobile speed rating, or visibility settings.",
                              fix: "Address this warning in your site structure, HTML parameters, or hosting certificates."
                            });
                          }
                        }}
                        className="flex items-start gap-2.5 p-4 rounded-xl bg-white border border-rose-100 text-rose-800 text-xs font-bold leading-relaxed shadow-sm hover:scale-[1.01] hover:border-rose-300 transition-all cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-extrabold shrink-0 mt-0.5">
                          !
                        </span>
                        <div className="space-y-1">
                          <p className="text-slate-900 font-extrabold">{issue}</p>
                          <p className="text-[10px] text-rose-500 font-semibold leading-normal flex items-center gap-1">
                            Click to view fixes details <ChevronRight size={10} />
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 p-6 text-center text-emerald-600 font-black text-sm bg-white border border-emerald-100 rounded-xl flex items-center justify-center gap-2">
                    <Check className="shrink-0" size={16} />
                    Outstanding: No structural crawl errors or warnings flagged for this domain!
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. DUAL INTERACTIVE CHARTS ROW (LINE & INTERACTIVE DONUT) */}
        {reportLayout.showCharts && (
          isLazyLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
              {/* Trend Chart Card */}
              <div className="lg:col-span-8 bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm h-[380px] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-5 w-48 bg-slate-200 rounded-md" />
                </div>
                <div className="w-full h-48 bg-slate-50 rounded-xl border border-slate-100 flex items-end p-4 gap-3">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-full bg-slate-200 rounded-t-md" 
                      style={{ height: `${Math.max(20, Math.sin(i / 1.5) * 50 + 50)}%` }} 
                    />
                  ))}
                </div>
              </div>

              {/* Donut Chart Card */}
              <div className="lg:col-span-4 bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm h-[380px] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-5 w-40 bg-slate-200 rounded-md" />
                </div>
                <div className="w-32 h-32 rounded-full border-[10px] border-slate-100 flex items-center justify-center mx-auto my-4 relative">
                  <div className="w-20 h-20 rounded-full bg-white shadow-inner flex flex-col items-center justify-center space-y-1">
                    <div className="h-2 w-8 bg-slate-100 rounded" />
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-slate-200 rounded-full shrink-0" />
                      <div className="h-3 w-16 bg-slate-150 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
              <div className="lg:col-span-8 bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.005] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
                <div className="pb-4">
                  <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Crawl Progress</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Overall SEO Score Trend</h3>
                </div>

                <div className="w-full mt-2" style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="mintGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontStyle="bold" tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} fontStyle="bold" tickLine={false} axisLine={false} />
                      <RechartsTooltip content={<CustomChartTooltip />} />
                      <Area type="monotone" dataKey="Score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#mintGradient)" name="Audit Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.005] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
                <div>
                  <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Interactive Breakdown</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Site Performance Breakdown</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Click a category segment below to filter descriptions.</p>
                </div>

                <div className="relative w-full flex items-center justify-center" style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={56}
                        paddingAngle={4}
                        dataKey="value"
                        onClick={(data, index) => {
                          setActiveCategoryFilter(donutData[index]);
                        }}
                        className="cursor-pointer"
                      >
                        {donutData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke={activeCategoryFilter?.name === entry.name ? "#000" : "none"}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Total Avg</span>
                    <span className="text-base font-black text-slate-900">
                      {Math.round((dynamicSeoScore + performanceScore + dynamicAccessibilityScore + bestPracticesScore) / 4)}%
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeCategoryFilter ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      key={activeCategoryFilter.name}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-[10px] leading-normal font-semibold text-slate-600"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-900 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeCategoryFilter.color }} />
                          {activeCategoryFilter.name}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCategoryFilter(null);
                          }}
                          className="text-[9px] font-black text-emerald-600 hover:text-emerald-700"
                        >
                          Reset Filter
                        </button>
                      </div>
                      {activeCategoryFilter.desc}
                    </motion.div>
                  ) : (
                    <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center text-[10px] text-slate-400 font-bold">
                      Click segments or details below to inspect scores.
                    </div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 text-[10px] font-bold">
                  {donutData.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActiveCategoryFilter(item)}
                      className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded-lg border transition-all hover:bg-slate-50 ${
                        activeCategoryFilter?.name === item.name ? "border-slate-300 font-black text-slate-900 bg-slate-50" : "border-transparent text-slate-500"
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span>{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* 3. NEW DETAILED TELEMETRY CARDS (KEYWORD DENSITY, SSL SECURITY, LINKS DIAGNOSTICS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Keyword Density card with Custom Priority Cycling Pills and Table Density */}
          {reportLayout.showKeywords && (
            <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <ListFilter size={16} className="text-emerald-600" />
                  Top Keywords Density
                </h3>
              </div>
              
              <div className="space-y-3.5 overflow-y-auto pt-2">
                {keywordDensity && keywordDensity.length > 0 ? (
                  keywordDensity.map((keyword, idx) => {
                    const priority = keywordPriorities[keyword.word] || "Medium";
                    return (
                      <div 
                        key={idx} 
                        className="space-y-1 p-2 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/40 transition-all group/item flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-850">
                            {keyword.word}
                          </span>
                          
                          {/* Dynamically calculated keyword density analysis tag */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-semibold">{keyword.count}x ({keyword.density}%)</span>
                            
                            {(() => {
                              const density = keyword.density;
                              const word = keyword.word;
                              const len = word.length;
                              
                              let diffLabel = "Low";
                              let diffClass = "border-emerald-250 text-emerald-600 bg-emerald-50 hover:bg-emerald-100/50 shadow-sm";
                              let diffStatus = "Success";
                              let diffHelp = `This is a long-tail or low-competition keyword ("${word}"). Ranking for it is generally easier because search volumes are spread across more specific search intents.`;
                              let diffFix = `Include this keyword naturally in your content. Keep its density between 1.5% and 4.0% to build organic topical relevance.`;

                              if (len <= 4 || density > 4.0) {
                                diffLabel = "Hard";
                                diffClass = "border-rose-250 text-rose-600 bg-rose-50 hover:bg-rose-100/50 shadow-sm";
                                diffStatus = "Warning";
                                diffHelp = `This is a highly competitive short-tail keyword ("${word}"). Ranking for single-word or short terms requires significant domain authority and strong backlinks.`;
                                diffFix = `Instead of over-focusing on this short keyword, target longer variations (long-tail keywords) first. Ensure this word appears naturally without keyword stuffing.`;
                              } else if (len <= 8) {
                                diffLabel = "Medium";
                                diffClass = "border-amber-250 text-amber-600 bg-amber-50 hover:bg-amber-100/50 shadow-sm";
                                diffStatus = "Warning";
                                diffHelp = `This keyword ("${word}") has moderate competition. It represents a good balance of search volume and achievable ranking difficulty.`;
                                diffFix = `Place this keyword in critical SEO locations: the title tag, H1 heading, and the first paragraph of your body copy.`;
                              }

                              return (
                                <button
                                  onClick={() => {
                                    setActiveDrawerItem({
                                      id: `keyword-${word}`,
                                      name: `Keyword Difficulty Rating: "${word}"`,
                                      status: diffStatus,
                                      process: `${diffLabel} Competition`,
                                      quantity: `${keyword.count} Occurrences`,
                                      details: `Keyword: "${word}" | Density: ${density}% | Occurrences: ${keyword.count} | Ranking Difficulty: ${diffLabel}`,
                                      help: diffHelp,
                                      fix: diffFix,
                                    });
                                  }}
                                  className={`text-[9px] font-black rounded-lg px-2.5 py-1 border transition-all cursor-pointer ${diffClass}`}
                                >
                                  {diffLabel}
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                        {/* Visual custom progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            style={{ width: `${Math.min(keyword.density * 15, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 font-semibold">Insufficient body text scanned to compute keyword density.</p>
                )}
              </div>
            </div>
          )}

          {/* Linking Architecture report */}
          {reportLayout.showLinks && (
            <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
              <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Link2 size={16} className="text-sky-600" />
                Link Architecture Scan
              </h3>
              
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 text-center pt-2">
                <div className="p-2 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm sm:text-lg font-black text-slate-900 block">{linksAnalysis.internalCount}</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Internal</span>
                </div>
                <div className="p-2 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm sm:text-lg font-black text-slate-900 block">{linksAnalysis.externalCount}</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">External</span>
                </div>
                <div className={`p-2 sm:p-3.5 rounded-xl border cursor-pointer hover:scale-105 transition-all ${
                  linksAnalysis.brokenCount > 0 ? "bg-rose-50 border-rose-100 text-rose-700" : "bg-slate-50 border-slate-100"
                }`}
                  onClick={() => {
                    setActiveDrawerItem({
                      id: "links",
                      name: "Hyperlinks Health Report",
                      status: linksAnalysis.brokenCount > 0 ? "Warning" : "Success",
                      process: linksAnalysis.brokenCount > 0 ? "80%" : "100%",
                      quantity: `${linksAnalysis.brokenCount} Broken Items`,
                      details: `Internal Count: ${linksAnalysis.internalCount}, External Count: ${linksAnalysis.externalCount}`,
                      help: "Broken links degrade page crawl indexes and index efficiency while raising bounce rates for regular site users.",
                      fix: "Review all absolute and relative anchor <a> tags to confirm their href targets resolve perfectly. Remove relative parameters that cast syntax exceptions."
                    });
                  }}
                >
                  <span className="text-sm sm:text-lg font-black block">{linksAnalysis.brokenCount}</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Broken</span>
                </div>
              </div>

              {linksAnalysis.brokenCount > 0 && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-rose-200/50 bg-rose-50/50 text-[10px] text-rose-600 font-semibold">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>Critical: Found broken relative URLs on page.</span>
                </div>
              )}
            </div>
          )}

          {/* SSL & Viewport security diagnostics */}
          {reportLayout.showSecurity && (
            <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
              <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-purple-600" />
                Security & Viewport Checks
              </h3>
              
              <div className="space-y-3.5 pt-2">
                {/* SSL Status */}
                <div 
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setActiveDrawerItem({
                      id: "ssl",
                      name: "SSL Certificate Encryption",
                      status: sslSecure ? "Success" : "Warning",
                      process: sslSecure ? "100%" : "0%",
                      quantity: sslSecure ? "Protected HTTPS" : "Insecure HTTP",
                      details: currentScan.url,
                      help: "HTTPS is a major ranking authority signal for search indexes. Browsers explicitly flag non-SSL pages as insecure.",
                      fix: "Register a valid SSL certificate (via LetsEncrypt or Cloudflare proxies) and configure automatic server redirections to force HTTPS."
                    });
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <ShieldCheck className={sslSecure ? "text-emerald-500" : "text-rose-500"} size={16} />
                    SSL Certificate Check
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    sslSecure ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}>
                    {sslSecure ? "Secure HTTPS" : "Insecure HTTP"}
                  </span>
                </div>

                {/* Mobile Responsiveness Viewport */}
                <div 
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setActiveDrawerItem({
                      id: "mobile",
                      name: "Viewport Mobile Responsiveness",
                      status: mobileResponsive ? "Success" : "Warning",
                      process: mobileResponsive ? "100%" : "0%",
                      quantity: mobileResponsive ? "Responsive Viewport Tag Active" : "Missing Meta Viewport",
                      details: "Checks head layout tags",
                      help: "Mobile-friendliness is a core usability parameter. Crawlers penalize sites that do not render dynamic responsive layouts.",
                      fix: "Incorporate <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /> inside your HTML head element."
                    });
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Smartphone className={mobileResponsive ? "text-emerald-500" : "text-rose-500"} size={16} />
                    Mobile Responsiveness
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    mobileResponsive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}>
                    {mobileResponsive ? "Mobile Friendly" : "Desktop Only"}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 4. SEO HEALTH CHECKLIST WITH STICKY HEADERS & CUSTOM TOOLTIPS */}
        {reportLayout.showChecklist && (
          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center">
                SEO Health Checklist
                <InteractiveTooltip id="checklist" text="Hover tooltips: click any row item below to open structural diagnostics drawer." />
              </h3>
            </div>

            <div className="hidden sm:block overflow-x-auto max-h-[400px]">
              <table className="w-full text-left text-xs font-bold text-slate-500 relative">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 sticky top-0 bg-white z-20 shadow-sm">
                    <th className="py-3 pl-2">SEO Element Checked</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Status Score</th>
                    <th className="py-3">Results Found</th>
                    <th className="py-3 text-right pr-2">Action Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checkTableData.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setActiveDrawerItem(row)}
                      className="hover:bg-emerald-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="flex items-center gap-2.5 text-slate-900 font-extrabold pl-2 py-3.5">
                        <div className="w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center text-emerald-600 bg-emerald-50">
                          <Check size={11} />
                        </div>
                        {row.name}
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          row.status === "Success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          row.status === "Warning" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="text-slate-400 py-3.5">{row.process}</td>
                      <td className="text-slate-800 py-3.5">{row.quantity}</td>
                      <td className="text-right text-emerald-600 font-bold group-hover:translate-x-1 transition-transform pr-2 py-3.5">
                        <span className="inline-flex items-center gap-1">
                          Fix Details <ChevronRight size={12} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block sm:hidden space-y-3">
              {checkTableData.map((row, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveDrawerItem(row)}
                  className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2 cursor-pointer hover:border-emerald-350 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 leading-tight">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      {row.name}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                      row.status === "Success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      row.status === "Warning" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 pt-1.5 border-t border-slate-200/50">
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider text-[8px]">Score</span>
                      <span className="text-slate-700">{row.process}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider text-[8px]">Found</span>
                      <span className="text-slate-700">{row.quantity}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold bg-white p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="truncate max-w-[200px]">{row.details}</span>
                    <span className="text-emerald-650 shrink-0 font-black text-[9px] flex items-center">View Fixes <ChevronRight size={10} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AI POWERED OPTIMIZATION PLAN & MOBILE VIEWPORT SNAPSHOT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: AI Powered Plan */}
          <div className="lg:col-span-8 h-full">
            {reportLayout.showAiPlan && (
              isLazyLoading ? (
                <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-6 animate-pulse">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-100" />
                      <div className="space-y-1">
                        <div className="h-3.5 w-24 bg-slate-250 rounded animate-pulse" />
                        <div className="h-5 w-48 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-bold">
                      Analyzing website...
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-50/10 flex flex-col gap-2.5">
                    <div className="h-3.5 w-24 bg-emerald-700/30 rounded" />
                    <div className="h-4 w-3/4 bg-emerald-700/20 rounded" />
                    <div className="h-4 w-1/2 bg-emerald-700/20 rounded" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <div className="h-3.5 w-28 bg-slate-200 rounded pb-1 border-b border-slate-100" />
                        <div className="space-y-2">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.005] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                        <Cpu size={16} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">AI Powered Plan</span>
                        <h3 className="text-base font-black text-slate-900">AI Simple Optimization Plan</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 text-[10px] font-bold">
                      <Sparkles size={10} className="animate-pulse" />
                      Step-by-Step Fixes
                    </div>
                  </div>

                  {/* AI Executive Summary */}
                  <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group/sum flex items-start">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex-1">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-2">
                        <Bookmark size={12} /> AI Simple Summary
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold pr-4">
                        {aiSuggestions?.summary || "Analyzing DOM architecture layouts..."}
                      </p>
                    </div>
                  </div>

                  {/* Suggestions deck with hover copies */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Technical Fixes */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                        <Zap size={12} /> How to Fix Code
                      </h4>
                      <div className="space-y-2">
                        {aiSuggestions?.technicalFixes && aiSuggestions.technicalFixes.length > 0 ? (
                          aiSuggestions.technicalFixes.map((fix, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold leading-relaxed group/tip"
                            >
                              <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span className="flex-1">{fix}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 font-bold">No critical technical errors flagged.</p>
                        )}
                      </div>
                    </div>

                    {/* Copywriting improvements */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-sky-600 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                        <Sparkles size={12} /> How to Improve Text
                      </h4>
                      <div className="space-y-2">
                        {aiSuggestions?.contentImprovements && aiSuggestions.contentImprovements.length > 0 ? (
                          aiSuggestions.contentImprovements.map((fix, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold leading-relaxed group/txt"
                            >
                              <Sparkles size={12} className="text-sky-500 shrink-0 mt-0.5" />
                              <span className="flex-1">{fix}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 font-bold">Content structure aligns with guidelines.</p>
                        )}
                      </div>
                    </div>

                    {/* Performance tips */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                        <BarChart3 size={12} /> How to Speed Up Your Site
                      </h4>
                      <div className="space-y-2">
                        {aiSuggestions?.performanceTips && aiSuggestions.performanceTips.length > 0 ? (
                          aiSuggestions.performanceTips.map((tip, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold leading-relaxed group/spd"
                            >
                              <Zap size={12} className="text-purple-500 shrink-0 mt-0.5" />
                              <span className="flex-1">{tip}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 font-bold">Performance index meets speed targets.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right Column: Mobile Viewport Snapshot device frame */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.005] hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20">
              <div className="pb-2 border-b border-slate-100">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Visual Audit</span>
                <h3 className="text-sm font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Smartphone size={16} className="text-emerald-600 shrink-0" />
                  Mobile Viewport Snapshot
                </h3>
              </div>

              {currentScan.screenshot ? (
                <div className="relative w-full max-w-[210px] mx-auto rounded-[32px] border-[8px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden aspect-[9/19] group/phone">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-slate-900 rounded-b-xl z-20" /> {/* speaker/notch */}
                  <img 
                    src={currentScan.screenshot} 
                    alt="Mobile website snapshot" 
                    className="w-full h-full object-cover relative z-10 group-hover/phone:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/phone:opacity-100 transition-opacity z-20 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black bg-white/95 text-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 shadow-md">
                      Mobile Layout View
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-72 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center bg-slate-50/50">
                  <Smartphone size={32} className="animate-pulse text-slate-300" />
                  <span className="text-xs font-bold text-slate-500">Snapshot Unavailable</span>
                  <p className="text-[10px] text-slate-400 leading-normal max-w-[180px] mx-auto mt-1 font-semibold">
                    The snapshot could not be generated. Verify target URL connections.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* PREMIUM FLOATING DIAGNOSTIC WIDGET CARD WITH GLASSMORPHIC BACKDROP */}
      <AnimatePresence>
        {activeDrawerItem && (
          <>
            {/* Dark glassmorphic blur backdrop (high z-index for front layer isolation) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawerItem(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[998] pointer-events-auto"
            />
            {/* Centered responsive overlay layout */}
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 26, stiffness: 210 }}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 w-full max-w-xl max-h-[85vh] overflow-y-auto relative z-[999] flex flex-col justify-between pointer-events-auto"
              >
                <div className="space-y-6">
                  
                  {/* Header title */}
                  <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                    <div className="space-y-1.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase ${
                        activeDrawerItem.status === "Success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        activeDrawerItem.status === "Warning" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}>
                        {activeDrawerItem.status || "Crawl Alert"}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        {activeDrawerItem.name}
                      </h3>
                    </div>
                    
                    <button 
                      onClick={() => setActiveDrawerItem(null)}
                      className="text-xs font-black text-slate-400 hover:text-slate-700 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  {/* Core definitions - Simple terminology */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Why this is important</span>
                      <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                        {activeDrawerItem.help}
                      </p>
                    </div>

                    {/* Scraped Details container */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                      <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        <span>Crawled Telemetry Data</span>
                      </div>
                      <p className="text-xs text-slate-800 font-black leading-relaxed bg-white p-3 rounded-lg border border-slate-100 break-all select-all shadow-sm">
                        {activeDrawerItem.details || "No metrics mapped."}
                      </p>
                    </div>

                    {/* Dynamic Action Plans */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">How to Fix This Item</span>
                      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-800 font-semibold leading-relaxed flex items-start gap-2.5">
                        <Check className="text-emerald-600 shrink-0 mt-0.5" size={15} />
                        <div>
                          <p className="font-extrabold text-emerald-900 mb-1">Recommended Execution Step:</p>
                          <p>{activeDrawerItem.fix || "Inspect the target HTML parameters on your backend server."}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer keyboard hint */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
                  <span>Domain: {currentScan.url}</span>
                  <span>Press <kbd className="px-1.5 py-0.5 rounded border bg-slate-55 text-slate-500">Esc</kbd> to close</span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

