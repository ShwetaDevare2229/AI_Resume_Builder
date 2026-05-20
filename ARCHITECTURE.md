# AI Resume Builder - Architecture & Technology Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │           React Application (Vite)               │   │
│  ├──────────────────────────────────────────────────┤   │
│  │                                                  │   │
│  │  Landing → Auth → Dashboard → Results           │   │
│  │     ↓        ↓        ↓          ↓               │   │
│  │  [Hero]  [OAuth]  [Upload]  [Analysis]          │   │
│  │                                                  │   │
│  │  Components: Navbar, UploadBox, ATSGauge,      │   │
│  │             AnalysisCard, JobCard               │   │
│  │                                                  │   │
│  └────────────────┬─────────────────────────────────┘   │
│                   │                                      │
│         ┌─────────┴──────────┬────────────┐              │
│         │                    │            │              │
└─────────┼────────────────────┼────────────┼──────────────┘
          │                    │            │
          ↓                    ↓            ↓
    ┌──────────┐      ┌──────────────┐  ┌──────────┐
    │ Firebase │      │ Google       │  │ PDF      │
    │ Auth     │      │ Gemini API   │  │ Processing
    │ (OAuth2) │      │ (AI Analysis)│  │ (pdfjs)  │
    └──────────┘      └──────────────┘  └──────────┘
          │                    │
    ┌─────┴────────────────────┴────────┐
    │                                    │
    ↓                                    ↓
┌─────────────────┐        ┌────────────────────┐
│  Firebase       │        │ Google AI Service  │
│  (Backend)      │        │ (Gemini)           │
├─────────────────┤        ├────────────────────┤
│ ✓ Auth          │        │ ✓ Text Analysis    │
│ ✓ Firestore DB  │        │ ✓ ATS Scoring      │
│ ✓ Storage       │        │ ✓ Recommendations  │
│ ✓ Hosting       │        │ ✓ Job Matching     │
└─────────────────┘        └────────────────────┘
```

---

## Component Hierarchy

```
App (Routes)
│
├── Landing
│   └── Navbar
│
├── Auth
│   ├── Navbar
│   └── SignIn Form
│
├── Dashboard
│   ├── Navbar
│   ├── UploadBox
│   ├── FormInputs
│   │   ├── JobTitle
│   │   ├── Companies
│   │   └── ExperienceLevel
│   └── Sidebar Tips
│
└── AnalysisResults
    ├── Navbar
    ├── ATSGauge (Score Visualization)
    ├── AnalysisCard (Strengths)
    ├── AnalysisCard (Weaknesses)
    ├── AnalysisCard (Keywords)
    ├── AnalysisCard (Skills)
    ├── AnalysisCard (Tips)
    ├── JobCard (Similar Jobs)
    └── Export/Share Controls
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│ USER UPLOADS RESUME (PDF FILE)                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ VALIDATION LAYER                                        │
│ ├─ Check file type (PDF only)                          │
│ └─ Check file size (max 5MB)                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ FIREBASE UPLOAD                                         │
│ └─ Store in: resumes/{userId}/{timestamp}_{filename}   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ PDF TEXT EXTRACTION (pdfjs-dist)                       │
│ ├─ Parse PDF file                                      │
│ ├─ Extract text from each page                         │
│ └─ Combine into single text string                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ DYNAMIC PROMPT GENERATION                              │
│ ├─ Job Title: "Frontend Developer"                     │
│ ├─ Companies: "Google, Microsoft, Amazon"              │
│ ├─ Experience: "3-5 years"                             │
│ ├─ Resume Text: [extracted text]                       │
│ └─ Generate comprehensive AI prompt                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ GEMINI API CALL                                         │
│ ├─ Endpoint: generativelanguage.googleapis.com         │
│ ├─ Model: gemini-1.5-pro                               │
│ ├─ Input: Dynamic prompt with resume context           │
│ └─ Output: Structured JSON response                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ RESPONSE PARSING                                        │
│ ├─ Extract JSON from response                          │
│ ├─ Parse structured data                               │
│ ├─ Validate all required fields                        │
│ └─ Convert to TypeScript types                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ FIRESTORE PERSISTENCE                                  │
│ └─ Save analysis to: users/{uid}/analyses/{id}         │
│    ├─ jobTitle, companies, experience                  │
│    ├─ atsScore, summary, strengths/weaknesses          │
│    ├─ keywords, skills, jobs, tips                     │
│    ├─ resumeUrl (Firebase Storage link)                │
│    └─ createdAt timestamp                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ RESULTS DISPLAY                                         │
│ ├─ Fetch analysis from Firestore                       │
│ ├─ Render ATSGauge with score                          │
│ ├─ Display AnalysisCards (expandable)                  │
│ ├─ Show JobCards for opportunities                     │
│ └─ Provide export/share options                        │
└─────────────────────────────────────────────────────────┘
```

---

## Service Layer Architecture

```
┌──────────────────────────────────────────────────┐
│          APPLICATION LOGIC LAYER                 │
│                                                  │
│  Pages → Components → State → Services           │
└────────────────┬─────────────────────────────────┘
                 │
        ┌────────┼────────┐
        ↓        ↓        ↓
    ┌────────────────────────────────────────────┐
    │     SERVICE LAYER (Business Logic)        │
    ├────────────────────────────────────────────┤
    │                                            │
    │  ┌──────────────────────────────────────┐ │
    │  │ firebase.ts (Authentication)        │ │
    │  ├──────────────────────────────────────┤ │
    │  │ • signInWithGoogle()                 │ │
    │  │ • signOutUser()                      │ │
    │  │ • uploadResume()                     │ │
    │  │ • saveAnalysis()                     │ │
    │  │ • onAuthStateChange()                │ │
    │  └──────────────────────────────────────┘ │
    │                                            │
    │  ┌──────────────────────────────────────┐ │
    │  │ geminiService.ts (AI Analysis)       │ │
    │  ├──────────────────────────────────────┤ │
    │  │ • generatePrompt()                   │ │
    │  │ • analyzeResume()                    │ │
    │  │ • parseGeminiResponse()              │ │
    │  │ • handleErrors()                     │ │
    │  └──────────────────────────────────────┘ │
    │                                            │
    │  ┌──────────────────────────────────────┐ │
    │  │ pdfService.ts (PDF Handling)         │ │
    │  ├──────────────────────────────────────┤ │
    │  │ • extractTextFromPDF()               │ │
    │  │ • validatePDF()                      │ │
    │  │ • handlePageExtraction()             │ │
    │  └──────────────────────────────────────┘ │
    │                                            │
    └────────────────┬─────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    ┌────────┐  ┌──────────┐  ┌──────────┐
    │Firebase│  │ Gemini   │  │  pdfjs   │
    │ SDK    │  │   API    │  │  library │
    └────────┘  └──────────┘  └──────────┘
```

---

## State Management Flow

```
AuthContext (Global State)
│
├─ user (User | null)
│   ├─ uid
│   ├─ email
│   ├─ displayName
│   └─ photoURL
│
├─ loading (boolean)
│
└─ error (string | null)


Component State (Local)
├─ Dashboard
│   ├─ file (File | null)
│   ├─ jobTitle (string)
│   ├─ companies (string)
│   ├─ experience (string)
│   ├─ loading (boolean)
│   └─ analyzing (boolean)
│
├─ AnalysisResults
│   ├─ analysis (Analysis object)
│   └─ loading (boolean)
│
└─ Other components
    ├─ mobileMenuOpen (Navbar)
    └─ expanded (AnalysisCard)
```

---

## Authentication Flow

```
┌─────────────────┐
│  User clicks    │
│ "Sign in"       │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│ Google OAuth Flow                       │
│ (Browser opens Google auth page)        │
└────────┬────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│ User enters credentials                 │
└────────┬────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│ Google returns auth token               │
└────────┬────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ Firebase receives token                 │
└────────┬─────────────────────────────────┘
         │
         ↓
┌───────────────────────────────────────────┐
│ Save user to Firestore                  │
│ users/{uid} → {name, email, photo, etc} │
└────────┬────────────────────────────────┘
         │
         ↓
┌───────────────────────────────────────────┐
│ AuthContext updates global state         │
│ (user is set, loading = false)           │
└────────┬────────────────────────────────┘
         │
         ↓
┌───────────────────────────────────────────┐
│ ProtectedRoute allows navigation          │
│ User redirected to /dashboard             │
└───────────────────────────────────────────┘
```

---

## Directory Tree (Complete)

```
ai-resume-builder/
│
├── src/
│   ├── components/
│   │   ├── AnalysisCard.tsx        (Expandable result card)
│   │   ├── ATSGauge.tsx            (Score visualization)
│   │   ├── JobCard.tsx             (Job opportunity display)
│   │   ├── Loader.tsx              (Loading spinner)
│   │   ├── Navbar.tsx              (Navigation & user menu)
│   │   ├── ProtectedRoute.tsx       (Auth guard)
│   │   └── UploadBox.tsx            (Drag-drop upload)
│   │
│   ├── pages/
│   │   ├── AnalysisResults.tsx      (Results display page)
│   │   ├── Auth.tsx                 (Google sign-in page)
│   │   ├── Dashboard.tsx            (Upload & analysis form)
│   │   └── Landing.tsx              (Home page)
│   │
│   ├── services/
│   │   ├── firebase.ts              (Firebase config & functions)
│   │   ├── geminiService.ts         (Gemini API integration)
│   │   └── pdfService.ts            (PDF extraction)
│   │
│   ├── context/
│   │   └── AuthContext.tsx          (Auth state provider)
│   │
│   ├── App.tsx                      (Main router component)
│   ├── main.tsx                     (React entry point)
│   └── index.css                    (Global styles)
│
├── .env.example                     (Environment template)
├── .env.local                       (Your secrets - git ignored)
├── .gitignore                       (Git ignore patterns)
├── index.html                       (HTML entry point)
├── package.json                     (Dependencies & scripts)
├── postcss.config.js                (PostCSS configuration)
├── tailwind.config.js               (Tailwind CSS theme)
├── tsconfig.json                    (TypeScript config)
├── tsconfig.node.json               (TypeScript Node config)
├── vite.config.ts                   (Vite configuration)
│
├── .github/
│   └── copilot-instructions.md      (Project checklist)
│
├── README.md                        (Full documentation)
├── SETUP_GUIDE.md                   (Step-by-step setup)
├── PROJECT_SUMMARY.md               (Feature overview)
└── QUICK_REFERENCE.md               (This quick guide)
```

---

## Technology Stack Visualization

```
                    ┌─────────────────┐
                    │  TypeScript     │
                    │  (Type Safety)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ↓                    ↓                    ↓
    ┌─────────┐         ┌──────────┐        ┌──────────┐
    │  React  │         │ Tailwind │        │ Framer   │
    │   18    │         │   CSS    │        │ Motion  │
    └────┬────┘         └──────────┘        └──────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ↓                             ↓
┌──────────┐                 ┌────────────┐
│   Vite   │                 │   React    │
│  (Build) │                 │  Router    │
└──────────┘                 │  (Routing) │
                             └────────────┘
         │                          │
         └──────────┬───────────────┘
                    ↓
            ┌──────────────────┐
            │ Your App Logic   │
            └────────┬─────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    ┌────────┐  ┌──────────┐  ┌──────────┐
    │Firebase│  │ Gemini   │  │  pdfjs   │
    │        │  │   API    │  │          │
    └────────┘  └──────────┘  └──────────┘
```

---

## Build & Deployment Pipeline

```
Source Code (TypeScript, JSX)
         │
         ↓
    ┌─────────────┐
    │ Vite Build  │
    │ - Compile   │
    │ - Bundle    │
    │ - Minify    │
    └──────┬──────┘
           │
           ↓
    ┌─────────────┐
    │ Tailwind    │
    │ - Tree-shake│
    │ - Purge CSS │
    └──────┬──────┘
           │
           ↓
    ┌─────────────────────────────┐
    │ dist/ folder (Production)   │
    │ - index.html                │
    │ - app.js (minified)         │
    │ - styles.css (optimized)    │
    │ - assets/                   │
    └──────┬──────────────────────┘
           │
    ┌──────┴──────────────────────┐
    │                             │
    ↓                             ↓
┌──────────────┐            ┌───────────┐
│   Firebase   │            │ Vercel /  │
│   Hosting    │            │ Netlify   │
└──────────────┘            └───────────┘
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────┐
│ Code Splitting (Vite)                           │
│ ├─ Landing page chunk                          │
│ ├─ Dashboard page chunk                        │
│ ├─ Results page chunk                          │
│ └─ Lazy loaded on demand                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Tree-Shaking (Vite + Tailwind)                 │
│ ├─ Remove unused CSS classes                   │
│ ├─ Remove unused imports                       │
│ └─ Optimize bundle size                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Caching Strategy                                │
│ ├─ Firebase: Session persistence               │
│ ├─ Browser: Local storage for auth             │
│ └─ CDN: Static assets cached                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Image & File Optimization                       │
│ ├─ Responsive images                           │
│ ├─ WebP format support                         │
│ └─ Lazy loading                                │
└─────────────────────────────────────────────────┘
```

---

This architecture is:
- ✅ **Scalable**: Easy to add new features
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Performant**: Optimized for speed
- ✅ **Secure**: Best practices implemented
- ✅ **Type-Safe**: Full TypeScript coverage
