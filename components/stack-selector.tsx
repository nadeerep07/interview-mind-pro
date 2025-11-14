"use client";

interface StackSelectorProps {
  value: string[];
  onChange: (stacks: string[]) => void;
}

const ALL_STACKS = [
  "React",
  "Node.js",
  "Next.js",
  "Flutter",
  "Python",
  "Java",
  "Kotlin",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
];

export default function StackSelector({ value, onChange }: StackSelectorProps) {
  const handleAdd = (stack: string) => {
    if (!value.includes(stack)) onChange([...value, stack]);
  };

  const handleRemove = (stack: string) => {
    onChange(value.filter((s) => s !== stack));
  };

  return (
    <div className="space-y-3">
      <label className="font-semibold text-foreground">Your Tech Stack</label>

      {/* Stack Chips */}
      <div className="flex flex-wrap gap-2">
        {value.length === 0 && (
          <p className="text-sm text-muted-foreground">No stacks selected</p>
        )}

        {value.map((stack) => (
          <div
            key={stack}
            className="px-3 py-1 bg-purple-600/20 border border-purple-500/40 rounded-full text-purple-300 flex items-center gap-2"
          >
            {stack}
            <button
              onClick={() => handleRemove(stack)}
              className="text-red-400 text-sm hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Stack Dropdown */}
      <select
        className="w-full bg-black border border-purple-500/40 p-3 rounded-lg text-white"
        onChange={(e) => handleAdd(e.target.value)}
      >
        <option value="">Add Stack</option>

        {ALL_STACKS.filter((s) => !value.includes(s)).map((stack) => (
          <option key={stack} value={stack}>
            {stack}
          </option>
        ))}
      </select>
    </div>
  );
}
