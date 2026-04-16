import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { ButtonAV } from '@/components/ui/button'
import { Logo } from '@/components/Logo'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-av-bg text-av-text px-4 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,160,26,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="text-center max-w-lg relative z-10">
        <Link to="/" className="inline-block mb-10">
          <Logo variant="symbol" className="h-14 w-auto mx-auto" />
        </Link>
        <div className="eyebrow-av mb-4">Erro 404</div>
        <h1 className="text-[72px] md:text-[96px] font-semibold leading-none mb-4 text-gradient-av">
          404
        </h1>
        <p className="text-xl text-av-text-secondary mb-2 font-medium">Página não encontrada.</p>
        <p className="text-av-text-muted mb-10">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <div className="flex justify-center">
          <ButtonAV asChild>
            <Link to="/">Voltar para a home</Link>
          </ButtonAV>
        </div>
      </div>
    </div>
  )
}

export default NotFound
