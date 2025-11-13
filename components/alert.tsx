"use client"
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"

type AlertType = "info" | "success" | "warning" | "error"

interface AlertProps {
  type: AlertType
  title: string
  message: string
  onClose?: () => void
  dismissible?: boolean
}

export function Alert({ type, title, message, onClose, dismissible = true }: AlertProps) {
  const typeConfig = {
    info: {
      icon: Info,
      bgColor: "bg-blue-neon/10",
      borderColor: "border-blue-neon/30",
      textColor: "text-blue-neon",
      iconColor: "text-blue-neon",
    },
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-500",
      iconColor: "text-green-500",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-500",
      iconColor: "text-yellow-500",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      textColor: "text-destructive",
      iconColor: "text-destructive",
    },
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.iconColor} mt-0.5`} />
      <div className="flex-1">
        <h3 className={`font-semibold ${config.textColor} mb-1`}>{title}</h3>
        <p className="text-sm text-foreground">{message}</p>
      </div>
      {dismissible && onClose && (
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
