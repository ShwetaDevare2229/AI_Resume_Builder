import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import UploadBox from '../components/UploadBox'

import { useAuth } from '../context/AuthContext'
import { saveAnalysis } from '../services/firebase'
import { extractTextFromPDF } from '../services/pdfService'
import { analyzeResume } from '../services/geminiService'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [analyzing, setAnalyzing] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [jobTitle, setJobTitle] = useState('')
  const [companies, setCompanies] = useState('')
  const [experience, setExperience] = useState('1-3 years')

  const experienceLevels = [
    'Fresher',
    '0-1 years',
    '1-3 years',
    '3-5 years',
    '5+ years',
  ]

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile)
    toast.success('Resume uploaded successfully!')
  }

  const handleAnalyze = async () => {
    if (!file || !jobTitle || !companies) {
      toast.error('Please fill all fields and upload a resume')
      return
    }

    if (!user) {
      toast.error('Please sign in first')
      return
    }

    try {
      setAnalyzing(true)

      // SINGLE loading toast
      const toastId = toast.loading('Extracting resume text...')

      // STEP 1: Extract PDF text
      const resumeText = await extractTextFromPDF(file)

      // UPDATE same toast
      toast.loading('Analyzing with AI...', {
        id: toastId,
      })

      // STEP 2: Gemini Analysis
      const analysisResult = await analyzeResume({
        jobTitle,
        targetCompanies: companies
          .split(',')
          .map(company => company.trim()),

        experienceLevel: experience,
        resumeText,
      })

      // STEP 3: Save Analysis
      const analysisId = `analysis_${Date.now()}`

      await saveAnalysis(user.uid, {
        id: analysisId,
        jobTitle,
        companies: companies
          .split(',')
          .map(company => company.trim()),

        experience,
        resumeText,
        ...analysisResult,
      })

      // SUCCESS replaces loader
      toast.success('Analysis complete!', {
        id: toastId,
      })

      // Navigate to results page
      navigate(`/analysis/${analysisId}`)
    } catch (error) {
      console.error('Analysis error:', error)

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to analyze resume'
      )
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Analyze Your Resume
            </h1>

            <p className="text-slate-600">
              Upload your resume and get AI-powered ATS insights
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2 space-y-6">

              {/* Upload Resume */}
              <div className="glass rounded-xl p-6 bg-white/70 backdrop-blur">
                <h2 className="font-semibold text-lg mb-4">
                  1. Upload Resume
                </h2>

                <UploadBox
                  onFileSelected={handleFileSelected}
                  isLoading={analyzing}
                />

                {file && (
                  <p className="mt-3 text-sm text-green-600">
                    ✓ {file.name}
                  </p>
                )}
              </div>

              {/* Job Details */}
              <div className="glass rounded-xl p-6 bg-white/70 backdrop-blur space-y-5">
                <h2 className="font-semibold text-lg">
                  2. Job Details
                </h2>

                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Title *
                  </label>

                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Frontend Developer"
                    disabled={analyzing}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Companies */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target Companies *
                  </label>

                  <input
                    type="text"
                    value={companies}
                    onChange={(e) => setCompanies(e.target.value)}
                    placeholder="Google, Microsoft, Amazon"
                    disabled={analyzing}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <p className="text-xs text-slate-500 mt-1">
                    Separate companies with commas
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experience Level
                  </label>

                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    disabled={analyzing}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {experienceLevels.map((level) => (
                      <option
                        key={level}
                        value={level}
                      >
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-4">

              {/* Tips */}
              <div className="glass rounded-xl p-6 bg-white/70 backdrop-blur">
                <h3 className="font-semibold text-lg mb-4">
                  Resume Tips
                </h3>

                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-indigo-600">•</span>
                    Use ATS-friendly formatting
                  </li>

                  <li className="flex gap-2">
                    <span className="text-indigo-600">•</span>
                    Add measurable achievements
                  </li>

                  <li className="flex gap-2">
                    <span className="text-indigo-600">•</span>
                    Use job-specific keywords
                  </li>

                  <li className="flex gap-2">
                    <span className="text-indigo-600">•</span>
                    Keep resume concise
                  </li>

                  <li className="flex gap-2">
                    <span className="text-indigo-600">•</span>
                    Highlight relevant projects
                  </li>
                </ul>
              </div>

              {/* Popular Companies */}
              <div className="glass rounded-xl p-6 bg-white/70 backdrop-blur">
                <h3 className="font-semibold text-lg mb-4">
                  Popular Companies
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Google',
                    'Microsoft',
                    'Amazon',
                    'Meta',
                    'Apple',
                    'Netflix',
                  ].map((company) => (
                    <button
                      key={company}
                      onClick={() =>
                        setCompanies((prev) =>
                          prev
                            ? `${prev}, ${company}`
                            : company
                        )
                      }
                      className="bg-slate-100 hover:bg-indigo-100 transition rounded-lg px-3 py-2 text-sm"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}