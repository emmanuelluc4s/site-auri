import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/toast'
import { setSEO } from '@/lib/seo'
import { useReducedMotion } from '@/lib/animations'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GoldDivider from '@/components/shared/GoldDivider'

export default function AdminLogin() {
  const reduced = useReducedMotion()
  const { user, signIn, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Login Admin — AURI' })
  }, [])

  useEffect(() => {
    if (!authLoading && user) navigate('/admin', { replace: true })
  }, [user, authLoading, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast('Preencha e-mail e senha', 'error')
      return
    }
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      toast('Credenciais inválidas. Verifique e tente novamente.', 'error')
      return
    }
    toast('Bem-vindo de volta!', 'success')
    navigate('/admin', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-500 opacity-5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold-500 opacity-5 blur-3xl" />
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-gold-500/20 bg-ink-800 p-8 shadow-soft-lg md:p-10">
          <div className="mb-8 text-center">
            <img
              src="/logo.jpeg"
              alt="AURI"
              className="mx-auto mb-4 h-20 w-20 rounded-full ring-1 ring-gold-400/40"
            />
            <h1 className="mb-1 font-serif text-3xl text-gold-400">AURI</h1>
            <p className="text-sm text-ink-300">Painel Administrativo</p>
            <GoldDivider className="mx-auto mt-4 w-16" withDiamond={false} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-ink-300">E-mail</Label>
              <div className="relative mt-1.5">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  className="border-ink-700 bg-ink-900 pl-10 text-ink-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-ink-300">Senha</Label>
              <div className="relative mt-1.5">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  required
                  className="border-ink-700 bg-ink-900 pl-10 pr-10 text-ink-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-gold-400"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                    : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={submitting || authLoading}
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-ink-400 transition-colors hover:text-gold-400">
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
