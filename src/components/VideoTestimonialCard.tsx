import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { youtubeEmbedUrl, youtubeThumbUrl } from '@/lib/youtube'
import type { TestimonialVideoWithMetrics } from '@/lib/testimonial-videos'

export function VideoTestimonialCard({ item }: { item: TestimonialVideoWithMetrics }) {
  const embedUrl = youtubeEmbedUrl(item.youtube_video_id)
  const thumbnailUrl = youtubeThumbUrl(item.youtube_video_id)

  return (
    <Card className="flex flex-col h-full card-av hover-glow-av overflow-hidden">
      <div className="relative aspect-video border-b border-av-border bg-av-bg overflow-hidden">
        {embedUrl ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl}
            title={`Depoimento em vídeo — ${item.agency_name}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Thumbnail do depoimento — ${item.agency_name}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-av-text-muted">
            Link de vídeo inválido.
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6 md:p-7">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10 mt-0.5 border border-av-border shrink-0">
            <AvatarImage src={item.founder_avatar_url || undefined} />
            <AvatarFallback className="bg-av-surface-2 text-av-text-secondary text-xs font-semibold">
              {item.founder_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="text-[18px] md:text-[20px] font-semibold text-av-text leading-[1.3]">
              {item.headline}
            </h3>
            <p className="text-sm text-av-text-secondary mt-1">{item.founder_name}</p>
          </div>
        </div>

        {item.description ? (
          <p className="text-av-text-secondary text-sm md:text-[15px] leading-[1.65] mb-6 line-clamp-3">
            {item.description}
          </p>
        ) : null}

        <div className="mt-auto">
          <div className="text-sm text-av-text-secondary">
            <span className="font-semibold text-av-text">{item.agency_name}</span>
            <span className="mx-2 text-av-border">•</span>
            <span className="uppercase tracking-wider">{item.segment}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-av-border">
            {item.metrics.map((metric, idx) => (
              <div key={`${item.id}-metric-${idx}`} className="flex flex-col gap-1">
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
      </div>
    </Card>
  )
}
