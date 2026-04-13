import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/data/testimonials'

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
  }

  return (
    <Card
      className={cn(
        'rounded-[16px] border-[#E6E8EB] bg-white shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col gap-4',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-[#E6E8EB]">
          <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
          <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
            {getInitials(testimonial.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-[16px] font-medium leading-none text-[#0B0D12]">
            {testimonial.name}
          </h3>
          <p className="text-[12px] text-[#5F6368] mt-1 leading-[1.66]">
            {testimonial.role} @ {testimonial.company}
          </p>
        </div>
      </div>
      <p className="text-[14px] text-[#0B0D12] leading-relaxed">"{testimonial.content}"</p>
    </Card>
  )
}
