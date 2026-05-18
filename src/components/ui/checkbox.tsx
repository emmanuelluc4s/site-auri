import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <label
      className={cn(
        'relative inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border transition-colors',
        checked
          ? 'border-gold-500 bg-gold-500 text-ink-900'
          : 'border-ink-300 bg-background hover:border-gold-500/60 dark:border-ink-600',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onCheckedChange(e.target.checked)}
        className="sr-only"
        {...props}
      />
      {checked && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
    </label>
  ),
)
Checkbox.displayName = 'Checkbox'
