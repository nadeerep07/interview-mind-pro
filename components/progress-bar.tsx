"use client"

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  animated?: boolean
}

export function ProgressBar({ value, max = 100, label, showPercentage = true, animated = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showPercentage && <span className="text-sm font-semibold text-purple-neon">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-white/10 border border-white/20 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-purple-neon to-blue-neon transition-all duration-500 ${
            animated ? "animate-pulse" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
