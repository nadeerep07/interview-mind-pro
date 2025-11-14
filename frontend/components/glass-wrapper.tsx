import type React from "react"

/**
 * GlassWrapper: Applies glassmorphism styles without relying on custom Tailwind utilities
 */
export function GlassWrapper({
  children,
  className = "",
  variant = "default",
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "light" | "card"
  [key: string]: any
}) {
  const baseStyles = "backdrop-blur-xl border border-white/10"
  const bgStyles = {
    default: "bg-black/40",
    light: "bg-black/20",
    card: "bg-black/40 rounded-xl p-6 transition-all duration-300 hover:bg-black/60 hover:border-white/20",
  }

  return (
    <div className={`${baseStyles} ${bgStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * GradientTextWrapper: Applies gradient text effect without custom utilities
 */
export function GradientTextWrapper({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  return (
    <span
      className={`font-bold ${className}`}
      style={{
        background: "linear-gradient(to right, #a855f7, #3b82f6, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      {...props}
    >
      {children}
    </span>
  )
}
