import axios from 'axios'

export interface AnalysisRequest {
  jobTitle: string
  targetCompanies: string[]
  experienceLevel: string
  resumeText: string
}

export interface AnalysisResponse {
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

function generatePrompt(request: AnalysisRequest): string {
  return `You are an expert ATS (Applicant Tracking System) resume reviewer and hiring consultant with 15+ years of experience in tech recruitment.

Analyze the following resume for the role of: "${request.jobTitle}"

Target companies: ${request.targetCompanies.join(', ')}
Candidate experience level: ${request.experienceLevel}

Resume content:
---
${request.resumeText}
---

Provide a comprehensive analysis in the following JSON format exactly:
{
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence summary of overall fit>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", ...],
  "formattingSuggestions": ["<suggestion 1>", "<suggestion 2>", ...],
  "recommendedSkills": ["<skill 1>", "<skill 2>", ...],
  "projectSuggestions": ["<suggestion 1>", "<suggestion 2>", ...],
  "certifications": ["<cert 1>", "<cert 2>", ...],
  "interviewTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "similarJobs": [
    {
      "title": "<job title>",
      "matchPercentage": <number>,
      "reason": "<why this matches>"
    }
  ]
}

Return ONLY valid JSON, no additional text.`
}

// Mock data for testing (comment out to use real API)
function getMockAnalysis(request: AnalysisRequest): AnalysisResponse {
  return {
    atsScore: 78,
    summary: `Your resume is well-suited for a ${request.jobTitle} position at ${request.targetCompanies[0]}. You have strong technical skills and relevant experience, but could improve in a few areas to increase your ATS score.`,
    strengths: [
      'Clear technical skill keywords aligned with the job description',
      'Good use of quantifiable achievements',
      'Relevant experience section with chronological format',
      'Professional formatting with standard fonts'
    ],
    weaknesses: [
      'Missing some industry-specific keywords',
      'Could expand on leadership/management experience',
      'Limited metrics for project impact',
      'Some inconsistency in date formatting'
    ],
    missingKeywords: [
      'Cloud Architecture',
      'Microservices',
      'Docker/Kubernetes',
      'CI/CD Pipeline',
      'AWS/Azure/GCP'
    ],
    formattingSuggestions: [
      'Use consistent bullet points throughout',
      'Add more white space for readability',
      'Ensure proper PDF conversion without special characters',
      'Use standard section headers'
    ],
    recommendedSkills: [
      'System Design',
      'DevOps',
      'Agile Methodology',
      'Technical Leadership'
    ],
    projectSuggestions: [
      'Highlight a major project with measurable outcomes',
      'Include open source contributions',
      'Add technical certifications or training',
      'Document team size and project scope'
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Kubernetes Administrator (CKA)',
      'Google Cloud Professional'
    ],
    interviewTips: [
      'Prepare stories demonstrating system design thinking',
      'Practice explaining technical decisions clearly',
      'Research company\'s tech stack and current challenges'
    ],
    similarJobs: [
      {
        title: 'Senior Software Engineer',
        matchPercentage: 85,
        reason: 'Strong match with your backend and system design experience'
      },
      {
        title: 'DevOps Engineer',
        matchPercentage: 72,
        reason: 'Good fit given your infrastructure knowledge'
      },
      {
        title: 'Solutions Architect',
        matchPercentage: 68,
        reason: 'Relevant for your architectural thinking skills'
      }
    ]
  }
}

export async function analyzeResume(request: AnalysisRequest): Promise<AnalysisResponse> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true'
  
  console.log('Resume analysis config:', {
    useMockData,
    keyExists: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING'
  })
  
  // Use mock data for testing if enabled
  if (useMockData) {
    console.log('Using mock data for testing...')
    return getMockAnalysis(request)
  }
  
  if (!apiKey || apiKey.trim() === '') {
    console.error('API Key Error: Key is missing or empty')
    console.error('To use real API: set VITE_USE_MOCK_DATA=false in .env.local')
    console.error('For testing: set VITE_USE_MOCK_DATA=true in .env.local')
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env.local file or set VITE_USE_MOCK_DATA=true for testing.')
  }

  try {
    const prompt = generatePrompt(request)
    
    console.log('Sending request to OpenAI API...')
    
    // Retry logic with exponential backoff
    let lastError: any
    const maxRetries = 3
    const baseDelay = 1000 // 1 second
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        )

        console.log('OpenAI API response received successfully')

        if (!response.data.choices || !response.data.choices[0]) {
          throw new Error('Invalid response format from OpenAI API')
        }

        const responseText = response.data.choices[0].message.content
        
        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('Could not parse JSON from AI response. Response: ' + responseText.substring(0, 200))
        }

        const analysis = JSON.parse(jsonMatch[0])
        return analysis as AnalysisResponse
      } catch (error: any) {
        lastError = error
        
        // Only retry on rate limit (429)
        if (error.response?.status === 429 && attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt) // Exponential backoff
          console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        
        // Don't retry other errors
        throw error
      }
    }
    
    // If we got here, all retries failed
    throw lastError
  } catch (error: any) {
    console.error('OpenAI API error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    })
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your .env.local file and verify your key is correct.')
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. You have made too many requests to OpenAI API. Please wait a few minutes and try again. Check your OpenAI account usage at https://platform.openai.com/account/usage')
    } else if (error.response?.status === 503) {
      throw new Error('OpenAI API is temporarily unavailable. Please try again later.')
    } else if (error.message.includes('Could not parse JSON')) {
      throw new Error(error.message)
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The AI analysis took too long. Please try again.')
    }
    
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to analyze resume with OpenAI API')
  }
}
