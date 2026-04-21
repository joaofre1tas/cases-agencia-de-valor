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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {prints.map((item) => (
        <figure
          key={item.id}
          className="card-av overflow-hidden border border-av-border bg-av-surface shadow-elevation"
        >
          <img
            src={item.image_url}
            alt={item.alt_text || 'Print de comemoração de contrato no grupo de mentorados'}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover"
          />
        </figure>
      ))}
    </div>
  )
}
