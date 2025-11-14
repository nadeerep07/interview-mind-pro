import Link from "next/link"
import { RegisterForm } from "@/components/register-form"
import { GlassWrapper, GradientTextWrapper } from "@/components/glass-wrapper"

export const metadata = {
  title: "Sign Up | InterviewMind Pro",
  description: "Create a new InterviewMind Pro account",
}

export default function RegisterPage() {
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

          <h1 className="text-3xl font-bold text-foreground mb-2">Get Started</h1>
          <p className="text-muted-foreground">Create your account and start improving your interviews today</p>
        </div>

        <GlassWrapper variant="default" className="rounded-2xl p-8">
          <RegisterForm />
        </GlassWrapper>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-purple-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </main>
  )
}
