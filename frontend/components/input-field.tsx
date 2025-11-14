"use client"

import type React from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export function InputField({ label, error, helperText, icon, className = "", ...props }: InputFieldProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>}
      <div className="relative">
        <input
          className={`w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-neon focus:ring-2 focus:ring-purple-neon/30 transition-all duration-300 ${
            error ? "border-destructive focus:border-destructive focus:ring-destructive/30" : ""
          } ${icon ? "pl-10" : ""} ${className}`}
          {...props}
        />
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      {helperText && !error && <p className="text-sm text-muted-foreground mt-1">{helperText}</p>}
    </div>
  )
}
