# AI Resume Builder - Complete Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd c:\Users\mrunm\Roshan
npm install
```

### Step 2: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project" and follow the setup wizard
3. Enable Google Authentication:
   - Go to Authentication → Sign-in method
   - Enable Google
   - Add your app domain to authorized domains
4. Create Firestore Database:
   - Go to Firestore Database → Create database
   - Start in **test mode** for development

### Step 3: Get API Keys

**From Firebase Console:**
- Go to Project Settings (gear icon) → General
- Scroll to "Your apps" section
- Find your web app config
- Copy all values

**OpenAI API Key:**
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Click "Create new secret key"
- Copy your API key

### Step 4: Create `.env.local` File

Create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Step 5: Update Firebase Security Rules

**Firestore Rules:**

1. Go to Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      match /analyses/{document=**} {
        allow read, write: if request.auth.uid == uid;
      }
    }
  }
}
```

### Step 6: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📁 Project Structure

```
ai-resume-builder/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── UploadBox.tsx    # Resume upload
│   │   ├── ATSGauge.tsx     # Score visualization
│   │   ├── AnalysisCard.tsx # Result cards
│   │   ├── JobCard.tsx      # Job display
│   │   ├── ProtectedRoute.tsx # Auth guard
│   │   └── Loader.tsx       # Loading state
│   ├── pages/               # Page components
│   │   ├── Landing.tsx      # Home page
│   │   ├── Auth.tsx         # Sign-in page
│   │   ├── Dashboard.tsx    # Upload & analysis
│   │   └── AnalysisResults.tsx # Results page
│   ├── services/            # Business logic
│   │   ├── firebase.ts      # Firebase config & auth
│   │   ├── geminiService.ts # AI analysis
│   │   └── pdfService.ts    # PDF handling
│   ├── context/             # React context
│   │   └── AuthContext.tsx  # Auth state
│   ├── App.tsx             # Main component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .env.example            # Environment template
├── .env.local              # Your env vars (git ignored)
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── package.json            # Dependencies
└── README.md               # Documentation
```

---

## 🔑 Environment Variables Explained

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Firebase Console → Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Firebase Console → Settings |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Firebase Console → Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID | Firebase Console → Settings |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Firebase Console → Settings |
| `VITE_OPENAI_API_KEY` | OpenAI API key | [OpenAI Platform](https://platform.openai.com/api-keys) |

---

## 🧪 Testing the Application

### Manual Testing Flow

1. **Sign Up**
   - Click "Sign In" button
   - Select Google account
   - Should redirect to dashboard

2. **Upload Resume**
   - On dashboard, drag & drop PDF file
   - Fill in job title (e.g., "Frontend Developer")
   - Enter target companies (e.g., "Google, Microsoft")
   - Select experience level
   - Click "Analyze Resume"

3. **View Results**
   - Should see ATS score with gauge
   - Strengths and weaknesses
   - Missing keywords
   - Similar job opportunities
   - Interview tips

4. **Sign Out**
   - Click user menu in navbar
   - Click "Logout"
   - Should redirect to home page

---

## 🐛 Troubleshooting

### Dependencies Won't Install

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rmdir /s node_modules

# Reinstall
npm install
```

### Firebase Connection Error

- Check `.env.local` has correct values
- Verify Firebase project exists
- Check internet connection
- Restart dev server: `npm run dev`

### Gemini API Not Working

- Verify API key in `.env.local`
- Check API is enabled in Google Cloud Console
- Ensure no quota limits exceeded
- Try with simple test prompt

### PDF Upload Fails

- Ensure file is valid PDF
- File size under 5MB
- Check browser console for errors
- Verify Firebase Storage rules

### Vite Build Fails

```bash
# Clear vite cache
rmdir /s .vite

# Rebuild
npm run build
```

---

## 📦 Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview

# Check build output in dist/ folder
```

---

## 🚀 Deployment Options

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
npm run build
firebase deploy
```

### Vercel

```bash
# Connect to Vercel
vercel

# Follow prompts to deploy
```

### Other Platforms

- **Netlify**: Connect GitHub repo
- **AWS Amplify**: Use AWS console
- **Azure Static Web Apps**: Use Azure portal

---

## 📚 Important Files & What They Do

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main routing and app structure |
| `src/main.tsx` | React entry point |
| `src/context/AuthContext.tsx` | Authentication state management |
| `src/services/firebase.ts` | Firebase initialization & operations |
| `src/services/geminiService.ts` | AI analysis engine |
| `src/services/pdfService.ts` | PDF text extraction |
| `src/pages/Landing.tsx` | Home page with features |
| `src/pages/Auth.tsx` | Google sign-in page |
| `src/pages/Dashboard.tsx` | Resume upload & analysis form |
| `src/pages/AnalysisResults.tsx` | Results display |

---

## 💡 Features Included

✅ **Implemented**
- Google Authentication
- Resume PDF upload & validation
- PDF text extraction
- Gemini AI analysis
- Real-time ATS score
- Firebase Firestore persistence
- Analysis history
- Mobile responsive design
- Glassmorphism UI
- Smooth animations

🔜 **Coming Soon**
- Resume templates
- Cover letter generator
- Interview preparation
- Job board integration
- Dark mode
- Export to PDF
- Resume versioning

---

## 📞 Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Gemini API Docs**: https://ai.google.dev/
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Vite Guide**: https://vitejs.dev/guide/

---

## ✨ Next Steps

1. ✅ Follow this setup guide
2. ✅ Configure Firebase and Gemini
3. ✅ Run `npm install && npm run dev`
4. ✅ Test the application
5. ⬜ Deploy to production
6. ⬜ Share with friends & get feedback
7. ⬜ Add more features

---

**Happy building! 🎉**
