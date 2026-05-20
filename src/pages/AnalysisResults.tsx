import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, ArrowLeft, Share2, Lightbulb, CheckCircle, AlertCircle, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import ATSGauge from '../components/ATSGauge'
import AnalysisCard from '../components/AnalysisCard'
import JobCard from '../components/JobCard'
import { useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

interface Analysis {
  id: string
  jobTitle: string
  companies: string[]
  experience: string
  resumeText: string
  atsScore: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  formattingSuggestions: string[]
  recommendedSkills: string[]
  projectSuggestions: string[]
  certifications: string[]
  interviewTips: string[]
  similarJobs: Array<{
    title: string
    matchPercentage: number
    reason: string
  }>
}

export default function AnalysisResults() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!user || !id) return

      try {
        const docRef = doc(db, 'users', user.uid, 'analyses', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setAnalysis(docSnap.data() as Analysis)
        } else {
          toast.error('Analysis not found')
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Fetch error:', error)
        toast.error('Failed to load analysis')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [id, user, navigate])

  if (loading) {
    return <Loader />
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Analysis not found</p>
      </div>
    )
  }

  const handleExportPDF = () => {
    toast.success('PDF export coming soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{analysis.jobTitle}</h1>
              <p className="text-slate-600">{analysis.companies.join(', ')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => toast.success('Share link copied!')}
              className="btn-secondary flex items-center gap-2"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* ATS Score */}
            <div className="glass rounded-lg p-8 text-center">
              <ATSGauge score={analysis.atsScore} />
              <p className="mt-6 text-slate-700">{analysis.summary}</p>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <AnalysisCard
                title="Resume Strengths"
                icon={<CheckCircle size={20} />}
                defaultExpanded
              >
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="text-green-600">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses.length > 0 && (
              <AnalysisCard
                title="Areas for Improvement"
                icon={<AlertCircle size={20} />}
              >
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="text-yellow-600">!</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>
            )}

            {/* Missing Keywords */}
            {analysis.missingKeywords.length > 0 && (
              <AnalysisCard title="Missing Keywords" icon={<Lightbulb size={20} />}>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </AnalysisCard>
            )}

            {/* Recommended Skills */}
            {analysis.recommendedSkills.length > 0 && (
              <AnalysisCard title="Recommended Skills to Add" icon={<Lightbulb size={20} />}>
                <div className="grid sm:grid-cols-2 gap-2">
                  {analysis.recommendedSkills.map((skill, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </AnalysisCard>
            )}

            {/* Interview Tips */}
            {analysis.interviewTips.length > 0 && (
              <AnalysisCard title="Interview Preparation Tips" icon={<Briefcase size={20} />}>
                <ul className="space-y-2">
                  {analysis.interviewTips.map((tip, i) => (
                    <li key={i} className="text-sm text-slate-700 pl-4 border-l-2 border-indigo-600">
                      {tip}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>
            )}

            {/* Certifications */}
            {analysis.certifications.length > 0 && (
              <AnalysisCard title="Recommended Certifications">
                <ul className="space-y-2">
                  {analysis.certifications.map((cert, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      • {cert}
                    </li>
                  ))}
                </ul>
              </AnalysisCard>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Formatting Suggestions */}
            {analysis.formattingSuggestions.length > 0 && (
              <div className="glass rounded-lg p-6">
                <h3 className="font-semibold mb-3">Formatting Tips</h3>
                <ul className="space-y-2">
                  {analysis.formattingSuggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-slate-600">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Similar Jobs */}
            {analysis.similarJobs.length > 0 && (
              <div className="glass rounded-lg p-6">
                <h3 className="font-semibold mb-4">Similar Job Opportunities</h3>
                <div className="space-y-3">
                  {analysis.similarJobs.slice(0, 3).map((job, i) => (
                    <JobCard key={i} {...job} />
                  ))}
                </div>
              </div>
            )}

            {/* Project Suggestions */}
            {analysis.projectSuggestions.length > 0 && (
              <div className="glass rounded-lg p-6">
                <h3 className="font-semibold mb-3">Project Ideas to Build</h3>
                <ul className="space-y-2">
                  {analysis.projectSuggestions.slice(0, 3).map((project, i) => (
                    <li key={i} className="text-sm text-slate-600">
                      • {project}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            <div className="glass rounded-lg p-6 border border-indigo-200 bg-indigo-50">
              <h3 className="font-semibold text-indigo-900 mb-3">Next Steps</h3>
              <ol className="space-y-2 text-sm text-indigo-800">
                <li>1. Update your resume with suggestions</li>
                <li>2. Add missing keywords naturally</li>
                <li>3. Expand your skills section</li>
                <li>4. Re-upload and analyze again</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
