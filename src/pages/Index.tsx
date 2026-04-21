import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CaseCard } from '@/components/CaseCard'
import { BellPrintsGallery } from '@/components/BellPrintsGallery'
import { VideoTestimonialCard } from '@/components/VideoTestimonialCard'
import { Search, Layers } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { listCases } from '@/lib/cases'
import { listBellPrints } from '@/lib/bells'
import { listSegments } from '@/lib/segments'
import { listTestimonialVideos } from '@/lib/testimonial-videos'
import { flatRecordToFormValues, mergeSiteSettingsRows, useSiteSettings } from '@/lib/site-settings'
import { sanitizeRichHtml } from '@/lib/markdown'
import {
  responsiveAlignClasses,
  responsiveFlexColItemsClasses,
  responsiveFlexWrapJustifyClasses,
  responsiveFontClasses,
} from '@/lib/responsive-site-ui'
import { cn } from '@/lib/utils'

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'estudos' | 'sinos' | 'videos'>(
    initialTab === 'sinos' || initialTab === 'videos' ? initialTab : 'estudos',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('Todos')
  const [videoSegmentFilter, setVideoSegmentFilter] = useState('Todos')
  const [videoSearchQuery, setVideoSearchQuery] = useState('')
  const casesQuery = useQuery({
    queryKey: ['public', 'cases'],
    queryFn: () => listCases(false),
  })
  const segmentsQuery = useQuery({
    queryKey: ['segments'],
    queryFn: listSegments,
  })
  const bellPrintsQuery = useQuery({
    queryKey: ['public', 'bell-prints'],
    queryFn: () => listBellPrints(false),
    enabled: activeTab === 'sinos',
    retry: false,
  })
  const testimonialVideosQuery = useQuery({
    queryKey: ['public', 'testimonial-videos'],
    queryFn: () => listTestimonialVideos(false),
    enabled: activeTab === 'videos',
    retry: false,
  })
  const siteSettingsQuery = useSiteSettings()
  const cases = useMemo(() => casesQuery.data ?? [], [casesQuery.data])

  const { hero, cases: casesSection } = useMemo(() => {
    const map = siteSettingsQuery.data ?? mergeSiteSettingsRows([])
    const full = flatRecordToFormValues(map)
    return { hero: full.home.hero, cases: full.home.cases }
  }, [siteSettingsQuery.data])

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSegment = segmentFilter === 'Todos' || c.segment === segmentFilter
      return matchesSearch && matchesSegment
    })
  }, [cases, searchQuery, segmentFilter])

  const filteredVideos = useMemo(() => {
    const videos = testimonialVideosQuery.data ?? []
    const normalizedSearch = videoSearchQuery.toLowerCase().trim()
    return videos.filter((item) => {
      const matchesSegment = videoSegmentFilter === 'Todos' || item.segment === videoSegmentFilter
      if (!normalizedSearch) return matchesSegment
      const metricsText = item.metrics.map((m) => `${m.label} ${m.value}`).join(' ')
      const searchable = [
        item.headline,
        item.description ?? '',
        item.agency_name,
        item.founder_name,
        item.segment,
        metricsText,
      ]
        .join(' ')
        .toLowerCase()
      return matchesSegment && searchable.includes(normalizedSearch)
    })
  }, [testimonialVideosQuery.data, videoSearchQuery, videoSegmentFilter])

  useEffect(() => {
    const current = searchParams.get('tab')
    if (current === activeTab) return
    const next = new URLSearchParams(searchParams)
    next.set('tab', activeTab)
    setSearchParams(next, { replace: true })
  }, [activeTab, searchParams, setSearchParams])

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
            <div
              className={cn(
                'flex flex-col gap-6 max-w-xl z-10 animate-fade-in-up',
                responsiveAlignClasses(hero.align),
                responsiveFlexColItemsClasses(hero.align),
              )}
            >
              <span className="eyebrow-av">{hero.eyebrow}</span>
              <div
                className="text-[40px] md:text-[60px] font-semibold tracking-tight text-av-text leading-[1.05]"
                role="heading"
                aria-level={1}
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(hero.title_html) }}
              />
              <div
                className="text-[18px] md:text-[20px] text-av-text-secondary leading-[1.6]"
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(hero.subtitle_html) }}
              />

              <div
                className={cn(
                  'mt-2 flex flex-wrap items-center gap-3 text-xs text-av-text-muted',
                  responsiveFlexWrapJustifyClasses(hero.align),
                )}
              >
                {hero.badges
                  .filter((b) => b.enabled !== false && b.label.trim())
                  .map((b, i) => (
                    <span key={`${b.label}-${i}`} className="badge-av">
                      {b.label}
                    </span>
                  ))}
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
          <div
            className={cn(
              'mb-10 max-w-2xl',
              responsiveAlignClasses(casesSection.align),
            )}
          >
            <div
              className={cn(
                'eyebrow-av mb-3 uppercase',
                responsiveFontClasses(casesSection.typography.eyebrow),
              )}
            >
              {casesSection.eyebrow}
            </div>
            <div
              className={cn(
                'font-semibold text-av-text tracking-tight leading-tight',
                responsiveFontClasses(casesSection.typography.title),
              )}
              role="heading"
              aria-level={2}
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(casesSection.title_html) }}
            />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="h-auto w-full md:w-auto rounded-md bg-av-surface border border-av-border p-1 mb-8 grid grid-cols-3 md:inline-flex">
              <TabsTrigger
                value="estudos"
                className="rounded-sm data-[state=active]:bg-av-bg data-[state=active]:text-av-text data-[state=active]:shadow-none text-av-text-secondary"
              >
                Estudos de Caso
              </TabsTrigger>
              <TabsTrigger
                value="sinos"
                className="rounded-sm data-[state=active]:bg-av-bg data-[state=active]:text-av-text data-[state=active]:shadow-none text-av-text-secondary"
              >
                Sinos
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="rounded-sm data-[state=active]:bg-av-bg data-[state=active]:text-av-text data-[state=active]:shadow-none text-av-text-secondary"
              >
                Vídeos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="estudos" className="mt-0">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredCases.map((caseItem) => (
                  <Link
                    to={`/cases/${caseItem.slug}`}
                    key={caseItem.id}
                    className="block hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-av-orange rounded-xl"
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
            </TabsContent>

            <TabsContent value="sinos" className="mt-0">
              {bellPrintsQuery.isLoading ? (
                <div className="card-av p-8 text-center text-av-text-muted">Carregando sinos...</div>
              ) : bellPrintsQuery.isError ? (
                <div className="card-av p-8 text-center text-av-text-muted">
                  Não foi possível carregar os sinos agora.
                </div>
              ) : (
                <BellPrintsGallery prints={bellPrintsQuery.data ?? []} />
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              {testimonialVideosQuery.isLoading ? (
                <div className="card-av p-8 text-center text-av-text-muted">Carregando vídeos...</div>
              ) : testimonialVideosQuery.isError ? (
                <div className="card-av p-8 text-center text-av-text-muted">
                  Não foi possível carregar os vídeos agora.
                </div>
              ) : testimonialVideosQuery.data && testimonialVideosQuery.data.length > 0 ? (
                <div className="space-y-6">
                  <div className="card-av p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-av-text-muted" />
                        <Input
                          placeholder="Buscar vídeo por headline, agência, fundador, nicho ou métrica..."
                          className="pl-10 h-12 text-base bg-av-bg border-av-border text-av-text placeholder:text-av-text-muted focus-visible:ring-av-orange focus-visible:border-av-orange/50 rounded-md"
                          value={videoSearchQuery}
                          onChange={(e) => setVideoSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-64 shrink-0">
                        <Select value={videoSegmentFilter} onValueChange={setVideoSegmentFilter}>
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
                        <span className="font-semibold text-av-text">{filteredVideos.length}</span> de{' '}
                        <span className="font-semibold text-av-text">
                          {testimonialVideosQuery.data.length}
                        </span>{' '}
                        vídeos
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredVideos.map((item) => (
                      <VideoTestimonialCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card-av p-8 text-center text-av-text-muted">
                  Ainda não temos vídeos publicados.
                </div>
              )}

              {testimonialVideosQuery.data && testimonialVideosQuery.data.length > 0 && filteredVideos.length === 0 ? (
                <div className="card-av p-8 text-center text-av-text-muted">
                  Nenhum vídeo encontrado para o segmento selecionado.
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
