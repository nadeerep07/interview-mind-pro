"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, Brain, Home, Target, TrendingUp, Settings } from "lucide-react"
import { GlassWrapper, GradientTextWrapper } from "./glass-wrapper"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/daily", label: "Daily Challenge", icon: Target },
  { href: "/ai-analysis", label: "AI Analysis", icon: Brain },
  { href: "/vocab-helper", label: "Vocab Helper", icon: BookOpen },
  { href: "/profile-strength", label: "Profile Strength", icon: BarChart3 },
  { href: "/growth-tracker", label: "Growth Tracker", icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <GlassWrapper
      variant="default"
      className="hidden lg:flex flex-col w-64 border-r border-white/10 h-screen sticky top-0"
    >
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </GlassWrapper>
  )
}
