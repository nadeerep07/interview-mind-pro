import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-center text-muted-foreground text-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} InterviewMind Pro. All rights reserved.</p>
        <p className="flex items-center gap-1.5 font-medium">
          <span>Engineered by</span>
          <a
            href="https://nadeerep-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors underline-offset-4 hover:underline"
          >
            Nadeer E P
          </a>
        </p>
      </div>
    </footer>
  )
}
