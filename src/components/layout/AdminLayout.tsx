import type { ReactNode } from 'react'

// Placeholder simples — layout completo do painel será implementado no Módulo 9.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
          <span className="font-semibold">AURI · Admin</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6">{children}</main>
    </div>
  )
}
