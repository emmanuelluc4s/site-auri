import { useEffect, useMemo, useState } from 'react'
import { cn, colorToHex } from '@/lib/utils'
import type { ProductVariant } from '@/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onSelect: (variant: ProductVariant | null) => void
}

function uniqueValues<T extends string | null>(
  variants: ProductVariant[],
  key: 'color' | 'size',
): T[] {
  const set = new Set<string>()
  for (const v of variants) {
    const value = v[key]
    if (value) set.add(value)
  }
  return Array.from(set) as T[]
}

function stockForColor(variants: ProductVariant[], color: string): number {
  return variants
    .filter(v => v.color === color)
    .reduce((sum, v) => sum + (v.stock ?? 0), 0)
}

function stockForSize(variants: ProductVariant[], size: string, color: string | null): number {
  return variants
    .filter(v => v.size === size && (color === null || v.color === color))
    .reduce((sum, v) => sum + (v.stock ?? 0), 0)
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  const colors = useMemo(() => uniqueValues<string>(variants, 'color'), [variants])
  const sizes = useMemo(() => uniqueValues<string>(variants, 'size'), [variants])

  const hasColors = colors.length > 0
  const hasSizes = sizes.length > 0

  const [color, setColor] = useState<string | null>(selectedVariant?.color ?? null)
  const [size, setSize] = useState<string | null>(selectedVariant?.size ?? null)

  // Sincroniza local quando a variante externa muda.
  useEffect(() => {
    setColor(selectedVariant?.color ?? null)
    setSize(selectedVariant?.size ?? null)
  }, [selectedVariant])

  // Quando seleção muda, propaga a variante encontrada (ou null).
  useEffect(() => {
    const match = variants.find(v => {
      const colorMatch = !hasColors || v.color === color
      const sizeMatch = !hasSizes || v.size === size
      return colorMatch && sizeMatch
    })
    onSelect(match ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, size])

  return (
    <div className="flex flex-col gap-6">
      {hasColors && (
        <section>
          <header className="mb-3 flex items-baseline justify-between">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">
              Cor
            </h3>
            {color && (
              <span className="text-sm text-ink-700 dark:text-ink-200">{color}</span>
            )}
          </header>
          <ul className="flex flex-wrap gap-3">
            {colors.map(c => {
              const hex = colorToHex(c)
              const isActive = color === c
              const stock = stockForColor(variants, c)
              const soldOut = stock === 0
              return (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => setColor(c)}
                    title={c}
                    aria-label={`Cor ${c}${soldOut ? ' (esgotado)' : ''}`}
                    aria-pressed={isActive}
                    className={cn(
                      'relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-background transition-all',
                      isActive
                        ? 'ring-gold-500 dark:ring-gold-400'
                        : 'ring-ink-200 dark:ring-ink-700 hover:ring-gold-400/60',
                    )}
                    style={hex ? { backgroundColor: hex } : undefined}
                  >
                    {!hex && (
                      <span className="flex h-full w-full items-center justify-center bg-ink-100 px-1 text-[10px] font-medium text-ink-700 dark:bg-ink-700 dark:text-ink-100">
                        {c.slice(0, 3)}
                      </span>
                    )}
                    {soldOut && (
                      <span
                        className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_46%,#B23A48_47%,#B23A48_53%,transparent_54%)]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {hasSizes && (
        <section>
          <header className="mb-3 flex items-baseline justify-between">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">
              Tamanho
            </h3>
            {size && (
              <span className="text-sm text-ink-700 dark:text-ink-200">{size}</span>
            )}
          </header>
          <ul className="flex flex-wrap gap-2">
            {sizes.map(s => {
              const isActive = size === s
              const stock = stockForSize(variants, s, color)
              const soldOut = stock === 0
              return (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setSize(s)}
                    aria-label={`Tamanho ${s}${soldOut ? ' (esgotado)' : ''}`}
                    aria-pressed={isActive}
                    disabled={soldOut}
                    className={cn(
                      'relative min-w-[3rem] rounded-md border px-4 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'border-gold-500 bg-gold-500/10 text-gold-700 dark:border-gold-400 dark:text-gold-400'
                        : 'border-ink-200 text-ink-700 hover:border-gold-500 hover:text-gold-600 dark:border-ink-700 dark:text-ink-200 dark:hover:text-gold-400',
                      soldOut && 'cursor-not-allowed text-ink-400 line-through dark:text-ink-500',
                    )}
                  >
                    {s}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
