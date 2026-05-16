import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StockIndicatorProps {
  stock: number
}

// Mensagens por faixa de estoque (gera urgência só quando ≤ 10).
export default function StockIndicator({ stock }: StockIndicatorProps) {
  if (stock <= 0 || stock > 10) return null

  const urgent = stock <= 3
  let message: string
  if (stock === 1) message = 'Última unidade disponível!'
  else if (urgent) message = `Apenas ${stock} unidades disponíveis!`
  else message = `Restam ${stock} unidades em estoque`

  return (
    <p
      className={cn(
        'mt-3 inline-flex items-center gap-1.5 text-sm font-medium',
        urgent
          ? 'text-gold-600 dark:text-gold-400'
          : 'text-ink-600 dark:text-ink-300',
      )}
    >
      {urgent && <Flame className="h-4 w-4" aria-hidden="true" />}
      {message}
    </p>
  )
}
