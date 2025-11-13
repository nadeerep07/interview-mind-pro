"use client"

import type React from "react"
import { GradientTextWrapper } from "./glass-wrapper"

/**
 * GlassCard: Glassmorphism card component with hover effects
 */
export function GlassCard({
  children,
  className = "",
  variant = "default",
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "light" | "interactive"
  [key: string]: any
}) {
  const variantClasses = {
    default:
      "backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-black/60 hover:border-white/20",
    light: "backdrop-blur-md bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300",
    interactive:
      "backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-4 transition-all duration-300 cursor-pointer active:scale-95",
  }

  return (
    <div className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * GlowButton: Button with gradient and glow effect
 */
export function GlowButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  [key: string]: any
}) {
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-xl hover:shadow-purple-500/70 active:scale-95",
    secondary:
      "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-xl hover:shadow-blue-500/70 active:scale-95",
    outline: "border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 active:scale-95",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`font-semibold rounded-lg transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * GradientText: Text with gradient effect - now uses GradientTextWrapper
 */
export function GradientText({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  return (
    <GradientTextWrapper className={className} {...props}>
      {children}
    </GradientTextWrapper>
  )
}

/**
 * AnimatedBadge: Badge with animated gradient border
 */
export function AnimatedBadge({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-400 text-sm font-semibold transition-all duration-300 hover:border-purple-500 hover:bg-purple-500/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * LoadingSpinner: Animated loading spinner with gradient
 */
export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-8 h-8 ${className}`}>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-blue-500 animate-spin"></div>
      <div
        className="absolute inset-1 rounded-full border-2 border-transparent border-b-cyan-400 animate-spin"
        style={{ animationDirection: "reverse" }}
      ></div>
    </div>
  )
}

/**
 * StatsCard: Card displaying a metric or stat
 */
export function StatsCard({
  label,
  value,
  icon,
  trend,
  className = "",
}: {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  className?: string
}) {
  return (
    <GlassCard className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        {icon && <div className="text-purple-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <GradientTextWrapper className="text-2xl">{value}</GradientTextWrapper>
        {trend && (
          <span className={`text-xs font-semibold ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
    </GlassCard>
  )
}
