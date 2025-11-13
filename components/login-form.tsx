"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GlowButton, LoadingSpinner } from "./animated-components"
import { InputField } from "./input-field"
import { Alert } from "./alert"
import { Mail, Lock } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" title="Login Failed" message={error} onClose={() => setError("")} />}

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
        required
        disabled={isLoading}
      />

      <GlowButton type="submit" variant="primary" size="lg" className="w-full justify-center" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5" />
            <span>Logging in...</span>
          </>
        ) : (
          "Sign In"
        )}
      </GlowButton>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a href="/register" className="text-purple-neon hover:text-purple-neon/80 font-semibold">
          Create one
        </a>
      </p>
    </form>
  )
}
