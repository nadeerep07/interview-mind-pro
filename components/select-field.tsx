"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
}

export function SelectField({ label, error, helperText, options, className = "", ...props }: SelectFieldProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>}
      <div className="relative">
        <select
          className={`w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:border-purple-neon focus:ring-2 focus:ring-purple-neon/30 transition-all duration-300 appearance-none cursor-pointer ${
            error ? "border-destructive focus:border-destructive focus:ring-destructive/30" : ""
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      {helperText && !error && <p className="text-sm text-muted-foreground mt-1">{helperText}</p>}
    </div>
  )
}
