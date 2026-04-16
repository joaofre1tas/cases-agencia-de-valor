import { useEffect, useRef, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CaseCard } from '@/components/CaseCard'
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
import { listCases } from '@/lib/cases'
import { listSegments } from '@/lib/segments'

export default function Index() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('Todos')
  const casesQuery = useQuery({
    queryKey: ['public', 'cases'],
    queryFn: () => listCases(false),
  })
  const segmentsQuery = useQuery({
    queryKey: ['segments'],
    queryFn: listSegments,
  })
  const cases = useMemo(() => casesQuery.data ?? [], [casesQuery.data])

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSegment = segmentFilter === 'Todos' || c.segment === segmentFilter
      return matchesSearch && matchesSegment
    })
  }, [cases, searchQuery, segmentFilter])

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
        ;(child as HTMLElement).style.animationDelay = `${(index % 6) * 100}ms`
        child.classList.add('opacity-0', 'translate-y-4')
        child.classList.remove('animate-fade-in-up')
        observer.observe(child)
      })
    }

    return () => observer.disconnect()
  }, [filteredCases])

  const clientPhotos = [
    '/home/clientes/cliente-01.webp',
    '/home/clientes/cliente-02.webp',
    '/home/clientes/cliente-03.webp',
    '/home/clientes/cliente-04.webp',
    '/home/clientes/cliente-05.webp',
    '/home/clientes/cliente-06.webp',
    '/home/clientes/cliente-07.webp',
    '/home/clientes/cliente-08.webp',
  ]

  return (
    <div className="w-full flex flex-col bg-av-bg">
      {/* Hero */}
      <section className="relative overflow-hidden bg-av-bg border-b border-av-border">
        {/* Glow decorativo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,160,26,0.6) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-20 right-0 h-[360px] w-[360px] rounded-full blur-3xl opacity-10"
          style={{
            background:
              'radial-gradient(circle at center, rgba(235,93,93,0.6) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto px-4 max-w-[1350px] relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[500px] lg:min-h-[620px] py-16 lg:py-0">
            {/* Texto */}
            <div className="flex flex-col items-start gap-6 max-w-xl z-10 animate-fade-in-up">
              <span className="eyebrow-av">Cases · Agência de Valor</span>
              <h1 className="text-[40px] md:text-[60px] font-semibold tracking-tight text-av-text leading-[1.05]">
                Agências reais faturando{' '}
                <span className="text-gradient-av">R$100k+</span> todo mês.
              </h1>
              <p className="text-[18px] md:text-[20px] text-av-text-secondary leading-[1.6]">
                Mais de <span className="text-gradient-av font-semibold">R$126 milhões</span> em
                resultados gerados. Aqui estão os cases reais de donos que estruturaram o negócio
                dentro da Mentoria Agência de Valor.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-av-text-muted">
                <span className="badge-av">+412 calls individuais</span>
                <span className="badge-av">100% individual</span>
              </div>
            </div>

            {/* Fotos rolando */}
            <div className="relative h-[380px] lg:h-[620px] mask-image-horizontal overflow-hidden -mx-4 lg:mx-0">
              <div className="absolute inset-y-0 left-0 flex items-center gap-4 lg:gap-6 animate-marquee-left w-max">
                {clientPhotos.map((src, index) => (
                  <img
                    key={`hero-orig-${index}`}
                    src={src}
                    alt={`Cliente da Agência de Valor recebendo placa de faturamento ${index + 1}`}
                    loading="eager"
                    decoding="async"
                    className="h-[340px] lg:h-[560px] w-auto rounded-xl object-cover shadow-elevation select-none shrink-0"
                    draggable={false}
                  />
                ))}
                {clientPhotos.map((src, index) => (
                  <img
                    key={`hero-dup-${index}`}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-[340px] lg:h-[560px] w-auto rounded-xl object-cover shadow-elevation select-none shrink-0"
                    draggable={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de cases */}
      <section className="bg-av-bg py-20 lg:py-28" id="cases">
        <div className="container mx-auto px-4 max-w-[1350px]">
          {/* Cabeçalho da seção */}
          <div className="mb-10 max-w-2xl">
            <div className="eyebrow-av mb-3">Todos os cases</div>
            <h2 className="text-3xl md:text-[40px] font-semibold text-av-text tracking-tight leading-tight">
              Resultados <span className="text-gradient-av">auditáveis</span>, não promessas.
            </h2>
          </div>

          {/* Busca e filtro */}
          <div className="card-av p-4 md:p-6 mb-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-av-text-muted" />
                <Input
                  placeholder="Buscar caso por nome, nicho ou resultado..."
                  className="pl-10 h-12 text-base bg-av-bg border-av-border text-av-text placeholder:text-av-text-muted focus-visible:ring-av-orange focus-visible:border-av-orange/50 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64 shrink-0">
                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger className="h-12 bg-av-bg border-av-border text-av-text focus:ring-av-orange rounded-md">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-av-text-muted" />
                      <SelectValue placeholder="Segmento" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos os segmentos</SelectItem>
                    {(segmentsQuery.data ?? []).map((segment) => (
                      <SelectItem key={segment.id} value={segment.name}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-av-border">
              <p className="text-sm text-av-text-muted">
                Mostrando{' '}
                <span className="font-semibold text-av-text">{filteredCases.length}</span> de{' '}
                <span className="font-semibold text-av-text">{cases.length}</span> cases
              </p>
            </div>
          </div>

          {casesQuery.isLoading ? (
            <div className="card-av p-8 text-center text-av-text-muted">Carregando cases...</div>
          ) : null}

          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredCases.map((caseItem) => (
              <Link
                to={`/cases/${caseItem.slug}`}
                key={caseItem.id}
                className="opacity-0 translate-y-4 transition-all duration-500 ease-out block hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-av-orange rounded-xl"
                style={{ willChange: 'opacity, transform' }}
              >
                <CaseCard caseItem={caseItem} />
              </Link>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-20 text-av-text-muted">
              <p className="text-lg">Nenhum case encontrado para os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
