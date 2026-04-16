import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, ImageIcon } from 'lucide-react'
import type { CaseWithMetrics } from '@/lib/cases'

export function CaseCard({ caseItem }: { caseItem: CaseWithMetrics }) {
  return (
    <Card className="flex flex-col h-full card-av hover-glow-av overflow-hidden">
      {/* Capa / logo do case */}
      <div className="relative h-48 flex items-center justify-center border-b border-av-border bg-av-bg overflow-hidden">
        {/* Linha de gradiente sutil no topo da capa */}
        <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-gradient-av opacity-60" />

        {!caseItem.logo_url ? (
          <div className="flex flex-col items-center text-av-text-muted">
            <ImageIcon className="h-8 w-8 mb-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Sem imagem</span>
          </div>
        ) : (
          <img
            src={caseItem.logo_url}
            alt={caseItem.title}
            className="max-h-16 max-w-[160px] object-contain opacity-90"
          />
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-6 md:p-7">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar className="h-9 w-9 mt-0.5 border border-av-border shrink-0">
              <AvatarImage src={caseItem.avatar_url || undefined} />
              <AvatarFallback className="bg-av-surface-2 text-av-text-secondary text-xs font-semibold">
                {caseItem.title.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-av-text leading-[1.3] truncate">
              {caseItem.title}
            </h3>
          </div>
          <ArrowUpRight className="h-5 w-5 text-av-text-muted shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        <p className="text-av-text-secondary text-sm md:text-[15px] leading-[1.65] mb-8 line-clamp-3">
          {caseItem.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-auto pt-5 border-t border-av-border">
          {caseItem.metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="font-semibold text-av-text text-[17px] text-gradient-av">
                {metric.value}
              </span>
              <span className="text-av-text-muted text-[11px] uppercase tracking-wider font-medium">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
