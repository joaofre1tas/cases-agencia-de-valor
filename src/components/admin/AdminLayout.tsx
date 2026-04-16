import { Outlet, Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-av-bg text-av-text">
      <header className="border-b border-av-border bg-av-surface">
        <div className="container mx-auto max-w-[1350px] px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo variant="full" className="h-8 w-auto" />
            <span className="text-xs uppercase tracking-wider text-av-text-muted">Admin</span>
          </Link>
          <Button variant="av-outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>
      <main className="container mx-auto max-w-[1350px] px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
