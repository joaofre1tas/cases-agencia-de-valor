import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ExternalLink, Quote } from 'lucide-react'
import { Button, ButtonAV } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getCaseBySlug, listCases } from '@/lib/cases'
import { sanitizeRichHtml } from '@/lib/markdown'

export default function CaseStudy() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const preview = searchParams.get('preview') === 'true'

  const caseQuery = useQuery({
    queryKey: ['public', 'case', slug, preview],
    queryFn: () => getCaseBySlug(slug!, preview),
    enabled: Boolean(slug),
  })

  const nextCasesQuery = useQuery({
    queryKey: ['public', 'cases', 'next'],
    queryFn: () => listCases(false),
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (caseQuery.isLoading) {
    return <div className="py-24 text-center text-av-text-muted">Carregando case...</div>
  }

  if (caseQuery.isError || !caseQuery.data) {
    return (
      <div className="py-24 text-center text-av-text-muted">
        Case não encontrado ou indisponível para visualização.
      </div>
    )
  }

  const caseItem = caseQuery.data
  const nextCases = nextCasesQuery.data ?? []
  const currentIdx = nextCases.findIndex((item) => item.slug === caseItem.slug)
  const nextCase = currentIdx >= 0 && currentIdx < nextCases.length - 1 ? nextCases[currentIdx + 1] : null

  return (
    <div className="flex flex-col min-h-screen bg-av-bg text-av-text">
      <div className="container mx-auto px-4 max-w-[900px] pt-12 pb-24">
        {/* Hero */}
        <div className="flex flex-col items-center mb-16 animate-fade-in-up">
          <div className="mb-8">
            <img
              src={caseItem.logo_url || caseItem.cover_url || '/brand/av-symbol.svg'}
              alt={caseItem.title}
              className="h-12 w-auto object-contain opacity-90"
            />
          </div>
          <span className="eyebrow-av mb-5">Case · Agência de Valor</span>
          <h1 className="text-[32px] md:text-[48px] font-semibold text-av-text leading-[1.1] tracking-tight text-center mb-6 max-w-4xl">
            {caseItem.title}
          </h1>
          {caseItem.badge_label ? <span className="badge-av mb-8">{caseItem.badge_label}</span> : null}
          <p className="text-[18px] text-av-text-secondary max-w-2xl mx-auto leading-[1.7] text-center">
            {caseItem.subtitle || caseItem.description}
          </p>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-12 border-b border-av-border pb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-av-text-muted hover:text-av-text">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-av-border" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-av-text-muted hover:text-av-text">
                    Cases
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-av-border" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-av-text font-medium">
                  {caseItem.agency_name || caseItem.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Conteúdo */}
        <div className="space-y-16">
          <section>
            <div className="eyebrow-av mb-3">{caseItem.challenge_eyebrow || 'O desafio'}</div>
            <h2 className="text-[28px] font-semibold text-av-text mb-6 tracking-tight">
              {caseItem.challenge_heading || 'Desafio'}
            </h2>
            <div className="card-av p-8 md:p-10">
              <div
                className="text-[16px] text-av-text-secondary leading-[1.8] prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichHtml(caseItem.challenge_content),
                }}
              />
            </div>
          </section>

          <section>
            <div className="eyebrow-av mb-3">{caseItem.solution_eyebrow || 'A solução'}</div>
            <h2 className="text-[28px] font-semibold text-av-text mb-6 tracking-tight">
              {caseItem.solution_heading || 'Solução'}
            </h2>
            <div className="card-av p-8 md:p-10">
              <div
                className="text-[16px] text-av-text-secondary leading-[1.8] prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichHtml(caseItem.solution_content),
                }}
              />
            </div>
          </section>

          <section>
            <div className="eyebrow-av mb-3">{caseItem.results_eyebrow || 'Os resultados'}</div>
            <h2 className="text-[28px] font-semibold text-av-text mb-6 tracking-tight">
              {caseItem.results_heading || 'Resultados'}
            </h2>
            <div className="card-av p-8 md:p-10">
              <div
                className="text-[16px] text-av-text-secondary leading-[1.8] prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichHtml(caseItem.results_content),
                }}
              />
            </div>
          </section>

          <section>
            <div className="eyebrow-av mb-4">Métricas</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(caseItem.metrics || []).map((m, i) => (
                <div
                  key={i}
                  className="card-av p-8 flex flex-col items-center text-center hover-glow-av"
                >
                  <span className="text-[40px] md:text-[48px] font-semibold leading-none mb-3 text-gradient-av">
                    {m.value}
                  </span>
                  <span className="text-av-text-muted text-[12px] font-semibold uppercase tracking-wider">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="card-av p-8 md:p-12 relative overflow-hidden">
              <Quote
                className="absolute top-8 left-8 h-20 w-20 text-av-text-muted/10 rotate-180"
                aria-hidden
              />
              <div className="relative z-10">
                <p className="text-[20px] md:text-[24px] leading-relaxed text-av-text italic mb-10 font-medium">
                  "{caseItem.quote_text || 'Sem depoimento cadastrado para este case.'}"
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        caseItem.quote_author_avatar_url ||
                        caseItem.avatar_url ||
                        'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1'
                      }
                      alt={caseItem.quote_author_name || caseItem.title}
                      className="h-14 w-14 rounded-full object-cover border border-av-border"
                    />
                    <div>
                      <div className="font-semibold text-av-text text-[16px]">
                        {caseItem.quote_author_name || 'Agência de Valor'}
                      </div>
                      <div className="text-[14px] text-av-text-muted">{caseItem.quote_author_role}</div>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="av-outline"
                    className="h-11 rounded-md px-5 w-full sm:w-auto font-medium gap-2"
                  >
                    <a href={caseItem.quote_cta_url || '#'} target="_blank" rel="noreferrer">
                      {caseItem.quote_cta_label || 'Ver mais'}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA final */}
          <section className="text-center py-10">
            <span className="eyebrow-av mb-4 inline-block">Próximo passo</span>
            <h3 className="text-[32px] md:text-[40px] font-semibold text-av-text mb-4 tracking-tight leading-tight">
              {caseItem.final_cta_heading || 'Sua agência vai ser o próximo case?'}
            </h3>
            <p className="text-[18px] text-av-text-secondary mb-10 max-w-xl mx-auto leading-[1.7]">
              {caseItem.final_cta_body ||
                'Aplique para a Mentoria Agência de Valor e estruture sua agência para os R$100k todo mês.'}
            </p>
            <div className="flex justify-center">
              <ButtonAV asChild>
                <a href={caseItem.final_cta_url || '#'}>{caseItem.final_cta_label || 'Aplicar agora'}</a>
              </ButtonAV>
            </div>
          </section>

          {/* Navegação entre cases */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center pt-10 pb-8 gap-6 border-t border-av-border">
            <Button variant="av-outline" asChild className="rounded-md px-6 h-11 font-medium">
              <Link to="/">Ver todos os cases</Link>
            </Button>

            {nextCase ? (
              <div className="sm:absolute right-0 top-1/2 sm:-translate-y-1/2 mt-4 sm:mt-0">
                <Link to={`/cases/${nextCase.slug}`} className="group flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="eyebrow-av mb-1">Próximo case</span>
                    <span className="text-[18px] font-semibold text-av-text group-hover:text-gradient-av transition-colors">
                      {nextCase.title}
                    </span>
                  </div>
                  <div className="h-11 w-11 rounded-full border border-av-border flex items-center justify-center group-hover:border-av-orange/50 transition-colors">
                    <ArrowRight className="h-5 w-5 text-av-text" />
                  </div>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
