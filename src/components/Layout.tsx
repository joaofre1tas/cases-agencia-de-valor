import { useMemo, type ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ButtonAV } from '@/components/ui/button'
import { Mail, MapPin, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { flatRecordToFormValues, mergeSiteSettingsRows, useSiteSettings } from '@/lib/site-settings'
import { sanitizeRichHtml } from '@/lib/markdown'
import {
  responsiveAlignClasses,
  responsiveFlexColItemsClasses,
  responsiveFlexWrapJustifyClasses,
  responsiveFontClasses,
} from '@/lib/responsive-site-ui'
import { cn } from '@/lib/utils'

function SmartNavLink({
  href,
  children,
  className,
  openInNewTab,
}: {
  href: string
  children: ReactNode
  className?: string
  openInNewTab?: boolean
}) {
  const blank = openInNewTab === true
  const rel = blank ? 'noopener noreferrer' : undefined
  const target = blank ? '_blank' : undefined
  const isInternalApp = href.startsWith('/') && !href.startsWith('//')
  if (isInternalApp) {
    return (
      <Link to={href} className={className} target={target} rel={rel}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className} target={target} rel={rel}>
      {children}
    </a>
  )
}

function SocialIcon({ platform }: { platform: string }) {
  const cls = 'h-4 w-4 shrink-0 text-av-text-muted'
  if (platform === 'linkedin') return <Linkedin className={cls} />
  if (platform === 'youtube') return <Youtube className={cls} />
  return <Instagram className={cls} />
}

export default function Layout() {
  const siteSettingsQuery = useSiteSettings()
  const { header, footer } = useMemo(() => {
    const map = siteSettingsQuery.data ?? mergeSiteSettingsRows([])
    const full = flatRecordToFormValues(map)
    return { header: full.header, footer: full.footer }
  }, [siteSettingsQuery.data])

  const fa = footer.section_alignments

  const sloganClass = cn(
    'leading-[1.7] text-av-text-secondary',
    responsiveFontClasses(footer.slogan_typography),
  )

  const badgeStripClass = cn(
    'mt-6 flex flex-wrap items-center gap-2',
    responsiveFontClasses(footer.badges_typography),
    responsiveFlexWrapJustifyClasses(fa.badges),
  )

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-av-border bg-av-bg/85 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1350px]">
          <Link
            to="/"
            className="flex items-center transition-opacity hover:opacity-90"
            aria-label="Agência de Valor — página inicial"
          >
            <Logo variant="full" className="h-8 w-auto" />
          </Link>

          <ButtonAV asChild>
            <a href={header.cta_url}>{header.cta_label}</a>
          </ButtonAV>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-av-bg pt-16 pb-8 mt-20 border-t border-av-border relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 opacity-100"
          aria-hidden
        >
          <svg
            viewBox="0 0 969.83 644.31"
            className="h-[420px] w-[420px]"
            fill="hsl(var(--av-wm-fill))"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M0,644.31h182.3l51.04-115.83h255.22l43.75,115.83h175.01L969.83,0h-189.59l-153.13,398.17L473.98,0h-196.88L0,644.31ZM291.68,390.93h138.55l-72.92-180.98-65.63,180.98Z"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 max-w-[1350px] relative z-10">
          <div className="flex flex-col md:flex-row md:flex-wrap gap-x-12 gap-y-12 mb-16 md:justify-between">
            <div className="md:max-w-sm shrink-0 flex flex-col gap-6">
              <div
                className={cn(
                  'flex flex-col gap-6',
                  responsiveAlignClasses(fa.slogan),
                  responsiveFlexColItemsClasses(fa.slogan),
                )}
              >
                <Link to="/" className="inline-block mb-0">
                  <Logo variant="full" className="h-8 w-auto" />
                </Link>
                <div
                  className={sloganClass}
                  dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(footer.slogan_html) }}
                />
              </div>
              {footer.badges.some((b) => b.enabled !== false && b.label.trim()) ? (
                <div
                  className={cn(
                    responsiveAlignClasses(fa.badges),
                    responsiveFlexColItemsClasses(fa.badges),
                  )}
                >
                  <div className={badgeStripClass}>
                    {footer.badges
                      .filter((b) => b.enabled !== false && b.label.trim())
                      .map((b, i) => (
                        <span key={`${b.label}-${i}`} className="badge-av">
                          {b.label}
                        </span>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>

            {footer.show_menu_section ? (
              <div className={cn('md:min-w-[160px]', responsiveAlignClasses(fa.menu))}>
                <h4 className="eyebrow-av mb-5">Menu</h4>
                <ul className="space-y-3 text-sm text-av-text-secondary">
                  {footer.menu_links
                    .filter((l) => l.enabled !== false)
                    .map((item) => (
                      <li key={`${item.label}-${item.href}`}>
                        <SmartNavLink
                          href={item.href}
                          openInNewTab={item.openInNewTab}
                          className="hover:text-av-text transition-colors"
                        >
                          {item.label}
                        </SmartNavLink>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}

            {footer.show_contact_section ? (
              <div className={cn('md:min-w-[200px]', responsiveAlignClasses(fa.contact))}>
                <h4 className="eyebrow-av mb-5">Contato</h4>
                <ul className="space-y-3 text-sm text-av-text-secondary">
                  <li
                    className={cn(
                      'flex items-center gap-3',
                      responsiveFlexWrapJustifyClasses(fa.contact),
                    )}
                  >
                    <Mail className="h-4 w-4 shrink-0 text-av-text-muted" />
                    <a
                      href={`mailto:${footer.contact_email}`}
                      className="hover:text-av-text transition-colors"
                    >
                      {footer.contact_email}
                    </a>
                  </li>
                  <li
                    className={cn(
                      'flex items-start gap-3',
                      responsiveFlexWrapJustifyClasses(fa.contact),
                    )}
                  >
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-av-text-muted" />
                    <span>{footer.location}</span>
                  </li>
                </ul>
              </div>
            ) : null}

            {footer.show_social_section ? (
              <div className={cn('md:min-w-[180px]', responsiveAlignClasses(fa.social))}>
                <h4 className="eyebrow-av mb-5">Redes</h4>
                <ul className="space-y-3 text-sm text-av-text-secondary">
                  {footer.social
                    .filter((s) => s.enabled !== false)
                    .map((s) => (
                      <li
                        key={`${s.platform}-${s.label}`}
                        className={cn('flex', responsiveFlexWrapJustifyClasses(fa.social))}
                      >
                        <SmartNavLink
                          href={s.url}
                          openInNewTab={s.openInNewTab}
                          className="flex items-center gap-3 hover:text-av-text transition-colors"
                        >
                          <SocialIcon platform={s.platform} />
                          <span>{s.label}</span>
                        </SmartNavLink>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div
            className={cn(
              'pt-8 border-t border-av-border flex flex-col md:flex-row gap-4 text-xs text-av-text-muted',
              responsiveAlignClasses(fa.bottom),
              responsiveFlexColItemsClasses(fa.bottom),
              'md:flex-row md:flex-wrap',
              responsiveFlexWrapJustifyClasses(fa.bottom),
            )}
          >
            <p>{footer.copyright}</p>
            <div className="flex flex-wrap items-center gap-6">
              {footer.legal_links
                .filter((l) => l.enabled !== false)
                .map((l) => (
                  <SmartNavLink
                    key={`${l.label}-${l.href}`}
                    href={l.href}
                    openInNewTab={l.openInNewTab}
                    className="hover:text-av-text transition-colors"
                  >
                    {l.label}
                  </SmartNavLink>
                ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
