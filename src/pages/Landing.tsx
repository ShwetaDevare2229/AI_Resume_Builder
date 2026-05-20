import { Link } from 'react-router-dom'
import { Zap, BarChart3, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Analysis',
    description: 'Get instant ATS score and detailed feedback using advanced AI',
  },
  {
    icon: BarChart3,
    title: 'Optimize for ATS',
    description: 'Learn exactly what ATS systems are looking for in your resume',
  },
  {
    icon: Lightbulb,
    title: 'Smart Suggestions',
    description: 'Receive actionable recommendations to improve your resume',
  },
  {
    icon: CheckCircle,
    title: 'Job Matching',
    description: 'Discover similar roles that match your skills and experience',
  },
]

const steps = [
  { title: 'Upload Resume', description: 'Upload your resume as PDF' },
  { title: 'Enter Job Details', description: 'Tell us the role and companies' },
  { title: 'Get Analysis', description: 'Receive AI-powered insights' },
  { title: 'Improve & Apply', description: 'Apply suggestions and get hired' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
          Your Resume, Optimized by AI
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Get instant ATS score, AI-powered suggestions, and land your dream job at top companies
        </p>
        <Link to="/auth" className="btn-primary inline-flex items-center gap-2">
          Get Started <ArrowRight size={18} />
        </Link>
      </motion.section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Resume Builder?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-lg"
              >
                <Icon className="w-8 h-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-3 mx-auto">
                {i + 1}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="container mx-auto px-4 py-20"
      >
        <div className="glass rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Resume?</h2>
          <p className="text-slate-600 mb-8">Join thousands of job seekers getting hired with AI-powered resume optimization</p>
          <Link to="/auth" className="btn-primary inline-flex items-center gap-2">
            Sign In with Google <ArrowRight size={18} />
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          <p>© 2026 AI Resume Analyser. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
