# AI Resume Builder

A production-ready, AI-powered resume optimization platform built with React, Firebase, and Google's Gemini API. Get instant ATS scores, personalized improvement suggestions, and job opportunity recommendations.

## Features

✨ **Core Features**
- 🔐 Google Authentication with Firebase
- 📄 Resume PDF upload with validation
- 🤖 AI-powered resume analysis using Gemini API
- 📊 Real-time ATS score calculation
- 💡 Smart improvement suggestions
- 💼 Job opportunity recommendations
- 📈 Analysis history and persistence
- 🎨 Modern, responsive UI with glassmorphism

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **React Dropzone** - File uploads
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend & Services
- **Firebase Authentication** - Google sign-in
- **Firebase Firestore** - Database and resume text storage
- **OpenAI API** - AI analysis with GPT models

### Additional Libraries
- **pdfjs-dist** - PDF text extraction
- **React Circular Progressbar** - ATS score visualization
- **React Hot Toast** - Notifications
- **Recharts** - Charts (optional)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── UploadBox.tsx
│   ├── ATSGauge.tsx
│   ├── AnalysisCard.tsx
│   ├── JobCard.tsx
│   └── Loader.tsx
├── pages/              # Page components
│   ├── Landing.tsx
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   └── AnalysisResults.tsx
├── services/           # Business logic
│   ├── firebase.ts     # Firebase config and functions
│   ├── geminiService.ts # Gemini API integration
│   └── pdfService.ts   # PDF extraction
├── context/            # React context
│   └── AuthContext.tsx
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase project with Web SDK configured
- Google Gemini API key
- Google OAuth credentials

### 1. Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd ai-resume-builder

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication → Google Sign-In
4. Create a Firestore Database
5. Copy credentials to `.env.local`

### 4. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env.local`

### 5. Firestore Security Rules

Update your Firestore rules in the Firebase Console:

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

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`

## Usage Flow

1. **Landing Page** → View features and benefits
2. **Sign In** → Google authentication
3. **Dashboard** → Upload resume, enter job details
4. **Analysis** → AI analyzes resume and provides scores/suggestions
5. **Results** → View detailed analysis with actionable insights

## Key Components

### UploadBox
Drag-and-drop resume upload with validation
- Accepts PDF files only
- Max 5MB file size
- Real-time error feedback

### ATSGauge
Circular progress indicator for ATS score
- Red: Poor (0-40)
- Yellow: Average (40-70)
- Green: Excellent (70-100)

### AnalysisCard
Expandable card for organized result display
- Strengths
- Weaknesses
- Keywords
- Skills
- Interview tips

### JobCard
Display matched job opportunities
- Match percentage
- Job title
- Why it matches

## API Integration

### Gemini Analysis Prompt

The service dynamically generates prompts including:
- Target job title
- Target companies
- Candidate experience
- Resume content

Returns structured JSON with:
- ATS score
- Strengths and weaknesses
- Missing keywords
- Formatting suggestions
- Skill recommendations
- Similar job opportunities
- Interview tips

## Error Handling

- PDF validation and size limits
- Firebase authentication errors
- Gemini API rate limiting
- Network timeouts
- Graceful fallbacks with user notifications

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- Debounced input fields
- Memoized components
- Image optimization
- Tailwind CSS tree-shaking

## Future Enhancements

- [ ] Resume versioning
- [ ] AI-generated resume rewriting
- [ ] PDF export of analysis
- [ ] Job board integration
- [ ] Resume templates
- [ ] Cover letter generator
- [ ] Interview preparation chatbot
- [ ] Skill assessment tests
- [ ] Dark mode toggle
- [ ] Mobile app

## Deployment

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
# Deploy directly
vercel
```

## Security Best Practices

- ✅ Firebase Authentication for secure login
- ✅ Firestore security rules for data protection
- ✅ Environment variables for sensitive keys
- ✅ PDF validation before processing
- ✅ HTTPS only communication
- ✅ User data encryption in Firestore

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@airesume.com

## Acknowledgments

- Google Gemini API for AI capabilities
- Firebase for backend services
- React ecosystem
- Tailwind CSS community

---

**Built with ❤️ to help job seekers land their dream roles**
