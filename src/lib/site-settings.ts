import { useQuery } from '@tanstack/react-query'
import type { Json } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import {
  DEFAULT_CASES_ALIGN,
  DEFAULT_CASES_TYPOGRAPHY,
  DEFAULT_FOOTER_BADGES_TYPOGRAPHY,
  DEFAULT_FOOTER_SECTION_ALIGNMENTS,
  DEFAULT_HERO_ALIGN,
  DEFAULT_SLOGAN_TYPOGRAPHY,
  parseFooterSectionAlignments,
  parseResponsiveAlign,
  parseResponsiveSize,
  type FooterSectionAlignments,
  type ResponsiveAlign,
  type ResponsiveSize,
} from '@/lib/responsive-site-ui'

/** Chaves que o editor grava (flat). Inclui legado só leitura quando aplicável. */
export const SITE_SETTING_KEYS = [
  'home.hero.eyebrow',
  'home.hero.title_html',
  'home.hero.subtitle_html',
  'home.hero.badges',
  'home.hero.align',
  'home.cases.eyebrow',
  'home.cases.title_html',
  'home.cases.align',
  'home.cases.typography',
  'header.cta_label',
  'header.cta_url',
  'footer.slogan_html',
  'footer.badges',
  'footer.show_menu_section',
  'footer.show_contact_section',
  'footer.show_social_section',
  'footer.slogan_typography',
  'footer.badges_typography',
  'footer.section_alignments',
  'footer.menu_links',
  'footer.contact_email',
  'footer.location',
  'footer.social',
  'footer.copyright',
  'footer.legal_links',
] as const

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number]

export type HeroBadge = { label: string; enabled: boolean }

export type FooterMenuLink = {
  label: string
  href: string
  enabled: boolean
  openInNewTab: boolean
}

export type FooterSocialPlatform = 'instagram' | 'linkedin' | 'youtube'

export type FooterSocial = {
  platform: FooterSocialPlatform
  label: string
  url: string
  enabled: boolean
  openInNewTab: boolean
}

export type FooterLegalLink = {
  label: string
  href: string
  enabled: boolean
  openInNewTab: boolean
}

export type CasesTypography = {
  eyebrow: ResponsiveSize
  title: ResponsiveSize
}

/** Defaults + legado `footer.stat_badge` (migração). */
export const DEFAULT_SITE_SETTINGS: Record<string, Json> = {
  'home.hero.eyebrow': 'Cases · Agência de Valor',
  'home.hero.title_html':
    '<p>Agências reais faturando <span class="text-gradient-av">R$100k+</span> todo mês.</p>',
  'home.hero.subtitle_html':
    '<p>Mais de <span class="text-gradient-av font-semibold">R$126 milhões</span> em resultados gerados. Aqui estão os cases reais de donos que estruturaram o negócio dentro da Mentoria Agência de Valor.</p>',
  'home.hero.badges': [
    { label: '+412 calls individuais', enabled: true },
    { label: '100% individual', enabled: true },
  ],
  'home.hero.align': DEFAULT_HERO_ALIGN as unknown as Json,
  'home.cases.eyebrow': 'Todos os cases',
  'home.cases.title_html':
    '<p>Resultados <span class="text-gradient-av">auditáveis</span>, não promessas.</p>',
  'home.cases.align': DEFAULT_CASES_ALIGN as unknown as Json,
  'home.cases.typography': DEFAULT_CASES_TYPOGRAPHY as unknown as Json,
  'header.cta_label': 'Aplicar agora',
  'header.cta_url': '#',
  'footer.slogan_html':
    '<p>Mentoria premium para donos de agência que querem estruturar o negócio e faturar <span class="text-gradient-av font-semibold">R$100k todo mês</span>.</p>',
  'footer.stat_badge': '+ R$126M em resultados',
  'footer.badges': [{ label: '+ R$126M em resultados', enabled: true }] as unknown as Json,
  'footer.show_menu_section': true,
  'footer.show_contact_section': true,
  'footer.show_social_section': true,
  'footer.slogan_typography': DEFAULT_SLOGAN_TYPOGRAPHY as unknown as Json,
  'footer.badges_typography': DEFAULT_FOOTER_BADGES_TYPOGRAPHY as unknown as Json,
  'footer.section_alignments': DEFAULT_FOOTER_SECTION_ALIGNMENTS as unknown as Json,
  'footer.menu_links': [
    { label: 'Home', href: '/', enabled: true, openInNewTab: false },
    { label: 'Método', href: '#metodo', enabled: true, openInNewTab: false },
    { label: 'Resultados', href: '#resultados', enabled: true, openInNewTab: false },
    { label: 'Mentoria', href: '#mentoria', enabled: true, openInNewTab: false },
  ] as unknown as Json,
  'footer.contact_email': 'contato@agenciadevalor.com',
  'footer.location': 'Brasil · 100% online',
  'footer.social': [
    {
      platform: 'instagram',
      label: 'Instagram',
      url: '#',
      enabled: true,
      openInNewTab: false,
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: '#',
      enabled: true,
      openInNewTab: false,
    },
    {
      platform: 'youtube',
      label: 'YouTube',
      url: '#',
      enabled: true,
      openInNewTab: false,
    },
  ] as unknown as Json,
  'footer.copyright': '© 2026 Agência de Valor · AV. Todos os direitos reservados.',
  'footer.legal_links': [
    { label: 'Política de Privacidade', href: '#', enabled: true, openInNewTab: false },
    { label: 'Termos de Uso', href: '#', enabled: true, openInNewTab: false },
  ] as unknown as Json,
}

function cloneDefaultMap(): Record<string, Json> {
  return { ...DEFAULT_SITE_SETTINGS }
}

function getJsonString(map: Record<string, Json> | undefined, key: string, fallback: string) {
  const v = map?.[key]
  return typeof v === 'string' ? v : fallback
}

function getJsonBoolean(map: Record<string, Json> | undefined, key: string, fallback: boolean) {
  const v = map?.[key]
  return typeof v === 'boolean' ? v : fallback
}

function parseBadges(v: Json | undefined, fallback: HeroBadge[]): HeroBadge[] {
  if (!Array.isArray(v)) return fallback.map((b) => ({ ...b }))
  const out: HeroBadge[] = []
  for (const item of v) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const o = item as Record<string, Json>
      out.push({
        label: typeof o.label === 'string' ? o.label : '',
        enabled: o.enabled !== false,
      })
    }
  }
  return out.length ? out : fallback.map((b) => ({ ...b }))
}

function parseFooterBadges(map: Record<string, Json>): HeroBadge[] {
  const fromArr = parseBadges(map['footer.badges'], [])
  if (fromArr.length) return fromArr
  const legacy = getJsonString(map, 'footer.stat_badge', '')
  if (legacy.trim()) {
    return [{ label: legacy, enabled: true }]
  }
  return parseBadges(DEFAULT_SITE_SETTINGS['footer.badges'], [])
}

function parseMenuLinks(v: Json | undefined, fallback: FooterMenuLink[]): FooterMenuLink[] {
  if (!Array.isArray(v)) return fallback.map((b) => ({ ...b }))
  const out: FooterMenuLink[] = []
  for (const item of v) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const o = item as Record<string, Json>
      out.push({
        label: typeof o.label === 'string' ? o.label : '',
        href: typeof o.href === 'string' ? o.href : '#',
        enabled: o.enabled !== false,
        openInNewTab: o.openInNewTab === true,
      })
    }
  }
  return out.length ? out : fallback.map((b) => ({ ...b }))
}

const PLATFORMS: FooterSocialPlatform[] = ['instagram', 'linkedin', 'youtube']

function isPlatform(x: unknown): x is FooterSocialPlatform {
  return typeof x === 'string' && (PLATFORMS as string[]).includes(x)
}

function parseSocial(v: Json | undefined, fallback: FooterSocial[]): FooterSocial[] {
  if (!Array.isArray(v)) return fallback.map((b) => ({ ...b }))
  const out: FooterSocial[] = []
  for (const item of v) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const o = item as Record<string, Json>
      const platform = isPlatform(o.platform) ? o.platform : 'instagram'
      out.push({
        platform,
        label: typeof o.label === 'string' ? o.label : '',
        url: typeof o.url === 'string' ? o.url : '#',
        enabled: o.enabled !== false,
        openInNewTab: o.openInNewTab === true,
      })
    }
  }
  return out.length ? out : fallback.map((b) => ({ ...b }))
}

function parseLegal(v: Json | undefined, fallback: FooterLegalLink[]): FooterLegalLink[] {
  if (!Array.isArray(v)) return fallback.map((b) => ({ ...b }))
  const out: FooterLegalLink[] = []
  for (const item of v) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const o = item as Record<string, Json>
      out.push({
        label: typeof o.label === 'string' ? o.label : '',
        href: typeof o.href === 'string' ? o.href : '#',
        enabled: o.enabled !== false,
        openInNewTab: o.openInNewTab === true,
      })
    }
  }
  return out.length ? out : fallback.map((b) => ({ ...b }))
}

function parseCasesTypography(v: Json | undefined, fallback: CasesTypography): CasesTypography {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { ...fallback }
  const o = v as Record<string, unknown>
  return {
    eyebrow: parseResponsiveSize(o.eyebrow, fallback.eyebrow),
    title: parseResponsiveSize(o.title, fallback.title),
  }
}

export type SiteContentFormValues = {
  home: {
    hero: {
      eyebrow: string
      title_html: string
      subtitle_html: string
      badges: HeroBadge[]
      align: ResponsiveAlign
    }
    cases: {
      eyebrow: string
      title_html: string
      align: ResponsiveAlign
      typography: CasesTypography
    }
  }
  header: { cta_label: string; cta_url: string }
  footer: {
    slogan_html: string
    badges: HeroBadge[]
    show_menu_section: boolean
    show_contact_section: boolean
    show_social_section: boolean
    slogan_typography: ResponsiveSize
    badges_typography: ResponsiveSize
    section_alignments: FooterSectionAlignments
    menu_links: FooterMenuLink[]
    contact_email: string
    location: string
    social: FooterSocial[]
    copyright: string
    legal_links: FooterLegalLink[]
  }
}

/** Mescla linhas do banco; qualquer chave do Supabase sobrescreve o default. */
export function mergeSiteSettingsRows(rows: { key: string; value: Json }[] | null | undefined) {
  const map = cloneDefaultMap()
  for (const row of rows ?? []) {
    map[row.key] = row.value
  }
  return map
}

export async function listSiteSettings(): Promise<Record<string, Json>> {
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error) {
    throw error
  }
  return mergeSiteSettingsRows(data)
}

export function flatRecordToFormValues(map: Record<string, Json>): SiteContentFormValues {
  const fb = DEFAULT_SITE_SETTINGS
  const defaultCasesTypography = parseCasesTypography(
    fb['home.cases.typography'],
    DEFAULT_CASES_TYPOGRAPHY,
  )
  return {
    home: {
      hero: {
        eyebrow: getJsonString(map, 'home.hero.eyebrow', fb['home.hero.eyebrow'] as string),
        title_html: getJsonString(map, 'home.hero.title_html', fb['home.hero.title_html'] as string),
        subtitle_html: getJsonString(
          map,
          'home.hero.subtitle_html',
          fb['home.hero.subtitle_html'] as string,
        ),
        badges: parseBadges(map['home.hero.badges'], parseBadges(fb['home.hero.badges'], [])),
        align: parseResponsiveAlign(map['home.hero.align'], DEFAULT_HERO_ALIGN),
      },
      cases: {
        eyebrow: getJsonString(map, 'home.cases.eyebrow', fb['home.cases.eyebrow'] as string),
        title_html: getJsonString(map, 'home.cases.title_html', fb['home.cases.title_html'] as string),
        align: parseResponsiveAlign(map['home.cases.align'], DEFAULT_CASES_ALIGN),
        typography: parseCasesTypography(map['home.cases.typography'], defaultCasesTypography),
      },
    },
    header: {
      cta_label: getJsonString(map, 'header.cta_label', fb['header.cta_label'] as string),
      cta_url: getJsonString(map, 'header.cta_url', fb['header.cta_url'] as string),
    },
    footer: {
      slogan_html: getJsonString(map, 'footer.slogan_html', fb['footer.slogan_html'] as string),
      badges: parseFooterBadges(map),
      show_menu_section: getJsonBoolean(map, 'footer.show_menu_section', true),
      show_contact_section: getJsonBoolean(map, 'footer.show_contact_section', true),
      show_social_section: getJsonBoolean(map, 'footer.show_social_section', true),
      slogan_typography: parseResponsiveSize(
        map['footer.slogan_typography'],
        parseResponsiveSize(fb['footer.slogan_typography'], DEFAULT_SLOGAN_TYPOGRAPHY),
      ),
      badges_typography: parseResponsiveSize(
        map['footer.badges_typography'],
        parseResponsiveSize(fb['footer.badges_typography'], DEFAULT_FOOTER_BADGES_TYPOGRAPHY),
      ),
      section_alignments: parseFooterSectionAlignments(
        map['footer.section_alignments'],
        parseFooterSectionAlignments(fb['footer.section_alignments'], DEFAULT_FOOTER_SECTION_ALIGNMENTS),
      ),
      menu_links: parseMenuLinks(
        map['footer.menu_links'],
        parseMenuLinks(fb['footer.menu_links'] as Json, []),
      ),
      contact_email: getJsonString(map, 'footer.contact_email', fb['footer.contact_email'] as string),
      location: getJsonString(map, 'footer.location', fb['footer.location'] as string),
      social: parseSocial(map['footer.social'], parseSocial(fb['footer.social'] as Json, [])),
      copyright: getJsonString(map, 'footer.copyright', fb['footer.copyright'] as string),
      legal_links: parseLegal(
        map['footer.legal_links'],
        parseLegal(fb['footer.legal_links'] as Json, []),
      ),
    },
  }
}

export const defaultSiteContentFormValues: SiteContentFormValues = flatRecordToFormValues(
  mergeSiteSettingsRows([]),
)

export function formValuesToFlatRecord(values: SiteContentFormValues): Record<string, Json> {
  return {
    'home.hero.eyebrow': values.home.hero.eyebrow,
    'home.hero.title_html': values.home.hero.title_html,
    'home.hero.subtitle_html': values.home.hero.subtitle_html,
    'home.hero.badges': values.home.hero.badges as unknown as Json,
    'home.hero.align': values.home.hero.align as unknown as Json,
    'home.cases.eyebrow': values.home.cases.eyebrow,
    'home.cases.title_html': values.home.cases.title_html,
    'home.cases.align': values.home.cases.align as unknown as Json,
    'home.cases.typography': values.home.cases.typography as unknown as Json,
    'header.cta_label': values.header.cta_label,
    'header.cta_url': values.header.cta_url,
    'footer.slogan_html': values.footer.slogan_html,
    'footer.badges': values.footer.badges as unknown as Json,
    'footer.show_menu_section': values.footer.show_menu_section,
    'footer.show_contact_section': values.footer.show_contact_section,
    'footer.show_social_section': values.footer.show_social_section,
    'footer.slogan_typography': values.footer.slogan_typography as unknown as Json,
    'footer.badges_typography': values.footer.badges_typography as unknown as Json,
    'footer.section_alignments': values.footer.section_alignments as unknown as Json,
    'footer.menu_links': values.footer.menu_links as unknown as Json,
    'footer.contact_email': values.footer.contact_email,
    'footer.location': values.footer.location,
    'footer.social': values.footer.social as unknown as Json,
    'footer.copyright': values.footer.copyright,
    'footer.legal_links': values.footer.legal_links as unknown as Json,
  }
}

export async function updateSiteSettings(updates: Record<string, Json>) {
  const rows = Object.entries(updates).map(([key, value]) => ({ key, value }))
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) {
    throw error
  }
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: listSiteSettings,
    staleTime: 1000 * 60 * 5,
  })
}
