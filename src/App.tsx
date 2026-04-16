import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import CaseStudy from './pages/CaseStudy'
import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminNewCase from '@/pages/admin/NewCase'
import AdminEditCase from '@/pages/admin/EditCase'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/cases/:slug" element={<CaseStudy />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/cases/new" element={<AdminNewCase />} />
              <Route path="/admin/cases/:id" element={<AdminEditCase />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
