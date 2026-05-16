import { motion } from 'framer-motion'
import { fadeInUp, useReducedMotion } from '@/lib/animations'
import GoldDivider from '@/components/shared/GoldDivider'

interface PagePlaceholderProps {
  pageName: string
  moduleNumber: number
}

// Placeholder padrão usado em todas as páginas até serem implementadas.
export default function PagePlaceholder({ pageName, moduleNumber }: PagePlaceholderProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reduced ? undefined : fadeInUp}
      className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 py-20 text-center"
    >
      <h1 className="font-serif text-5xl tracking-tight text-ink-800 dark:text-ink-50 sm:text-6xl">
        {pageName}
      </h1>
      <p className="font-serif italic text-gold-500 dark:text-gold-400">
        Presença que marca.
      </p>
      <GoldDivider className="my-4 w-32" />
      <p className="font-sans text-sm text-ink-500 dark:text-ink-300">
        Página em desenvolvimento — Implementação no Módulo {moduleNumber}
      </p>
    </motion.div>
  )
}
