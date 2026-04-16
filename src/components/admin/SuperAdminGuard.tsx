import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth, useIsAdmin, useIsSuperAdmin } from '@/lib/auth'

function RedirectNonSuperAdmin() {
  const navigate = useNavigate()
  useEffect(() => {
    toast.info('Acesso restrito a super admins.')
    navigate('/admin', { replace: true })
  }, [navigate])
  return (
    <div className="py-24 text-center text-av-text-muted text-sm">Redirecionando para o painel...</div>
  )
}

export default function SuperAdminGuard() {
  const sessionQuery = useAuth()
  const isAdminQuery = useIsAdmin(Boolean(sessionQuery.data))
  const isSuperQuery = useIsSuperAdmin(Boolean(sessionQuery.data && isAdminQuery.data))

  const loading =
    sessionQuery.isLoading ||
    (Boolean(sessionQuery.data) && isAdminQuery.isLoading) ||
    (Boolean(sessionQuery.data) && Boolean(isAdminQuery.data) && isSuperQuery.isLoading)

  if (loading) {
    return <div className="py-24 text-center text-av-text-muted">Verificando permissões...</div>
  }

  if (!sessionQuery.data) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdminQuery.data) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isSuperQuery.data) {
    return <RedirectNonSuperAdmin />
  }

  return <Outlet />
}
