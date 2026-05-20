import { Briefcase } from 'lucide-react'

interface JobCardProps {
  title: string
  matchPercentage: number
  reason: string
}

export default function JobCard({ title, matchPercentage, reason }: JobCardProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-700'
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-700'
    return 'bg-orange-100 text-orange-700'
  }

  return (
    <div className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Briefcase size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{reason}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0 ${getMatchColor(matchPercentage)}`}>
          {matchPercentage}%
        </div>
      </div>
    </div>
  )
}
