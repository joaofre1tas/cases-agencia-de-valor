import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CaseData } from '@/data/cases'

export function CaseCard({ caseItem }: { caseItem: CaseData }) {
  return (
    <Card className="flex flex-col h-full bg-white border-[#E6E8EB] rounded-2xl overflow-hidden hover:shadow-elevation transition-all duration-300">
      {/* Top half / Logo area */}
      <div
        className={`h-48 flex items-center justify-center border-b border-[#E6E8EB]/50 ${!caseItem.logo ? 'bg-gradient-to-br from-teal-50 to-[#F6F7F9]/50' : 'bg-[#F6F7F9]/50'}`}
      >
        {!caseItem.logo ? (
          <div className="flex flex-col items-center text-teal-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-sm font-medium">Imagem de Capa</span>
          </div>
        ) : (
          <img
            src={caseItem.logo}
            alt={caseItem.title}
            className="max-h-16 max-w-[160px] object-contain mix-blend-multiply"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-8 w-8 mt-1 border border-[#E6E8EB] shrink-0">
            <AvatarImage src={caseItem.avatar} />
            <AvatarFallback>{caseItem.title.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="text-[18px] md:text-[20px] font-semibold text-[#0B0D12] leading-[1.3]">
            {caseItem.title}
          </h3>
        </div>

        <p className="text-[#5F6368] text-sm md:text-base mb-8 line-clamp-3">
          {caseItem.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-auto mb-8">
          {caseItem.metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="font-semibold text-[#0B0D12] text-base">{metric.value}</span>
              <span className="text-[#5F6368] text-xs md:text-sm">{metric.label}</span>
            </div>
          ))}
        </div>

        <Link
          to={`#case-${caseItem.id}`}
          className="group flex items-center gap-2 text-sm font-semibold text-[#0B0D12] hover:text-[#02162A] transition-colors mt-auto w-fit"
        >
          Ler caso completo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  )
}
