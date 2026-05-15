import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface AdminGuardProps {
  children: ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, adminUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary"
          role="status"
          aria-label="Carregando"
        />
      </div>
    )
  }

  if (!user || !adminUser) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
