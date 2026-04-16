import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/Logo'
import { signIn, isAdmin, useAuth, useIsAdmin } from '@/lib/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const sessionQuery = useAuth()
  const isAdminQuery = useIsAdmin(Boolean(sessionQuery.data))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkingSession =
    sessionQuery.isLoading || (Boolean(sessionQuery.data) && isAdminQuery.isLoading)

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-av-bg text-av-text flex items-center justify-center px-4">
        <p className="text-av-text-muted">Verificando sessão...</p>
      </div>
    )
  }

  if (sessionQuery.data && isAdminQuery.data) {
    const from = (location.state as { from?: string } | undefined)?.from ?? '/admin'
    return <Navigate to={from} replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { session } = await signIn(email, password)
      queryClient.setQueryData(['auth', 'session'], session)
      const allowed = await isAdmin()
      if (!allowed) {
        setError('Conta autenticada, mas sem acesso ao admin. Adicione na tabela admin_users.')
        return
      }
      queryClient.setQueryData(['auth', 'is-admin'], true)
      const from = (location.state as { from?: string } | undefined)?.from ?? '/admin'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-av-bg text-av-text flex items-center justify-center px-4">
      <div className="card-av w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-3">
          <Logo variant="full" className="h-10 w-auto mx-auto" />
          <h1 className="text-2xl font-semibold">Admin da Agência de Valor</h1>
          <p className="text-av-text-secondary text-sm">Acesso exclusivo do time interno</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-av-bg border-av-border"
          />
          <Input
            type="password"
            required
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="bg-av-bg border-av-border"
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
