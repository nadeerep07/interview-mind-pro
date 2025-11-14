"use client";

import React, { useEffect, useState } from "react";
import { ProtectedLayout } from "@/components/protected-layout";
import { GlassCard, GlowButton, GradientText, LoadingSpinner } from "@/components/animated-components";
import { InputField } from "@/components/input-field";
import { useAuth } from "@/lib/auth-context";
import { Plus, Trash2, RotateCw } from "lucide-react";
import { Modal } from "@/components/modal";

interface Word {
  _id: string;
  word: string;
  definition: string;
  usage: string;
  examples: string[];
  reviewCount: number;
  lastReviewedAt: string;
}

export default function VocabHelperPage() {
  const { user } = useAuth();

  const [words, setWords] = useState<Word[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWord, setNewWord] = useState({ word: "" });
  const [filter, setFilter] = useState("all");
  const [isReviewing, setIsReviewing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD WORDS FROM BACKEND
  useEffect(() => {
    if (!user?.id) return;

    const loadWords = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vocab/list/${user.id}`
        );
        const data = await res.json();
        setWords(data);
      } catch (error) {
        console.error("Error loading words:", error);
      }
      setLoading(false);
    };

    loadWords();
  }, [user]);

  // 🔥 ADD WORD (AI generated)
  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vocab/add-word`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word: newWord.word,
            userId: user?.id,
          }),
        }
      );

      const data = await res.json();

      setWords([data, ...words]); // FIXED
      setNewWord({ word: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  // 🔥 DELETE
  const handleDeleteWord = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vocab/${id}`,
        { method: "DELETE" }
      );
      setWords(words.filter((w) => w._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // 🔥 REVIEW WORD
  const handleReview = async (id: string) => {
    setIsReviewing(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vocab/review/${id}`,
      {
        method: "POST",
      }
    );

    const updated = await res.json();

    setWords(words.map((w) => (w._id === id ? updated : w)));
    setIsReviewing(false);
  };

  const filteredWords =
    filter === "reviewed" ? words.filter((w) => w.reviewCount > 0) : words;

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Vocabulary <GradientText>Helper</GradientText>
            </h1>
            <p className="text-muted-foreground">AI-powered vocabulary builder for interviews</p>
          </div>
          <GlowButton
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Add Word
          </GlowButton>
        </div>

        {/* Loading Words */}
        {loading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner className="w-10 h-10" />
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                <GradientText>{words.length}</GradientText>
              </div>
              <p className="text-muted-foreground">Words saved</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-neon mb-2">
                {words.reduce((acc, w) => acc + (w.reviewCount || 0), 0)}
              </div>
              <p className="text-muted-foreground">Total reviews</p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-neon mb-2">
                {Math.round(
                  (words.filter((w) => w.reviewCount > 0).length / words.length) *
                    100
                ) || 0}
                %
              </div>
              <p className="text-muted-foreground">Review progress</p>
            </GlassCard>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === "all"
                ? "bg-gradient-to-r from-purple-neon to-blue-neon text-white"
                : "bg-white/10"
            }`}
          >
            All Words
          </button>

          <button
            onClick={() => setFilter("reviewed")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === "reviewed"
                ? "bg-gradient-to-r from-purple-neon to-blue-neon text-white"
                : "bg-white/10"
            }`}
          >
            Reviewed
          </button>
        </div>

        {/* Word List */}
        <div className="space-y-4">
          {filteredWords.map((word) => (
            <GlassCard key={word._id} className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{word.word}</h3>

                <p className="mt-3 text-purple-neon text-sm font-semibold">Definition</p>
                <p className="text-foreground">{word.definition}</p>

                <p className="mt-3 text-blue-neon text-sm font-semibold">Usage</p>
                <p className="italic text-foreground">{word.usage}</p>

                <p className="mt-3 text-cyan-accent text-sm font-semibold">Common Phrases</p>

                <div className="flex flex-wrap gap-2">
                  {word.examples?.map((example) => (
                    <span
                      key={example} // FIXED KEY WARNING
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <span>Reviewed {word.reviewCount} times</span>{" "}
                  • {new Date(word.lastReviewedAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <GlowButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReview(word._id)}
                    disabled={isReviewing}
                    className="flex items-center gap-2"
                  >
                    {isReviewing ? (
                      <>
                        <LoadingSpinner className="w-4 h-4" />
                        Reviewing...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4" />
                        Review
                      </>
                    )}
                  </GlowButton>

                  <button
                    onClick={() => handleDeleteWord(word._id)}
                    className="p-2 text-destructive hover:bg-destructive/20 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Add Word Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setNewWord({ word: "" });
          }}
          title="Add New Word"
          footer={
            <div className="flex justify-end gap-3">
              <GlowButton variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </GlowButton>
              <GlowButton variant="primary" onClick={handleAddWord}>
                Add
              </GlowButton>
            </div>
          }
        >
          <form className="space-y-4">
            <InputField
              label="Word"
              placeholder="Enter word"
              value={newWord.word}
              onChange={(e) => setNewWord({ word: e.target.value })}
              required
            />
          </form>
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
