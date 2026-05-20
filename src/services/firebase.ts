import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Save user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    }, { merge: true })
    
    return user
  } catch (error) {
    console.error('Google sign-in error:', error)
    throw error
  }
}

export async function signOutUser() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Sign-out error:', error)
    throw error
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}



export async function saveAnalysis(userId: string, analysisData: any) {
  try {
    const analysisRef = doc(db, 'users', userId, 'analyses', analysisData.id)
    await setDoc(analysisRef, {
      ...analysisData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return analysisRef.id
  } catch (error) {
    console.error('Save analysis error:', error)
    throw error
  }
}
