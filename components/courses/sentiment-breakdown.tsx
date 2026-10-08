import { SENTIMENT_COLORS, SENTIMENT_LABELS } from '@/lib/sentiment/labels'

// No hooks, so it renders in server components (teacher view) and client components alike.

interface SentimentBreakdownProps {
  /** One value per star rating, index 0 = 1 star */
  values: number[]
  /** How to print each value next to its bar */
  format?: (value: number) => string
}

export function SentimentBreakdown({
  values,
  format = (value) => `${Math.round(value * 100)}%`,
}: SentimentBreakdownProps) {
  const max = Math.max(...values, 0)

  return (
    <ul className="space-y-2">
      {SENTIMENT_LABELS.map((label, index) => {
        const value = values[index] ?? 0
        return (
          <li key={label} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="text-gray-300">{label}</span>
            <div className="h-2 rounded-full bg-purple-500/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${SENTIMENT_COLORS[index]}`}
                style={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-right text-gray-400 tabular-nums">{format(value)}</span>
          </li>
        )
      })}
    </ul>
  )
}
