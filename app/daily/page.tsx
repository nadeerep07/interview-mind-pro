"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ProtectedLayout } from "@/components/protected-layout";
import {
  GlassCard,
  GlowButton,
  GradientText,
  LoadingSpinner,
} from "@/components/animated-components";
import { TextareaField } from "@/components/textarea-field";
import { SelectField } from "@/components/select-field";
import { useAuth } from "@/lib/auth-context";
import { Mic, Send } from "lucide-react";

export default function PracticeArenaPage() {
  const { user } = useAuth();

  // Interview category (behavioral | technical | case)
  const [category, setCategory] = useState<
    "behavioral" | "technical" | "case"
  >("behavioral");

  // Difficulty level (beginner | intermediate | advanced)
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");

  const [userResponse, setUserResponse] = useState("");
  const [submitted, setSubmitted] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailyQuestion, setDailyQuestion] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [refreshQuestion, setRefreshQuestion] = useState(0);

  const recognitionRef = useRef<any>(null);

  // =============================
  // Initialize SpeechRecognition (same behaviour as your AIAnalysisPage)
  // =============================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = (event: any) => {
      // Combine transcripts from results
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setUserResponse(text);
    };

    recog.onerror = (err: any) => {
      console.error("Speech error:", err);
    };

    recognitionRef.current = recog;

    // cleanup on unmount
    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop?.();
        }
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  // =============================
  // Load Daily Question (Practice Arena)
  // =============================
  useEffect(() => {
    if (!user) return;

    async function loadQuestion() {
      setIsLoadingQuestion(true);

      try {
        const stackParam = encodeURIComponent(JSON.stringify(user?.stack ?? []));
        const difficultyParam = encodeURIComponent(difficulty);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/daily-question?category=${category}&difficulty=${difficultyParam}&stack=${stackParam}`
        );

        const data = await res.json();
        setDailyQuestion(data.success ? data.question : "Failed to load question.");
      } catch (err) {
        console.error("Failed loading question:", err);
        setDailyQuestion("Error loading question.");
      } finally {
        setIsLoadingQuestion(false);
      }
    }

    loadQuestion();
  }, [category, difficulty, refreshQuestion, user?.stack?.length]);

  // =============================
  // Submit Answer (Get AI Feedback)
  // =============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = user?.id;

    if (!userId) {
      console.error("Missing userId");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: dailyQuestion,
          userResponse,
          interviewType: category,
          difficulty,
          userId,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Analysis failed");

      setSubmitted(data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      // you may want to add toast/error UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  // =============================
  // Recording Handlers (same UX as AIAnalysisPage)
  // =============================
  const handleRecordStart = () => {
    if (!recognitionRef.current) {
      alert("Voice recording not supported in your browser.");
      return;
    }
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const handleRecordStop = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error("Failed to stop recording:", err);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Practice <GradientText>Arena</GradientText>
          </h1>
          <p className="text-muted-foreground">
            Practice your interview skills with today's question
          </p>
        </div>

        <div className="space-y-6">
          {/* Category Selection (behavioral/technical/case) */}
          <SelectField
            label="Interview Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as "behavioral" | "technical" | "case");
              setUserResponse("");
              setSubmitted(null);
            }}
            options={[
              { value: "behavioral", label: "Behavioral Interview" },
              { value: "technical", label: "Technical Interview" },
              { value: "case", label: "Case Study" },
            ]}
          />

          {/* Difficulty Selection */}
          <SelectField
            label="Difficulty"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced");
              setUserResponse("");
              setSubmitted(null);
            }}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />

          {/* Daily Question */}
          <GlassCard className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Today's Question</h2>
              <span className="text-sm font-semibold text-purple-neon">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-lg text-foreground leading-relaxed">
              {isLoadingQuestion ? (
                <span className="text-muted-foreground">Loading question...</span>
              ) : (
                dailyQuestion || "No question available."
              )}
            </p>
          </GlassCard>

          {/* Answer Form / Result */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <TextareaField
                  label="Your Answer"
                  placeholder="Type your response here or speak using the mic..."
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  maxLength={2000}
                  rows={8}
                />

                {/* Voice Recording */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={isRecording ? handleRecordStop : handleRecordStart}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      isRecording
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-foreground border border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? "Stop Recording" : "Record Answer"}
                  </button>

                  {/* Try another question (local refresh) */}
                  <button
                    type="button"
                    onClick={() => {
                      setRefreshQuestion((p) => p + 1);
                      setSubmitted(null);
                      setUserResponse("");
                    }}
                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 font-semibold"
                  >
                    Refresh Question
                  </button>
                </div>
              </div>

              {/* Submit */}
              <GlowButton
                type="submit"
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
                disabled={!userResponse || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="w-5 h-5" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Get AI Feedback</span>
                  </>
                )}
              </GlowButton>
            </form>
          ) : (
            <GlassCard className="space-y-6 p-6">
              <h3 className="text-2xl font-bold text-foreground mb-4">AI Feedback</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/10 border border-white/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold">{submitted.overallScore}/10</p>
                </div>
                <div className="p-4 bg-white/10 border border-white/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Communication</p>
                  <p className="text-2xl font-bold">{submitted.communicationScore}/10</p>
                </div>
                <div className="p-4 bg-white/10 border border-white/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Clarity</p>
                  <p className="text-2xl font-bold">{submitted.clarityScore}/10</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground">Strengths</h4>
                <ul className="list-disc ml-6 space-y-1">
                  {submitted.strengths?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground">Areas to Improve</h4>
                <ul className="list-disc ml-6 space-y-1">
                  {submitted.improvements?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground">Tips</h4>
                <ul className="list-disc ml-6 space-y-1">
                  {submitted.tips?.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <GlowButton
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  setSubmitted(null);
                  setUserResponse("");
                  setRefreshQuestion((prev) => prev + 1);
                }}
              >
                Try Another Question
              </GlowButton>
            </GlassCard>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
