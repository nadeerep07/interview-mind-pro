"use client"
import { GlassCard } from "./animated-components"
import { CheckCircle, AlertCircle, Lightbulb } from "lucide-react"

interface AnalysisResultCardProps {
  title: string
  score: number
  maxScore?: number
  category: "strengths" | "improvements" | "tips"
  items: string[]
}

export function AnalysisResultCard({ title, score, maxScore = 10, category, items }: AnalysisResultCardProps) {
  const categoryConfig = {
    strengths: {
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    improvements: {
      icon: AlertCircle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
    },
    tips: {
      icon: Lightbulb,
      color: "text-purple-neon",
      bgColor: "bg-purple-neon/10",
      borderColor: "border-purple-neon/30",
    },
  }

  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <GlassCard className={`space-y-4 border ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${config.color}`} />
          <h3 className="font-bold text-foreground">{title}</h3>
        </div>
        {score !== undefined && (
          <span className={`text-2xl font-bold ${config.color}`}>
            {score}/{maxScore}
          </span>
        )}
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${config.color} mt-2 flex-shrink-0`} />
            <span className="text-sm text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}
