import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { TestimonialCard } from '@/components/TestimonialCard'
import { testimonials } from '@/data/testimonials'

export default function Index() {
  const gridRef = useRef<HTMLDivElement>(null)

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
        observer.observe(child)
      })
    }

    return () => observer.disconnect()
  }, [])

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

      {/* Testimonials Grid Section */}
      <section className="bg-[#F6F7F9]/30 py-20 lg:py-32" id="cases">
        <div className="container mx-auto px-4 max-w-[1350px]">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#0B0D12] mb-4">
              A comunidade que mais cresce
            </h2>
            <p className="text-[#5F6368] text-lg">
              Conheça as histórias reais de quem já implementou nossas soluções e mudou o patamar de
              seus resultados.
            </p>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="opacity-0 translate-y-4 transition-all duration-500 ease-out"
                style={{ willChange: 'opacity, transform' }}
              >
                <TestimonialCard testimonial={testimonial} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
