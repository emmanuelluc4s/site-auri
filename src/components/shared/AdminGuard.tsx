import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/toast'
import Spinner from '@/components/shared/Spinner'

interface AdminGuardProps {
  children: ReactNode
  requireOwner?: boolean
}

export default function AdminGuard({ children, requireOwner = false }: AdminGuardProps) {
  const { user, adminUser, loading, isOwner } = useAuth()
  const { toast } = useToast()
  const location = useLocation()

  useEffect(() => {
    if (loading) return
    if (user && !adminUser) {
      toast('Você não tem permissão para acessar o painel.', 'error')
    } else if (requireOwner && adminUser && !isOwner) {
      toast('Apenas o owner pode acessar esta página.', 'error')
    }
  }, [loading, user, adminUser, isOwner, requireOwner, toast])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 dark:bg-ink-950">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />
  }

  if (requireOwner && !isOwner) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
