import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu, BrainCircuit, Mail, MapPin, Instagram, Linkedin, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Mentorias', href: '#mentorias' },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Formações', href: '#formacoes' },
  { label: 'Comunidade', href: '#comunidade' },
  { label: 'Builder', href: '#builder' },
  { label: 'Cases', href: '/' },
  { label: 'Planos', href: '#planos' },
  { label: 'Blog', href: '#blog' },
]

export default function Layout() {
  const location = useLocation()

  // Basic smooth scroll helper for anchor links
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-[#E6E8EB] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1350px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <BrainCircuit className="h-6 w-6 text-[#02162A]" />
            <span className="font-semibold text-lg tracking-tight text-[#0B0D12]">Viver de IA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={cn(
                    'text-[14px] px-3 py-2 rounded-md transition-colors duration-300',
                    isActive
                      ? 'text-[#02162A] font-medium bg-[#F6F7F9]'
                      : 'text-[#5F6368] hover:text-[#0B0D12] hover:bg-[#F6F7F9]',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" className="text-[#0B0D12] hover:bg-[#F6F7F9] font-medium">
              Entrar
            </Button>
            <Button className="bg-[#02162A] text-white hover:bg-[#0A2A4A] font-medium shadow-subtle transition-colors duration-300">
              Conhecer agora
            </Button>
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-[#0B0D12]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 flex flex-col">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6 text-[#02162A]" />
                  <span>Viver de IA</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                <div className="text-xs font-semibold text-[#5F6368] mb-2 uppercase tracking-wider">
                  Navegação
                </div>
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.href
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={(e) => handleScroll(e, link.href)}
                      className={cn(
                        'text-base py-3 px-4 rounded-md transition-colors duration-300',
                        isActive
                          ? 'text-[#02162A] font-medium bg-[#F6F7F9]'
                          : 'text-[#5F6368] hover:text-[#0B0D12] hover:bg-[#F6F7F9]',
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-[#E6E8EB]">
                <Button
                  variant="outline"
                  className="w-full border-[#E6E8EB] text-[#0B0D12] hover:bg-[#F6F7F9]"
                >
                  Entrar
                </Button>
                <Button className="w-full bg-[#02162A] text-white hover:bg-[#0A2A4A]">
                  Conhecer agora
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Site Footer */}
      <footer className="bg-[#0A0C10] pt-16 pb-8 mt-20 border-t border-[#1F2937]">
        <div className="container mx-auto px-4 max-w-[1350px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="h-8 w-8 text-white" />
                <span className="text-xl font-semibold tracking-[0.2em] text-white">
                  VIVER DE IA
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#9CA3AF]">
                A plataforma de soluções e educação de IA da sua empresa. Plug & Play para
                implementar soluções de Inteligência Artificial na sua empresa de forma simples e
                imediata.
              </p>
            </div>

            <div className="md:ml-auto">
              <h4 className="text-white font-semibold mb-6">Menu</h4>
              <ul className="space-y-4 text-sm text-[#9CA3AF]">
                <li>
                  <Link
                    to="/"
                    onClick={(e) => handleScroll(e, '/')}
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#solucoes"
                    onClick={(e) => handleScroll(e, '/#solucoes')}
                    className="hover:text-white transition-colors"
                  >
                    Soluções
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#planos"
                    onClick={(e) => handleScroll(e, '/#planos')}
                    className="hover:text-white transition-colors"
                  >
                    Planos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Contato</h4>
              <ul className="space-y-4 text-sm text-[#9CA3AF]">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0" />
                  <a
                    href="mailto:contato@viverdeia.ai"
                    className="hover:text-white transition-colors"
                  >
                    contato@viverdeia.ai
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>SC-401, Florianópolis, SC</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Redes Sociais</h4>
              <ul className="space-y-4 text-sm text-[#9CA3AF]">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5 shrink-0" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <Linkedin className="h-5 w-5 shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <Youtube className="h-5 w-5 shrink-0" />
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9CA3AF]">
            <p>© 2026 Viver de IA. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
