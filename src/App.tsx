import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import CaseStudy from './pages/CaseStudy'
import AuthListener from '@/components/AuthListener'

const AdminLogin = lazy(() => import('@/pages/admin/Login'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminNewCase = lazy(() => import('@/pages/admin/NewCase'))
const AdminEditCase = lazy(() => import('@/pages/admin/EditCase'))
const AdminGuard = lazy(() => import('@/components/admin/AdminGuard'))
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'))
const SuperAdminGuard = lazy(() => import('@/components/admin/SuperAdminGuard'))
const EditorHome = lazy(() => import('@/pages/admin/EditorHome'))

const queryClient = new QueryClient()

function AdminFallback() {
  return (
    <div className="min-h-screen bg-av-bg text-av-text flex items-center justify-center px-4">
      <p className="text-av-text-muted">Carregando área administrativa...</p>
    </div>
  )
}

function LegacyEditCaseRedirect() {
  const { id } = useParams()
  return <Navigate to={`/admin/editar-case/${id}`} replace />
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <AuthListener />
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/cases/:slug" element={<CaseStudy />} />
          </Route>

          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminGuard />
              </Suspense>
            }
          >
            <Route
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminDashboard />
                  </Suspense>
                }
              />
              <Route
                path="/admin/novo-case"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminNewCase />
                  </Suspense>
                }
              />
              <Route
                path="/admin/editar-case/:id"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminEditCase />
                  </Suspense>
                }
              />
              <Route
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <SuperAdminGuard />
                  </Suspense>
                }
              >
                <Route
                  path="/admin/editor-home"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <EditorHome />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="/admin/cases/new" element={<Navigate to="/admin/novo-case" replace />} />
              <Route path="/admin/cases/:id" element={<LegacyEditCaseRedirect />} />
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
