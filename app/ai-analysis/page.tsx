"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ProtectedLayout } from "@/components/protected-layout";
import {
  GlassCard,
  GlowButton,
  GradientText,
  StatsCard,
  LoadingSpinner,
} from "@/components/animated-components";
import { AnalysisResultCard } from "@/components/analysis-result-card";
import { useAuth } from "@/lib/auth-context";
import { TextareaField } from "@/components/textarea-field";
import { SelectField } from "@/components/select-field";
import { Brain, Send, Download, Mic } from "lucide-react";

export default function AIAnalysisPage() {
  const { user } = useAuth();

  const [interviewType, setInterviewType] = useState("behavioral");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;

      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          const text = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join("");

          setResponse(text);
        };

        recog.onerror = (err: any) => console.error("Speech error:", err);

        recognitionRef.current = recog;
      }
    }
  }, []);

  const handleRecordStart = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support voice recording.");
      return;
    }
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const handleRecordStop = () => {
    if (!recognitionRef.current) return;
    setIsRecording(false);
    recognitionRef.current.stop();
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
  const userId = user?._id || user?.id;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            userResponse: response,
            interviewType,
            userId: userId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setQuestion("");
    setResponse("");
  };

  const handleDownload = () => {
    const reportText = `Interview Analysis Report
Generated: ${new Date().toLocaleDateString()}

Overall Score: ${analysis.overallScore}/10
COMMUNICATION: ${analysis.communicationScore}/10
CLARITY: ${analysis.clarityScore}/10
CONFIDENCE: ${analysis.confidenceScore}/10

STRENGTHS:
${analysis.strengths.map((s: string) => `- ${s}`).join("\n")}

AREAS FOR IMPROVEMENT:
${analysis.improvements.map((i: string) => `- ${i}`).join("\n")}

TIPS FOR SUCCESS:
${analysis.tips.map((t: string) => `- ${t}`).join("\n")}`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview-analysis-report.txt";
    a.click();
  };

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI Interview <GradientText>Analysis</GradientText>
          </h1>
          <p className="text-muted-foreground">
            Get detailed feedback on your interview responses powered by AI
          </p>
        </div>

        {!analysis ? (
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Interview Type */}
            <SelectField
              label="Interview Type"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              options={[
                { value: "behavioral", label: "Behavioral Interview" },
                { value: "technical", label: "Technical Interview" },
                { value: "case", label: "Case Study" },
                { value: "custom", label: "Custom" },
              ]}
            />

            {/* Question */}
            <TextareaField
              label="Interview Question"
              placeholder="Enter the interview question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={1000}
              rows={4}
              required
            />

            {/* Response */}
            <TextareaField
              label="Your Response"
              placeholder="Type your response or use voice recording..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              maxLength={3000}
              rows={8}
              required
            />

            {/* Voice Recording Button */}
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

            {/* Submit */}
            <GlowButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={!question || !response || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner className="w-5 h-5" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Get AI Feedback</span>
                </>
              )}
            </GlowButton>
          </form>
        ) : (
          <>
            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <StatsCard
                label="Overall Score"
                value={`${analysis.overallScore}/10`}
                icon={<Brain />}
              />
              <StatsCard
                label="Communication"
                value={`${analysis.communicationScore}/10`}
                icon={<Send />}
              />
              <StatsCard
                label="Clarity"
                value={`${analysis.clarityScore}/10`}
                icon={<Brain />}
              />
              <StatsCard
                label="Confidence"
                value={`${analysis.confidenceScore}/10`}
                icon={<Brain />}
              />
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold text-foreground">
                Detailed Feedback
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalysisResultCard
                  title="Key Strengths"
                  category="strengths"
                  score={analysis.communicationScore}
                  items={analysis.strengths}
                />

                <AnalysisResultCard
                  title="Areas to Improve"
                  category="improvements"
                  score={analysis.clarityScore}
                  items={analysis.improvements}
                />

                <AnalysisResultCard
                  title="Pro Tips"
                  category="tips"
                  score={analysis.confidenceScore}
                  items={analysis.tips}
                />
              </div>
            </div>

            {/* User Response */}
            <GlassCard className="space-y-4 p-6 mt-6">
              <h3 className="text-lg font-bold">Your Response</h3>
              <p className="text-sm leading-relaxed">{response}</p>
            </GlassCard>

            {/* Buttons */}
            <div className="flex gap-4 justify-between mt-6">
              <GlowButton variant="outline" size="lg" onClick={handleReset}>
                Analyze Another Response
              </GlowButton>

              <GlowButton
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5" /> Download Report
              </GlowButton>
            </div>
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
