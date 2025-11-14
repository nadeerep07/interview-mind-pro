"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GlowButton, LoadingSpinner } from "./animated-components"
import { InputField } from "./input-field"
import { Alert } from "./alert"
import { Mail, Lock, User } from "lucide-react"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, name)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" title="Registration Failed" message={error} onClose={() => setError("")} />}

      <InputField
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<User className="w-4 h-4" />}
        required
        disabled={isLoading}
      />

      <InputField
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-4 h-4" />}
        required
        disabled={isLoading}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        helperText="At least 8 characters"
        required
        disabled={isLoading}
      />

      <InputField
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        required
        disabled={isLoading}
      />

      <GlowButton type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5" />
            <span>Creating account...</span>
          </>
        ) : (
          "Create Account"
        )}
      </GlowButton>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-purple-neon hover:text-purple-neon/80 font-semibold">
          Sign in
        </a>
      </p>
    </form>
  )
}
