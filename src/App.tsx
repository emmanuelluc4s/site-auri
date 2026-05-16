import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

import Home from '@/pages/Home'
import Catalogo from '@/pages/Catalogo'
import Categoria from '@/pages/Categoria'
import Produto from '@/pages/Produto'
import Promocoes from '@/pages/Promocoes'
import Lancamentos from '@/pages/Lancamentos'
import Avaliacoes from '@/pages/Avaliacoes'
import QuemSomos from '@/pages/QuemSomos'
import FaleConosco from '@/pages/FaleConosco'
import DesignSystem from '@/pages/DesignSystem'
import DataTest from '@/pages/DataTest'

import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import AdminProductForm from '@/pages/admin/ProductForm'
import AdminCategories from '@/pages/admin/Categories'
import AdminReviews from '@/pages/admin/Reviews'
import AdminComments from '@/pages/admin/Comments'
import AdminBanners from '@/pages/admin/Banners'
import AdminContent from '@/pages/admin/Content'
import AdminStoreInfo from '@/pages/admin/StoreInfo'
import AdminUsers from '@/pages/admin/AdminUsers'

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <InstagramButton />
      <ScrollToTop />
    </div>
  )
}

function ProtectedAdmin({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
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

            {/* Páginas temporárias de validação — remover antes do deploy final */}
            <Route path="/design-system" element={<PublicLayout><DesignSystem /></PublicLayout>} />
            <Route path="/data-test" element={<PublicLayout><DataTest /></PublicLayout>} />

            {/* Login admin (sem guard) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rotas protegidas */}
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
            <Route path="/admin/usuarios" element={<ProtectedAdmin><AdminUsers /></ProtectedAdmin>} />
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
