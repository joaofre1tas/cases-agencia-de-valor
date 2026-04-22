import type { BellPrintRow } from '@/lib/bells'

export function BellPrintsGallery({ prints }: { prints: BellPrintRow[] }) {
  if (prints.length === 0) {
    return (
      <div className="card-av p-8 text-center text-av-text-muted">
        Ainda não temos prints publicados para a aba de sinos.
      </div>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 lg:gap-6 [column-fill:_balance]">
      {prints.map((item) => (
        <figure
          key={item.id}
          className="mb-5 lg:mb-6 break-inside-avoid card-av overflow-hidden border border-av-border bg-av-surface shadow-elevation"
        >
          <img
            src={item.image_url}
            alt={item.alt_text || 'Print de comemoração de contrato no grupo de mentorados'}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain"
          />
        </figure>
      ))}
    </div>
  )
}
