import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeInUp, useReducedMotion } from '@/lib/animations'

type Align = 'left' | 'center'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: Align
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'left',
  className,
  as: Tag = 'h2',
}: SectionTitleProps) {
  const reduced = useReducedMotion()
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={reduced ? undefined : fadeInUp}
      className={cn('flex flex-col gap-3', alignClass, className)}
    >
      <Tag className="font-serif text-3xl tracking-tight text-ink-800 dark:text-ink-50 sm:text-4xl">
        {title}
      </Tag>

      <span
        className={cn(
          'block h-px w-16 bg-gradient-to-r from-gold-500 to-gold-500/0 dark:from-gold-400 dark:to-gold-400/0',
          align === 'center' && 'mx-auto bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0 dark:via-gold-400 dark:from-gold-400/0 dark:to-gold-400/0',
        )}
        aria-hidden="true"
      />

      {subtitle && (
        <p className="font-sans text-sm text-ink-500 dark:text-ink-300 sm:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
