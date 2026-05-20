import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AnalysisCardProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  defaultExpanded?: boolean
}

export default function AnalysisCard({
  title,
  icon,
  children,
  defaultExpanded = false,
}: AnalysisCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="glass rounded-lg p-6 border border-white/20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between hover:opacity-80 transition"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-indigo-600">{icon}</div>}
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && <div className="mt-4 space-y-2">{children}</div>}
    </div>
  )
}
