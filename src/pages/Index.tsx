import { useEffect, useRef, useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { TestimonialCard } from '@/components/TestimonialCard'
import { testimonials } from '@/data/testimonials'
import { CaseCard } from '@/components/CaseCard'
import { cases } from '@/data/cases'
import { Search, Layers } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Index() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('Todos')

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSegment = segmentFilter === 'Todos' || c.segment === segmentFilter
      return matchesSearch && matchesSegment
    })
  }, [searchQuery, segmentFilter])

  // Simple staggered fade-in animation using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            entry.target.classList.remove('opacity-0', 'translate-y-4')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' },
    )

    const children = gridRef.current?.children
    if (children) {
      Array.from(children).forEach((child, index) => {
        // Add staggered delay
        ;(child as HTMLElement).style.animationDelay = `${(index % 6) * 100}ms`
        child.classList.add('opacity-0', 'translate-y-4')
        child.classList.remove('animate-fade-in-up')
        observer.observe(child)
      })
    }

    return () => observer.disconnect()
  }, [filteredCases])

  // Create two columns of testimonials for the scrolling hero
  const heroScrollingCards = testimonials.slice(0, 10)

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-[#E6E8EB]">
        <div className="container mx-auto px-4 max-w-[1350px]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[500px] lg:min-h-[600px] py-16 lg:py-0">
            {/* Text Content */}
            <div className="flex flex-col items-start gap-6 max-w-xl z-10 animate-fade-in-up">
              <Badge
                className="bg-[#F6F7F9] text-[#02162A] hover:bg-[#F6F7F9] border-[#E6E8EB] px-4 py-1.5 text-xs font-semibold tracking-wide"
                variant="outline"
              >
                Transformação com IA
              </Badge>
              <h1 className="text-4xl md:text-[60px] font-semibold tracking-tight text-[#0B0D12] leading-[1.1]">
                Cases de Sucesso
              </h1>
              <p className="text-[18px] md:text-[20px] text-[#5F6368] leading-[1.6]">
                Veja como nossos alunos e parceiros estão transformando seus negócios e carreiras
                utilizando o poder da Inteligência Artificial.
              </p>
            </div>

            {/* Scrolling Cards Column (Desktop Only) */}
            <div className="hidden lg:block relative h-[600px] mask-image-vertical">
              <div className="absolute inset-0 flex flex-col gap-6 animate-marquee-up pt-10">
                {/* Original List */}
                {heroScrollingCards.map((testimonial) => (
                  <div key={`hero-orig-${testimonial.id}`} className="px-4">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
                {/* Duplicated List for seamless loop */}
                {heroScrollingCards.map((testimonial) => (
                  <div key={`hero-dup-${testimonial.id}`} className="px-4">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Grid Section */}
      <section className="bg-[#F6F7F9]/30 py-20 lg:py-32" id="cases">
        <div className="container mx-auto px-4 max-w-[1350px]">
          {/* Search and Filter Bar */}
          <div className="bg-white border border-[#E6E8EB] rounded-2xl p-4 md:p-6 shadow-sm mb-12 max-w-[1350px] mx-auto animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5F6368]" />
                <Input
                  placeholder="Buscar caso..."
                  className="pl-10 h-12 text-base border-[#E6E8EB] focus-visible:ring-[#02162A] rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64 shrink-0">
                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger className="h-12 border-[#E6E8EB] focus:ring-[#02162A] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#5F6368]" />
                      <SelectValue placeholder="Segmento" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os Segmentos</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Varejo">Varejo</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Imobiliário">Imobiliário</SelectItem>
                    <SelectItem value="Jurídico">Jurídico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6E8EB]">
              <p className="text-sm text-[#5F6368]">
                Mostrando{' '}
                <span className="font-semibold text-[#0B0D12]">{filteredCases.length}</span> de{' '}
                <span className="font-semibold text-[#0B0D12]">{cases.length}</span> casos
              </p>
            </div>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredCases.map((caseItem) => (
              <Link
                to={`/cases/${caseItem.id}`}
                key={caseItem.id}
                className="opacity-0 translate-y-4 transition-all duration-500 ease-out block hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#02162A] rounded-2xl"
                style={{ willChange: 'opacity, transform' }}
              >
                <CaseCard caseItem={caseItem} />
              </Link>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-20 text-[#5F6368] animate-fade-in">
              <p className="text-lg">Nenhum caso encontrado para os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
