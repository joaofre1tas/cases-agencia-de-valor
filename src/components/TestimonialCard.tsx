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
        'card-av hover-glow-av p-6 flex flex-col gap-4 shadow-subtle',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-av-border">
          <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
          <AvatarFallback className="bg-av-surface-2 text-av-text-secondary text-xs font-semibold">
            {getInitials(testimonial.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-[15px] font-semibold leading-none text-av-text">
            {testimonial.name}
          </h3>
          <p className="text-[12px] text-av-text-muted mt-1 leading-[1.66]">
            {testimonial.role} @ {testimonial.company}
          </p>
        </div>
      </div>
      <p className="text-[14px] text-av-text-secondary leading-relaxed">
        "{testimonial.content}"
      </p>
    </Card>
  )
}
