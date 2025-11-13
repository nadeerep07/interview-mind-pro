import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { GlassWrapper, GradientTextWrapper } from "@/components/glass-wrapper"

export const metadata = {
  title: "Login | InterviewMind Pro",
  description: "Sign in to your InterviewMind Pro account",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <GradientTextWrapper className="text-2xl">InterviewMind</GradientTextWrapper>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your interview coaching dashboard</p>
        </div>

        <GlassWrapper variant="default" className="rounded-2xl p-8">
          <LoginForm />
        </GlassWrapper>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="text-purple-400 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </main>
  )
}
