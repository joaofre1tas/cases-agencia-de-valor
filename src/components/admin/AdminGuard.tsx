import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, useIsAdmin } from '@/lib/auth'

export default function AdminGuard() {
  const location = useLocation()
  const sessionQuery = useAuth()
  const isAdminQuery = useIsAdmin(Boolean(sessionQuery.data))

  if (sessionQuery.isLoading || (sessionQuery.data && isAdminQuery.isLoading)) {
    return <div className="py-24 text-center text-av-text-muted">Carregando área administrativa...</div>
  }

  if (!sessionQuery.data) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  if (!isAdminQuery.data) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
