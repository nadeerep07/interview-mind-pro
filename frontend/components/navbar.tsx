"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { GlowButton } from "./animated-components";
import { GlassWrapper, GradientTextWrapper } from "./glass-wrapper";
import { Menu, X, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // ✅ FIXED — now inside component

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push("/"); // redirect home after logout
  };

  return (
    <GlassWrapper variant="default" className="sticky top-0 z-50 border-b border-white/10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <GradientTextWrapper className="text-xl hidden sm:inline">
              InterviewMind
            </GradientTextWrapper>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="text-foreground hover:text-purple-400">
                  Dashboard
                </Link>
                <Link href="/daily" className="text-foreground hover:text-purple-400">
                  Practice Arena
                </Link>
                <Link href="/ai-analysis" className="text-foreground hover:text-purple-400">
                  AI Analysis
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
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
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <GlowButton variant="outline" size="sm">Login</GlowButton>
                </Link>
                <Link href="/register">
                  <GlowButton variant="primary" size="sm">Sign Up</GlowButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 mt-2 border-t border-white/10">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block py-2 text-foreground">
                  Dashboard
                </Link>
                <Link href="/daily" className="block py-2 text-foreground">
                  Daily Challenge
                </Link>
                <Link href="/ai-analysis" className="block py-2 text-foreground">
                  AI Analysis
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-left text-muted-foreground"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <GlowButton variant="outline" size="sm" className="w-full mt-2">
                    Login
                  </GlowButton>
                </Link>
                <Link href="/register">
                  <GlowButton variant="primary" size="sm" className="w-full">
                    Sign Up
                  </GlowButton>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </GlassWrapper>
  );
}
