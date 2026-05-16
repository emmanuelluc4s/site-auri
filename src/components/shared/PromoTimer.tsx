import { useEffect, useRef, useState } from 'react'
import { Clock } from 'lucide-react'

interface PromoTimerProps {
  endsAt: string
  onExpire?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calculateTimeLeft(endsAt: string): TimeLeft {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function PromoTimer({ endsAt, onExpire }: PromoTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endsAt))
  const expiredFired = useRef(false)

  useEffect(() => {
    expiredFired.current = false
    setTimeLeft(calculateTimeLeft(endsAt))

    const interval = setInterval(() => {
      const next = calculateTimeLeft(endsAt)
      setTimeLeft(next)
      if (next.expired && !expiredFired.current) {
        expiredFired.current = true
        onExpire?.()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endsAt, onExpire])

  if (timeLeft.expired) {
    return (
      <p className="inline-flex items-center gap-2 rounded-md bg-ink-100 px-3 py-2 text-sm text-ink-500 dark:bg-ink-800 dark:text-ink-300">
        <Clock className="h-4 w-4" aria-hidden="true" />
        Promoção encerrada
      </p>
    )
  }

  const blocks: Array<{ label: string; value: number }> = [
    { label: 'Dias',   value: timeLeft.days },
    { label: 'Horas',  value: timeLeft.hours },
    { label: 'Min',    value: timeLeft.minutes },
    { label: 'Seg',    value: timeLeft.seconds },
  ]

  return (
    <div>
      <p className="mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">
        <Clock className="h-3.5 w-3.5 text-gold-500 dark:text-gold-400" aria-hidden="true" />
        Promoção termina em
      </p>
      <div className="flex items-stretch gap-2">
        {blocks.map((block, idx) => (
          <div key={block.label} className="flex items-stretch gap-2">
            <div className="flex min-w-[3.25rem] flex-col items-center rounded-md bg-ink-800 px-3 py-2 text-gold-400 ring-1 ring-gold-400/30 dark:bg-ink-700">
              <span
                className="font-serif text-xl font-semibold leading-none tabular-nums"
                aria-label={`${block.value} ${block.label}`}
              >
                {pad(block.value)}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.14em] text-gold-400/70">
                {block.label}
              </span>
            </div>
            {idx < blocks.length - 1 && (
              <span
                className="self-center text-lg font-semibold text-gold-500 dark:text-gold-400"
                aria-hidden="true"
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
