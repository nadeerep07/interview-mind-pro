"use client"

import type React from "react"
import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, GlowButton, GradientText, LoadingSpinner } from "@/components/animated-components"
import { InputField } from "@/components/input-field"
import { useAuth } from "@/lib/auth-context"
import { Plus, Trash2, RotateCw } from "lucide-react"
import { Modal } from "@/components/modal"

interface Word {
  id: string
  word: string
  definition: string
  usage: string
  examples: string[]
  reviewCount: number
  lastReviewedAt: string
}

export default function VocabHelperPage() {
  const { user } = useAuth()
  const [words, setWords] = useState<Word[]>([
    {
      id: "1",
      word: "Synergistic",
      definition:
        "Relating to the interaction of two or more elements that produce a combined effect greater than the sum of individual elements",
      usage: "Our team took a synergistic approach to solving the problem.",
      examples: ["Synergistic partnership", "Synergistic benefits", "Create synergistic value"],
      reviewCount: 3,
      lastReviewedAt: "2 days ago",
    },
    {
      id: "2",
      word: "Paradigm",
      definition: "A typical example or pattern of something; a model",
      usage: "This innovation represents a paradigm shift in the industry.",
      examples: ["Paradigm shift", "Business paradigm", "New paradigm"],
      reviewCount: 2,
      lastReviewedAt: "3 days ago",
    },
    {
      id: "3",
      word: "Proactive",
      definition: "Acting in anticipation of future problems, needs, or changes",
      usage: "I took a proactive approach to address the issue before it escalated.",
      examples: ["Proactive measures", "Proactive planning", "Proactive communication"],
      reviewCount: 5,
      lastReviewedAt: "Today",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newWord, setNewWord] = useState({ word: "", definition: "", usage: "" })
  const [filter, setFilter] = useState("all")
  const [isReviewing, setIsReviewing] = useState(false)

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault()
    if (newWord.word && newWord.definition) {
      const word: Word = {
        id: Date.now().toString(),
        word: newWord.word,
        definition: newWord.definition,
        usage: newWord.usage,
        examples: [],
        reviewCount: 0,
        lastReviewedAt: "Now",
      }
      setWords([word, ...words])
      setNewWord({ word: "", definition: "", usage: "" })
      setIsModalOpen(false)
    }
  }

  const handleDeleteWord = (id: string) => {
    setWords(words.filter((w) => w.id !== id))
  }

  const handleReview = async (id: string) => {
    setIsReviewing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setWords(words.map((w) => (w.id === id ? { ...w, reviewCount: w.reviewCount + 1, lastReviewedAt: "Now" } : w)))
    setIsReviewing(false)
  }

  const filteredWords = filter === "reviewed" ? words.filter((w) => w.reviewCount > 0) : words

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Vocabulary <GradientText>Helper</GradientText>
            </h1>
            <p className="text-muted-foreground">Build your professional vocabulary for interviews</p>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              <GradientText>{words.length}</GradientText>
            </div>
            <p className="text-muted-foreground">Words in your list</p>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-neon mb-2">
              {words.reduce((acc, w) => acc + w.reviewCount, 0)}
            </div>
            <p className="text-muted-foreground">Total reviews</p>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-neon mb-2">
              {Math.round((words.filter((w) => w.reviewCount > 0).length / words.length) * 100)}%
            </div>
            <p className="text-muted-foreground">Review progress</p>
          </GlassCard>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              filter === "all"
                ? "bg-gradient-to-r from-purple-neon to-blue-neon text-white"
                : "bg-white/10 text-foreground hover:bg-white/20"
            }`}
          >
            All Words
          </button>
          <button
            onClick={() => setFilter("reviewed")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              filter === "reviewed"
                ? "bg-gradient-to-r from-purple-neon to-blue-neon text-white"
                : "bg-white/10 text-foreground hover:bg-white/20"
            }`}
          >
            Reviewed
          </button>
        </div>

        {/* Word List */}
        <div className="space-y-4">
          {filteredWords.map((word) => (
            <GlassCard key={word.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{word.word}</h3>
                  <p className="text-purple-neon text-sm font-semibold mb-2">Definition</p>
                  <p className="text-foreground mb-4">{word.definition}</p>

                  <p className="text-blue-neon text-sm font-semibold mb-2">Usage Example</p>
                  <p className="text-foreground italic mb-4">{word.usage}</p>

                  <p className="text-cyan-accent text-sm font-semibold mb-2">Common Phrases</p>
                  <div className="flex flex-wrap gap-2">
                    {word.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Reviewed {word.reviewCount} times</span>
                  <span>Last: {word.lastReviewedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GlowButton
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleReview(word.id)}
                    disabled={isReviewing}
                  >
                    {isReviewing ? (
                      <>
                        <LoadingSpinner className="w-4 h-4" />
                        <span>Reviewing...</span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4" />
                        <span>Review</span>
                      </>
                    )}
                  </GlowButton>
                  <button
                    onClick={() => handleDeleteWord(word.id)}
                    className="p-2 hover:bg-destructive/20 rounded-lg transition-colors text-destructive"
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
            setIsModalOpen(false)
            setNewWord({ word: "", definition: "", usage: "" })
          }}
          title="Add New Word"
          footer={
            <div className="flex gap-3 justify-end">
              <GlowButton variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </GlowButton>
              <GlowButton
                variant="primary"
                onClick={(e) => {
                  e.preventDefault()
                  handleAddWord(e as any)
                }}
              >
                Add Word
              </GlowButton>
            </div>
          }
        >
          <form className="space-y-4">
            <InputField
              label="Word"
              placeholder="Enter word"
              value={newWord.word}
              onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
              required
            />
            <InputField
              label="Definition"
              placeholder="Enter definition"
              value={newWord.definition}
              onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
              required
            />
            <InputField
              label="Usage Example"
              placeholder="Enter usage example"
              value={newWord.usage}
              onChange={(e) => setNewWord({ ...newWord, usage: e.target.value })}
            />
          </form>
        </Modal>
      </div>
    </ProtectedLayout>
  )
}
