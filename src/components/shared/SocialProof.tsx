import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { getDailyRandom } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

interface SocialProofProps {
  productId: string
}

// "X pessoas viram este produto hoje" — número estável por dia,
// muda no dia seguinte (seed = productId + data).
export default function SocialProof({ productId }: SocialProofProps) {
  const target = getDailyRandom(productId, 15, 90)
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(target)
      return
    }
    // Contagem de 0 → target em ~600ms.
    let raf = 0
    const start = performance.now()
    const duration = 600
    function step(now: number) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, reduced])

  return (
    <p className="inline-flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-300">
      <Eye className="h-4 w-4 text-gold-500 dark:text-gold-400" aria-hidden="true" />
      <span className="font-semibold tabular-nums text-gold-600 dark:text-gold-400">
        {display}
      </span>
      <span>pessoas viram este produto hoje</span>
    </p>
  )
}
