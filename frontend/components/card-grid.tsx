"use client"

import type React from "react"

interface CardGridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
}

export function CardGrid({ children, cols = 3 }: CardGridProps) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return <div className={`grid ${colsClass[cols]} gap-6`}>{children}</div>
}
