"use client"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleLineChartProps {
  data: DataPoint[]
  title?: string
  height?: number
}

export function SimpleLineChart({ data, title, height = 300 }: SimpleLineChartProps) {
  if (!data || data.length === 0) return null

  // Sanitize values
  const safeData = data.map((d) => ({
    ...d,
    value: Number.isFinite(d.value) ? d.value : 0,
  }))

  const maxValue = Math.max(...safeData.map((d) => d.value), 1)
  const minValue = Math.min(...safeData.map((d) => d.value), 0)
  const range = maxValue - minValue || 1

  const pointWidth = safeData.length > 1 ? 100 / (safeData.length - 1) : 100

  const points = safeData.map((d, i) => {
    const x = i * pointWidth
    const rawY = ((maxValue - d.value) / range) * 100
    const y = Number.isFinite(rawY) ? rawY : 0
    return { x, y, ...d }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")

  return (
    <div className="space-y-4">
      {title && <h3 className="font-semibold text-foreground">{title}</h3>}
      <svg width="100%" height={height} viewBox="0 0 100 100" className="text-purple-neon">
        <g>
          {/* Grid */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="url(#gradient)" strokeWidth="2" />

          {/* Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="currentColor" />
          ))}
        </g>
      </svg>
    </div>
  )
}

interface SimpleBarChartProps {
  data: DataPoint[]
  title?: string
  height?: number
}

export function SimpleBarChart({ data, title, height = 300 }: SimpleBarChartProps) {
  if (!data || data.length === 0) return null

  // Sanitize values
  const safeData = data.map((d) => ({
    ...d,
    value: Number.isFinite(d.value) ? d.value : 0,
  }))

  const maxValue = Math.max(...safeData.map((d) => d.value), 1)
  const barWidth = 100 / safeData.length
  const colors = ["#a855f7", "#3b82f6", "#06b6d4", "#8b5cf6"]

  return (
    <div className="space-y-4">
      {title && <h3 className="font-semibold text-foreground">{title}</h3>}
      <svg width="100%" height={height} viewBox="0 0 100 100">
        <g>
          {safeData.map((d, i) => {
            const rawHeight = (d.value / maxValue) * 80
            const barHeight = Number.isFinite(rawHeight) ? rawHeight : 0

            const x = i * barWidth + barWidth * 0.1
            const width = barWidth * 0.8
            const y = 100 - barHeight

            const color = d.color || colors[i % colors.length]

            return (
              <rect
                key={i}
                x={x}
                y={Number.isFinite(y) ? y : 0}
                width={width}
                height={Number.isFinite(barHeight) ? barHeight : 0}
                fill={color}
                opacity="0.8"
              />
            )
          })}
        </g>
      </svg>

      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
        {safeData.map((d, i) => (
          <div key={i} className="text-center truncate">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}
