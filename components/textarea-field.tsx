"use client"

import type React from "react"

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
}

export function TextareaField({
  label,
  error,
  helperText,
  maxLength,
  value,
  className = "",
  ...props
}: TextareaFieldProps) {
  const currentLength = typeof value === "string" ? value.length : 0

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-neon focus:ring-2 focus:ring-purple-neon/30 transition-all duration-300 resize-none ${
          error ? "border-destructive focus:border-destructive focus:ring-destructive/30" : ""
        } ${className}`}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      <div className="flex items-center justify-between mt-2">
        <div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
        </div>
        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
