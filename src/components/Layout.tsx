import { Link, Outlet } from 'react-router-dom'
import { ButtonAV } from '@/components/ui/button'
import { Mail, MapPin, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-av-border bg-av-bg/85 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1350px]">
          <Link
            to="/"
            className="flex items-center transition-opacity hover:opacity-90"
            aria-label="Agência de Valor — página inicial"
          >
            <Logo variant="full" className="h-8 w-auto" />
          </Link>

          <ButtonAV>Aplicar agora</ButtonAV>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-av-bg pt-16 pb-8 mt-20 border-t border-av-border relative overflow-hidden">
        {/* Watermark AV */}
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 opacity-100"
          aria-hidden
        >
          <svg
            viewBox="0 0 969.83 644.31"
            className="h-[420px] w-[420px]"
            fill="hsl(var(--av-wm-fill))"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M0,644.31h182.3l51.04-115.83h255.22l43.75,115.83h175.01L969.83,0h-189.59l-153.13,398.17L473.98,0h-196.88L0,644.31ZM291.68,390.93h138.55l-72.92-180.98-65.63,180.98Z"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 max-w-[1350px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link to="/" className="inline-block mb-6">
                <Logo variant="full" className="h-8 w-auto" />
              </Link>
              <p className="text-sm leading-[1.7] text-av-text-secondary">
                Mentoria premium para donos de agência que querem estruturar o negócio e faturar{' '}
                <span className="text-gradient-av font-semibold">R$100k todo mês</span>.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="badge-av">+ R$126M em resultados</span>
              </div>
            </div>

            <div className="md:ml-auto">
              <h4 className="eyebrow-av mb-5">Menu</h4>
              <ul className="space-y-3 text-sm text-av-text-secondary">
                <li>
                  <Link to="/" className="hover:text-av-text transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#metodo" className="hover:text-av-text transition-colors">
                    Método
                  </a>
                </li>
                <li>
                  <a href="#resultados" className="hover:text-av-text transition-colors">
                    Resultados
                  </a>
                </li>
                <li>
                  <a href="#mentoria" className="hover:text-av-text transition-colors">
                    Mentoria
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow-av mb-5">Contato</h4>
              <ul className="space-y-3 text-sm text-av-text-secondary">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-av-text-muted" />
                  <a
                    href="mailto:contato@agenciadevalor.com"
                    className="hover:text-av-text transition-colors"
                  >
                    contato@agenciadevalor.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-av-text-muted" />
                  <span>Brasil · 100% online</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow-av mb-5">Redes</h4>
              <ul className="space-y-3 text-sm text-av-text-secondary">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-av-text transition-colors"
                  >
                    <Instagram className="h-4 w-4 shrink-0 text-av-text-muted" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-av-text transition-colors"
                  >
                    <Linkedin className="h-4 w-4 shrink-0 text-av-text-muted" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-av-text transition-colors"
                  >
                    <Youtube className="h-4 w-4 shrink-0 text-av-text-muted" />
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-av-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-av-text-muted">
            <p>© 2026 Agência de Valor · AV. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-av-text transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-av-text transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
