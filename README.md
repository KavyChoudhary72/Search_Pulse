# Search Pulse - Advanced AI SEO & Page Speed Analyser

Search Pulse is a next-generation web application designed to audit websites for SEO optimization, measure Page Speed performance metrics (Core Web Vitals), scan for broken links, and generate AI-powered optimization guidelines.

The project uses a secure React + Zustand frontend and an Express + Node.js backend.

---

## 🚀 Key Features

1. **Two-Stage Analysis Pipeline**:
   - **Stage 1 (Local Scraper)**: Fetches and parses target HTML using `axios` and `cheerio` in under **1.1 seconds** for instant visual feedback.
   - **Stage 2 (Lighthouse + AI)**: Measures performance metrics (FCP, LCP, CLS) using Puppeteer/Lighthouse and queries the Gemini Pro AI model for structural advice in the background, resolving within 15–20 seconds.
2. **SEO Audits**: Crawls header structure hierarchy (`h1`–`h6`), counts keywords, analyzes title/meta tag lengths, and identifies image `alt` tag deficiencies.
3. **Broken Link Scanner**: Identifies internal and external hyperlinks returning non-200 HTTP status codes.
4. **Secure User Accounts**: JWT-based session authorization, salted password hashing (`bcryptjs`), and brute-force login rate limiting.
5. **PDF Export Report**: Generates structured, download-ready PDF summaries of the analysis scores and recommendations.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite, TailwindCSS, Framer Motion, Zustand, Recharts, Lucide Icons)
- **Backend**: Node.js, Express, MongoDB (Mongoose), Puppeteer, Cheerio, PDFKit, Google Gemini Pro API

---

## 📁 Directory Structure

```text
seo-analyser/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # UI components (Navbar, Diagnostic drawer)
│   │   ├── pages/          # Home, Dashboard, History, Login, Signup
│   │   ├── store/          # Zustand state stores (authStore, useSeoStore)
│   │   └── App.jsx         # App router and page animations
│   ├── package.json        # Frontend scripts and packages
│   └── vite.config.js      # Rollup bundle-splitting configuration
├── server/                 # Express Backend Server API
│   ├── src/
│   │   ├── config/         # DB & Environment validation
│   │   ├── controllers/    # API routes controllers (Auth, Scans, Reports)
│   │   ├── middleware/     # JWT protection, brute-force rate limiter
│   │   ├── models/         # Mongoose User and Scan schemas
│   │   ├── services/       # Scraper, AI generators, Puppeteer snapshot service
│   │   └── server.js       # App entry point
│   ├── package.json        # Backend scripts and dependencies
│   └── .env.example        # Environment variables template
└── .gitignore              # Root Git ignore rules (protects credentials)
```

---

## 🔒 Security Best Practices & Setup

### 1. Root-Level Protection
A master `.gitignore` is established at the root level to prevent accidental commits of local credentials:
- **Never commit `.env` files** containing secret database strings or API keys to public repositories.
- **Node Modules** are ignored recursively to keep the repository lightweight.

### 2. Backend Environment Variables
Create a file named `.env` in the `server/` directory and populate it with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key_secret
GEMINI_API_KEY=your_google_gemini_pro_key
```

### 3. Frontend Configuration
For development, the client connects to `http://localhost:5000` by default. For production deployment, set the API target using the environment variable:
```env
VITE_API_URL=https://your-production-server-domain.com
```

---

## ⚙️ Installation & Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance

### Step 1: Clone and Initialize Git
```bash
git init
git add .
git commit -m "Initial commit: AI SEO Analyser Platform"
```

### Step 2: Install Dependencies
Open two terminals to run both components:

**Terminal 1 (Backend Server)**:
```bash
cd server
npm install
npm run dev
```

**Terminal 2 (Frontend Client)**:
```bash
cd client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` (or `http://localhost:5174`).

---

## ⚡ Production Optimizations
- **Compression**: Implements Gzip response compression using `compression` middleware to reduce payload transit times.
- **Helmet Headers**: Secures server headers against scripting and sniffing attacks.
- **Code Splitting**: Splitting the frontend bundle into custom, parallel-cacheable chunks (e.g. charts, vendor libraries, icons) for optimized initial loading.
- **Singleton Browser Pattern**: Reuses a single headless Puppeteer process instance in memory to speed up scans by eliminating Chrome boot-up latency.
