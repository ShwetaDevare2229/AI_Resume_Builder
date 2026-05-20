import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { signOutUser } from '../services/firebase'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOutUser()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
  src="https://cdn-icons-png.flaticon.com/128/16921/16921660.png"
  alt="AI Resume Logo"
  className="w-10 h-10 object-contain rounded-lg"
/>
            <span className="font-bold text-lg gradient-text">AI Resume</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-700 hover:text-indigo-600 transition">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/32'}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-slate-700">{user.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-slate-700 hover:text-indigo-600 transition">
                  Home
                </Link>
                <Link to="/auth" className="btn-primary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <Menu size={20} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-slate-700 hover:text-indigo-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-100 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="block text-slate-700 hover:text-indigo-600 transition">
                  Home
                </Link>
                <Link to="/auth" className="btn-primary block text-center">
                  Sign In
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
