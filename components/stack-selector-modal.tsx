"use client";

import { useState } from "react";

export function StackSelectorModal({ isOpen, onSubmit }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  const stacks = [
    "Flutter", "Dart", "Firebase", "React", "Next.js",
    "Node.js", "Express", "PostgreSQL", "MongoDB",
    "Supabase", "TypeScript", "Kotlin", "Java"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white text-black p-6 rounded-xl w-[400px] space-y-5 shadow-lg">
        
        <h2 className="text-xl font-bold">Choose Your Tech Stack</h2>
        <p className="text-sm text-gray-600">Select all technologies you work with.</p>

        <div className="flex flex-wrap gap-2">
          {stacks.map((s) => {
            const active = selected.includes(s);

            return (
              <button
                key={s}
                onClick={() =>
                  setSelected(prev =>
                    prev.includes(s)
                      ? prev.filter(x => x !== s)
                      : [...prev, s]
                  )
                }
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  active
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-400 text-black"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <button
          className="w-full bg-black text-white py-2 rounded-lg font-semibold"
          onClick={() => onSubmit(selected)}
          disabled={selected.length === 0}
        >
          Save
        </button>
      </div>
    </div>
  );
}
