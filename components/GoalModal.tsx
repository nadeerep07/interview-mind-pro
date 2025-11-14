"use client"

import { useState } from "react"
import { GlowButton } from "@/components/animated-components"

interface GoalModalProps {
  open: boolean
  onClose: () => void
  onSave: (goal: { title: string; type: string; target: number; deadline: string }) => void
}

export function GoalModal({ open, onClose, onSave }: GoalModalProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("score")
  const [target, setTarget] = useState("")
  const [deadline, setDeadline] = useState("")

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-xl w-96 border border-white/20">
        <h2 className="text-xl font-bold mb-4 text-white">Set New Goal</h2>

        <input
          className="w-full bg-black/20 p-3 rounded-lg mb-3"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full bg-black/20 p-3 rounded-lg mb-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="score">Improve Score</option>
          <option value="sessions">Increase Sessions</option>
          <option value="streak">Increase Streak</option>
          <option value="vocab">Vocabulary Goal</option>
        </select>

        <input
          className="w-full bg-black/20 p-3 rounded-lg mb-3"
          type="number"
          placeholder="Target Value"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <input
          className="w-full bg-black/20 p-3 rounded-lg mb-4"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <GlowButton
          variant="primary"
          className="w-full"
          onClick={() => {
            onSave({ title, type,   target: Number(target), deadline })
            onClose()
          }}
        >
          Save Goal
        </GlowButton>

        <button className="text-gray-300 w-full mt-3" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
