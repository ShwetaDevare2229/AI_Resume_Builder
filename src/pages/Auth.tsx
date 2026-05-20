import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'

import { signInWithGoogle } from '../services/firebase'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const navigate = useNavigate()

  const { user } = useAuth()

  const [loading, setLoading] = useState(false)

  // AUTO REDIRECT IF USER ALREADY LOGGED IN
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)

      await signInWithGoogle()

      toast.success('Welcome back!')

      navigate('/dashboard')
    } catch (error) {
      console.error('Sign-in error:', error)

      toast.error('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[calc(100vh-80px)]"
      >
        <div className="glass rounded-2xl p-8 w-full max-w-md border border-white/20">
          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-center text-slate-600 mb-8">
            Sign in to optimize your resume with AI
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-slate-200 rounded-lg hover:border-indigo-600 transition font-semibold text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />

              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />

              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />

              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>

            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-slate-600">
            <p>
              By signing in, you agree to analyze your resume
              and receive recommendations to improve your
              career prospects.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}