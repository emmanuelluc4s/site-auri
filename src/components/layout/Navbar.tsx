import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

const NAV_LINKS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Início' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/promocoes', label: 'Promoções' },
  { to: '/lancamentos', label: 'Lançamentos' },
  { to: '/avaliacoes', label: 'Avaliações' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/fale-conosco', label: 'Fale Conosco' },
]

// Hook interno: detecta direção do scroll para o hide-on-scroll.
function useScrollDirection() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let lastY = window.scrollY
    function onScroll() {
      const currentY = window.scrollY
      if (currentY < 80) setVisible(true)
      else if (currentY > lastY + 4) setVisible(false)
      else if (currentY < lastY - 4) setVisible(true)
      lastY = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return visible
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const visible = useScrollDirection()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? 0 : -120 }}
      transition={reduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-gold-500/20 dark:border-gold-400/20 bg-ink-50/95 dark:bg-ink-900/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo circular */}
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="AURI — ir para a página inicial"
        >
          <img
            src="/logo.jpeg"
            alt="AURI"
            className="aspect-square h-12 w-12 rounded-full object-contain ring-1 ring-gold-500/40"
          />
          <span className="hidden font-serif text-xl tracking-wide text-ink-800 dark:text-ink-50 sm:inline">
            AURI
          </span>
        </Link>

        {/* Links desktop */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300',
                  isActive
                    ? 'text-gold-600 dark:text-gold-400'
                    : 'text-ink-500 dark:text-ink-300 hover:text-gold-600 dark:hover:text-gold-400',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-px bg-gold-500 dark:bg-gold-400 transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(prev => !prev)}
            aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
            aria-expanded={searchOpen}
            className="rounded-md p-2 text-ink-500 transition-colors duration-300 hover:bg-gold-500/10 hover:text-gold-600 dark:text-ink-300 dark:hover:bg-gold-400/10 dark:hover:text-gold-400"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="rounded-md p-2 text-gold-600 transition-all duration-400 hover:bg-gold-500/10 dark:text-gold-400 dark:hover:bg-gold-400/10"
          >
            {theme === 'dark'
              ? <Sun className="h-5 w-5" aria-hidden="true" />
              : <Moon className="h-5 w-5" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="rounded-md p-2 text-gold-600 transition-colors duration-300 hover:bg-gold-500/10 dark:text-gold-400 dark:hover:bg-gold-400/10 lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Busca inline (query real no Módulo 5) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.25 }}
            className="overflow-hidden border-t border-gold-500/20 dark:border-gold-400/20 bg-ink-50/95 dark:bg-ink-900/95"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              <label htmlFor="navbar-search" className="sr-only">Buscar produtos</label>
              <input
                id="navbar-search"
                type="search"
                placeholder="Buscar produtos…"
                className="w-full rounded-md border border-gold-500/30 bg-transparent px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none focus-visible:border-gold-500 focus-visible:ring-1 focus-visible:ring-gold-500 dark:text-ink-50 dark:placeholder:text-ink-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer mobile (sempre escuro) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={reduced ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: '100%' }}
              transition={reduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85%] border-l border-gold-400/30 bg-ink-900 p-8 lg:hidden"
              role="dialog"
              aria-label="Menu de navegação"
            >
              <div className="mb-8 flex items-center justify-between">
                <img
                  src="/logo.jpeg"
                  alt="AURI"
                  className="h-12 w-12 rounded-full object-contain ring-1 ring-gold-400/50"
                />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-md p-2 text-gold-400 hover:bg-gold-400/10"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
                {NAV_LINKS.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md border-l-2 px-4 py-3 font-serif text-xl transition-colors duration-300',
                        isActive
                          ? 'border-gold-400 bg-gold-400/10 text-gold-400'
                          : 'border-transparent text-ink-50 hover:border-gold-400/40 hover:bg-gold-400/5 hover:text-gold-400',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <p className="mt-10 font-serif italic text-sm text-gold-400/80">
                Presença que marca.
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
