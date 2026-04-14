import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function CaseStudy() {
  const { id } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-[900px] pt-12 pb-24">
        {/* Hero */}
        <div className="flex flex-col items-center mb-16 animate-fade-in-up">
          <div className="mb-8">
            <img
              src="https://img.usecurling.com/i?q=roi+lab&shape=outline&color=solid-black"
              alt="ROI Lab Digital"
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="text-[32px] md:text-[48px] font-semibold text-[#0B0D12] leading-[1.15] tracking-tight text-center mb-6 max-w-4xl">
            ROI Lab Digital: R$ 236.000 de Economia Anual com IA
          </h1>
          <Badge
            variant="outline"
            className="bg-[#F6F7F9] text-[#5F6368] border-[#E6E8EB] px-4 py-1.5 text-sm font-medium rounded-full mb-8"
          >
            Consultoria
          </Badge>
          <p className="text-[18px] text-[#5F6368] max-w-2xl mx-auto leading-relaxed text-center">
            Como a ROI Lab Digital utilizou Inteligência Artificial para escalar operações e
            otimizar custos com pessoal
          </p>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-12 border-b border-[#E6E8EB] pb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-[#5F6368] hover:text-[#0B0D12]">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E6E8EB]" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-[#5F6368] hover:text-[#0B0D12]">
                    Cases
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E6E8EB]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#0B0D12] font-medium">
                  ROI Lab Digital
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Content */}
        <div className="space-y-16">
          <section>
            <h2 className="text-[28px] font-semibold text-[#0B0D12] mb-6 tracking-tight">
              O Desafio
            </h2>
            <div className="bg-[#F6F7F9] rounded-[24px] p-8 md:p-10">
              <p className="text-[16px] text-[#5F6368] leading-[1.8]">
                A ROI Lab Digital, consultoria especializada em Outsourcing de Marketing e Vendas
                B2B, enfrentava um desafio crescente: a expansão de seus negócios vinha acompanhada
                de um aumento proporcional nos custos com pessoal. Cada novo cliente ou contrato
                significava a necessidade de contratar mais colaboradores em áreas como Inbound,
                CRM, Conteúdo, Performance e Vendas. Essa dependência de mão de obra humana ameaçava
                a sustentabilidade da margem de lucro a longo prazo, tornando imperativo encontrar
                uma solução que permitisse o crescimento sem inflar a estrutura de custos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-[28px] font-semibold text-[#0B0D12] mb-6 tracking-tight">
              A Solução
            </h2>
            <div className="bg-[#F6F7F9] rounded-[24px] p-8 md:p-10">
              <p className="text-[16px] text-[#5F6368] leading-[1.8]">
                A ROI Lab Digital implementou a Inteligência Artificial como uma solução estratégica
                para otimizar suas operações. Iniciando pela área de Tesouraria/BPO, a IA foi
                utilizada para automatizar processos e reduzir a dependência de recursos humanos.
                Esta iniciativa não só otimizou a gestão financeira, mas também demonstrou o
                potencial da IA para absorver o aumento da demanda de novos contratos sem a
                necessidade de novas contratações, provando ser um diferencial competitivo.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-[28px] font-semibold text-[#0B0D12] mb-6 tracking-tight">
              Os Resultados
            </h2>
            <div className="bg-[#F6F7F9] rounded-[24px] p-8 md:p-10">
              <p className="text-[16px] text-[#5F6368] leading-[1.8]">
                A implementação da IA gerou uma impressionante economia anual de R$ 236.000 para a
                ROI Lab Digital. Apenas na área de Tesouraria/BPO, a otimização de processos
                resultou em R$ 36.000 de economia por ano. O impacto mais significativo, no entanto,
                foi a capacidade de evitar a contratação de três novos profissionais — dois SDRs e
                um Mídia — que seriam necessários para atender a dois grandes contratos
                recém-adquiridos. Essa prevenção de novas contratações representou uma economia de
                R$ 200.000 anuais, solidificando a IA como um pilar fundamental para a
                escalabilidade e a manutenção das margens de lucro da empresa, abrindo caminho para
                futuros ganhos de sinergia e produtividade.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-[28px] font-semibold text-[#0B0D12] mb-8 tracking-tight">
              Métricas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <span className="text-[40px] md:text-[48px] font-semibold text-[#0B0D12] mb-2">
                  R$ 236.000
                </span>
                <span className="text-[#5F6368] text-[15px] font-medium">Economia Gerada</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-[40px] md:text-[48px] font-semibold text-[#0B0D12] mb-2">
                  3
                </span>
                <span className="text-[#5F6368] text-[15px] font-medium">
                  Contratações Evitadas
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-[40px] md:text-[48px] font-semibold text-[#0B0D12] mb-2">
                  R$ 200.000
                </span>
                <span className="text-[#5F6368] text-[15px] font-medium">Economia com Pessoal</span>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-[#F6F7F9] rounded-[24px] p-8 md:p-12 relative overflow-hidden">
              <Quote className="absolute top-8 left-8 h-20 w-20 text-black/[0.03] rotate-180" />
              <div className="relative z-10">
                <p className="text-[20px] md:text-[24px] leading-relaxed text-[#0B0D12] italic mb-10 font-medium">
                  "A implementação da IA foi um divisor de águas para a ROI Lab Digital. Conseguimos
                  expandir nossa capacidade operacional e absorver novos grandes contratos sem
                  comprometer nossa estrutura de custos, um resultado que antes parecia
                  inalcançável. A IA não é apenas uma ferramenta, é um pilar estratégico para nosso
                  crescimento sustentável."
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                      alt="Matheus Gonzaga"
                      className="h-14 w-14 rounded-full object-cover shadow-sm"
                    />
                    <div>
                      <div className="font-semibold text-[#0B0D12] text-[16px]">
                        Matheus Gonzaga
                      </div>
                      <div className="text-[14px] text-[#5F6368]">Founder • ROI Lab Digital</div>
                    </div>
                  </div>
                  <Button className="bg-[#0B0D12] text-white hover:bg-[#0B0D12]/90 rounded-xl px-6 h-12 w-full sm:w-auto font-medium transition-colors">
                    Visitar ROI Lab Digital
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-16">
            <h3 className="text-[32px] font-semibold text-[#0B0D12] mb-4 tracking-tight">
              Pronto para transformar seu negócio?
            </h3>
            <p className="text-[18px] text-[#5F6368] mb-8">
              Descubra como a IA pode revolucionar sua empresa
            </p>
            <Button className="bg-[#0B0D12] text-white hover:bg-[#0B0D12]/90 h-14 px-8 rounded-full text-[16px] font-medium shadow-elevation transition-all hover:scale-105 active:scale-95">
              Conhecer a Plataforma
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </section>

          {/* Navigation Footer */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center pt-8 pb-8 gap-6 border-t border-[#E6E8EB]">
            <Button
              variant="outline"
              asChild
              className="rounded-full px-8 h-12 border-[#E6E8EB] text-[#0B0D12] hover:bg-[#F6F7F9] font-medium"
            >
              <Link to="/">Ver todos os cases</Link>
            </Button>

            <div className="sm:absolute right-0 top-1/2 sm:-translate-y-1/2 mt-4 sm:mt-0">
              <Link to="/cases/orion" className="group flex items-center gap-4 text-right">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#5F6368] font-semibold uppercase tracking-widest mb-1">
                    Próximo Case
                  </span>
                  <span className="text-[18px] font-semibold text-[#0B0D12] group-hover:text-[#5F6368] transition-colors">
                    Orion
                  </span>
                </div>
                <div className="h-12 w-12 rounded-full border border-[#E6E8EB] flex items-center justify-center group-hover:bg-[#F6F7F9] transition-colors">
                  <ArrowRight className="h-5 w-5 text-[#0B0D12]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
