"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { GlowButton } from "./animated-components"
import { GlassWrapper, GradientTextWrapper } from "./glass-wrapper"
import { Menu, X, LogOut, User } from "lucide-react"

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <GlassWrapper variant="default" className="sticky top-0 z-50 border-b border-white/10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <GradientTextWrapper className="text-xl hidden sm:inline">InterviewMind</GradientTextWrapper>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="text-foreground hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/daily" className="text-foreground hover:text-purple-400 transition-colors">
                  Daily Challenge
                </Link>
                <Link href="/ai-analysis" className="text-foreground hover:text-purple-400 transition-colors">
                  AI Analysis
                </Link>
              </>
            )}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-foreground">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <GlowButton variant="outline" size="sm">
                    Login
                  </GlowButton>
                </Link>
                <Link href="/register">
                  <GlowButton variant="primary" size="sm">
                    Sign Up
                  </GlowButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-white/10 pt-4">
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="block text-foreground hover:text-purple-400">
                  Dashboard
                </Link>
                <Link href="/daily" className="block text-foreground hover:text-purple-400">
                  Daily Challenge
                </Link>
                <Link href="/ai-analysis" className="block text-foreground hover:text-purple-400">
                  AI Analysis
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2">
                <Link href="/login">
                  <GlowButton variant="outline" size="sm" className="w-full">
                    Login
                  </GlowButton>
                </Link>
                <Link href="/register">
                  <GlowButton variant="primary" size="sm" className="w-full">
                    Sign Up
                  </GlowButton>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </GlassWrapper>
  )
}
