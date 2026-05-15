import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn, prefersReducedMotion } from '@/lib/utils'

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
      // Sempre mostrar próximo ao topo
      if (currentY < 80) {
        setVisible(true)
      } else if (currentY > lastY + 4) {
        setVisible(false) // descendo
      } else if (currentY < lastY - 4) {
        setVisible(true) // subindo
      }
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
  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? 0 : -96 }}
      transition={reduced ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="AURI — ir para a página inicial">
          <img src="/logo-placeholder.svg" alt="" className="h-8 w-auto" />
          <span className="sr-only">AURI</span>
        </Link>

        {/* Links desktop */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Navegação principal">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              {link.label}
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
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {theme === 'dark'
              ? <Sun className="h-5 w-5" aria-hidden="true" />
              : <Moon className="h-5 w-5" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Input de busca inline (placeholder funcional — query real no Módulo 5) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-background"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              <label htmlFor="navbar-search" className="sr-only">Buscar produtos</label>
              <input
                id="navbar-search"
                type="search"
                placeholder="Buscar produtos…"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={reduced ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: '100%' }}
              transition={reduced ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
              className="fixed right-0 top-0 z-50 h-full w-72 max-w-[85%] border-l border-border bg-background p-6 lg:hidden"
              role="dialog"
              aria-label="Menu de navegação"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-md p-2 hover:bg-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex flex-col gap-2" aria-label="Navegação mobile">
                {NAV_LINKS.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-3 py-2 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
