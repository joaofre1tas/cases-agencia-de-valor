import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'

export default function AdminLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut()
      queryClient.setQueryData(['auth', 'session'], null)
      queryClient.setQueryData(['auth', 'is-admin'], false)
      queryClient.removeQueries({ queryKey: ['auth'] })
      navigate('/admin/login', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível sair.'
      toast.error(message)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-av-bg text-av-text">
      <header className="border-b border-av-border bg-av-surface">
        <div className="container mx-auto max-w-[1350px] px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo variant="full" className="h-8 w-auto" />
            <span className="text-xs uppercase tracking-wider text-av-text-muted">Admin</span>
          </Link>
          <Button
            type="button"
            variant="av-outline"
            onClick={handleSignOut}
            disabled={signingOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? 'Saindo...' : 'Sair'}
          </Button>
        </div>
      </header>
      <main className="container mx-auto max-w-[1350px] px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
