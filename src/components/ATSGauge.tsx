import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface ATSGaugeProps {
  score: number
}

export default function ATSGauge({ score }: ATSGaugeProps) {
  const getColor = (score: number) => {
    if (score < 40) return '#ef4444' // red
    if (score < 70) return '#eab308' // yellow
    return '#22c55e' // green
  }

  const getStatus = (score: number) => {
    if (score < 40) return 'Poor'
    if (score < 70) return 'Average'
    return 'Excellent'
  }

  const color = getColor(score)
  const status = getStatus(score)

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={buildStyles({
            rotation: 0.25,
            strokeLinecap: 'round',
            textSize: '24px',
            pathTransitionDuration: 0.5,
            pathColor: color,
            textColor: color,
            trailColor: '#e2e8f0',
            backgroundColor: '#ffffff',
          })}
        />
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-900">{status}</p>
      <p className="text-sm text-slate-600">ATS Score</p>
    </div>
  )
}
