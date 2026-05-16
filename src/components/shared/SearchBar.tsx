import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Spinner from '@/components/shared/Spinner'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  loading?: boolean
  className?: string
}

// Input com debounce de 300ms — só dispara onChange ao parar de digitar.
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  autoFocus = false,
  loading = false,
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sincroniza local quando a prop externa muda (reset, deep link).
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce 300ms.
  useEffect(() => {
    if (localValue === value) return
    const timer = setTimeout(() => onChange(localValue), 300)
    return () => clearTimeout(timer)
  }, [localValue, onChange, value])

  return (
    <div
      className={cn(
        'relative flex w-full items-center rounded-lg border border-ink-200 bg-background transition-colors focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/30 dark:border-ink-700',
        className,
      )}
    >
      <Search
        className="ml-3 h-4 w-4 shrink-0 text-gold-500 dark:text-gold-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Campo de busca"
        className="w-full bg-transparent px-3 py-3 text-sm text-ink-800 placeholder:text-ink-400 outline-none dark:text-ink-50"
      />
      {loading && (
        <span className="mr-2 inline-flex">
          <Spinner size="sm" />
        </span>
      )}
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('')
            onChange('')
          }}
          aria-label="Limpar busca"
          className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-gold-500/10 hover:text-gold-600 dark:text-ink-300 dark:hover:text-gold-400"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
