import { Suspense, lazy, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ui/toast'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdminLayout from '@/components/layout/AdminLayout'
import AdminGuard from '@/components/shared/AdminGuard'

import WhatsAppButton from '@/components/shared/WhatsAppButton'
import InstagramButton from '@/components/shared/InstagramButton'
import ScrollToTop from '@/components/shared/ScrollToTop'
import Spinner from '@/components/shared/Spinner'

// Home não é lazy — é a primeira página que o usuário vê.
import Home from '@/pages/Home'

// Demais páginas públicas: lazy (carregam sob demanda).
const Catalogo    = lazy(() => import('@/pages/Catalogo'))
const Categoria   = lazy(() => import('@/pages/Categoria'))
const Produto     = lazy(() => import('@/pages/Produto'))
const Promocoes   = lazy(() => import('@/pages/Promocoes'))
const Lancamentos = lazy(() => import('@/pages/Lancamentos'))
const Avaliacoes  = lazy(() => import('@/pages/Avaliacoes'))
const QuemSomos   = lazy(() => import('@/pages/QuemSomos'))
const FaleConosco = lazy(() => import('@/pages/FaleConosco'))

// Páginas do painel admin: todas lazy (só carregam após login).
const AdminLogin       = lazy(() => import('@/pages/admin/Login'))
const AdminDashboard   = lazy(() => import('@/pages/admin/Dashboard'))
const AdminProducts    = lazy(() => import('@/pages/admin/Products'))
const AdminProductForm = lazy(() => import('@/pages/admin/ProductForm'))
const AdminCategories  = lazy(() => import('@/pages/admin/Categories'))
const AdminReviews     = lazy(() => import('@/pages/admin/Reviews'))
const AdminComments    = lazy(() => import('@/pages/admin/Comments'))
const AdminBanners     = lazy(() => import('@/pages/admin/Banners'))
const AdminContent     = lazy(() => import('@/pages/admin/Content'))
const AdminStoreInfo   = lazy(() => import('@/pages/admin/StoreInfo'))
const AdminUsers       = lazy(() => import('@/pages/admin/AdminUsers'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <InstagramButton />
      <ScrollToTop />
    </div>
  )
}

function ProtectedAdmin({ children, requireOwner = false }: { children: ReactNode; requireOwner?: boolean }) {
  return (
    <AdminGuard requireOwner={requireOwner}>
      <AdminLayout>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </AdminLayout>
    </AdminGuard>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/catalogo" element={<PublicLayout><Catalogo /></PublicLayout>} />
              <Route path="/categoria/:slug" element={<PublicLayout><Categoria /></PublicLayout>} />
              <Route path="/produto/:slug" element={<PublicLayout><Produto /></PublicLayout>} />
              <Route path="/promocoes" element={<PublicLayout><Promocoes /></PublicLayout>} />
              <Route path="/lancamentos" element={<PublicLayout><Lancamentos /></PublicLayout>} />
              <Route path="/avaliacoes" element={<PublicLayout><Avaliacoes /></PublicLayout>} />
              <Route path="/quem-somos" element={<PublicLayout><QuemSomos /></PublicLayout>} />
              <Route path="/fale-conosco" element={<PublicLayout><FaleConosco /></PublicLayout>} />

              {/* Login admin (sem guard) */}
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminLogin />
                  </Suspense>
                }
              />

              {/* Rotas admin protegidas */}
              <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
              <Route path="/admin/produtos" element={<ProtectedAdmin><AdminProducts /></ProtectedAdmin>} />
              <Route path="/admin/produtos/novo" element={<ProtectedAdmin><AdminProductForm /></ProtectedAdmin>} />
              <Route path="/admin/produtos/:id" element={<ProtectedAdmin><AdminProductForm /></ProtectedAdmin>} />
              <Route path="/admin/categorias" element={<ProtectedAdmin><AdminCategories /></ProtectedAdmin>} />
              <Route path="/admin/avaliacoes" element={<ProtectedAdmin><AdminReviews /></ProtectedAdmin>} />
              <Route path="/admin/comentarios" element={<ProtectedAdmin><AdminComments /></ProtectedAdmin>} />
              <Route path="/admin/banners" element={<ProtectedAdmin><AdminBanners /></ProtectedAdmin>} />
              <Route path="/admin/conteudo" element={<ProtectedAdmin><AdminContent /></ProtectedAdmin>} />
              <Route path="/admin/loja" element={<ProtectedAdmin><AdminStoreInfo /></ProtectedAdmin>} />
              <Route path="/admin/usuarios" element={<ProtectedAdmin requireOwner><AdminUsers /></ProtectedAdmin>} />

              {/* Fallback: qualquer rota não mapeada vai para Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
