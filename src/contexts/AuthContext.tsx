import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AdminUser } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  adminUser: AdminUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isOwner: boolean
  isEditor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // Sessão inicial
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        void fetchAdminUser(data.session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Reage a login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
        if (nextSession?.user) {
          void fetchAdminUser(nextSession.user.id)
        } else {
          setAdminUser(null)
          setLoading(false)
        }
      },
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  async function fetchAdminUser(userId: string) {
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setAdminUser((data as AdminUser | null) ?? null)
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      adminUser,
      loading,
      signIn,
      signOut,
      isOwner: adminUser?.role === 'owner',
      isEditor: adminUser?.role === 'owner' || adminUser?.role === 'editor',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
