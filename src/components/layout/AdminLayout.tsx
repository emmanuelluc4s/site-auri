import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ExternalLink,
  FileText,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Package,
  Star,
  Store,
  Sun,
  Tag,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/components/ui/toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, getInitials } from '@/lib/utils'

interface MenuItem {
  to: string
  icon: LucideIcon
  label: string
  ownerOnly?: boolean
}

const MENU: MenuItem[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/produtos', icon: Package, label: 'Produtos' },
  { to: '/admin/categorias', icon: Tag, label: 'Categorias' },
  { to: '/admin/avaliacoes', icon: Star, label: 'Avaliações' },
  { to: '/admin/comentarios', icon: MessageSquare, label: 'Comentários' },
  { to: '/admin/banners', icon: ImageIcon, label: 'Banners' },
  { to: '/admin/conteudo', icon: FileText, label: 'Conteúdo' },
  { to: '/admin/loja', icon: Store, label: 'Loja' },
  { to: '/admin/usuarios', icon: Users, label: 'Usuários', ownerOnly: true },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { adminUser, isOwner, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleMenu = MENU.filter(item => !item.ownerOnly || isOwner)

  async function handleSignOut() {
    await signOut()
    toast('Sessão encerrada', 'success')
    navigate('/admin/login', { replace: true })
  }

  function isItemActive(to: string) {
    if (to === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(to)
  }

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-900 text-ink-50 lg:flex">
        <div className="border-b border-ink-800 p-6">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt=""
              className="h-10 w-10 rounded-full ring-1 ring-gold-400/40"
            />
            <div>
              <p className="font-serif text-xl text-gold-400">AURI</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Painel Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Menu do painel admin">
          {visibleMenu.map(item => {
            const active = isItemActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-gold-500 font-medium text-ink-900'
                    : 'text-ink-300 hover:bg-ink-800 hover:text-gold-400',
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="space-y-1.5 border-t border-ink-800 p-4">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Avatar className="h-9 w-9 bg-gold-500">
              <AvatarFallback className="bg-gold-500 font-bold text-ink-900">
                {getInitials(adminUser?.name ?? 'A')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{adminUser?.name ?? 'Admin'}</p>
              <p className="text-xs capitalize text-ink-400">{adminUser?.role}</p>
            </div>
          </div>

          <a href="/" target="_blank" rel="noopener noreferrer" className="block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-ink-300 hover:bg-ink-800 hover:text-gold-400"
            >
              <ExternalLink className="h-4 w-4" />
              Ver site
            </Button>
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start text-ink-300 hover:bg-ink-800 hover:text-gold-400"
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-danger hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Header mobile */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-ink-800 bg-ink-900 text-ink-50 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/logo.jpeg"
              alt=""
              className="h-8 w-8 rounded-full ring-1 ring-gold-400/40"
            />
            <span className="font-serif text-gold-400">AURI Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="rounded-md p-1.5 text-ink-50 hover:bg-ink-800"
          >
            {mobileOpen
              ? <X className="h-5 w-5" aria-hidden="true" />
              : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-ink-800"
              aria-label="Menu mobile do admin"
            >
              <div className="space-y-1 p-4">
                {visibleMenu.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors',
                      isItemActive(item.to)
                        ? 'bg-gold-500 text-ink-900'
                        : 'text-ink-200 hover:bg-ink-800',
                    )}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2 border-ink-800" />
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-ink-200 hover:bg-ink-800"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-danger hover:bg-ink-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 pt-16 lg:pt-0">
        <div className="mx-auto max-w-7xl p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
