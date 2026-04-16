import { cn } from '@/lib/utils'

/** Presets mapeados para classes Tailwind (literais para o JIT não purgar). */
export type TextSizePreset = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export type TextAlignMode = 'left' | 'center' | 'right' | 'justify'

export type ResponsiveSize = {
  mobile: TextSizePreset
  tablet: TextSizePreset
  desktop: TextSizePreset
}

export type ResponsiveAlign = {
  mobile: TextAlignMode
  tablet: TextAlignMode
  desktop: TextAlignMode
}

const SIZE_MOBILE: Record<TextSizePreset, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

const SIZE_TABLET: Record<TextSizePreset, string> = {
  xs: 'md:text-xs',
  sm: 'md:text-sm',
  base: 'md:text-base',
  lg: 'md:text-lg',
  xl: 'md:text-xl',
  '2xl': 'md:text-2xl',
  '3xl': 'md:text-3xl',
  '4xl': 'md:text-4xl',
}

const SIZE_DESKTOP: Record<TextSizePreset, string> = {
  xs: 'lg:text-xs',
  sm: 'lg:text-sm',
  base: 'lg:text-base',
  lg: 'lg:text-lg',
  xl: 'lg:text-xl',
  '2xl': 'lg:text-2xl',
  '3xl': 'lg:text-3xl',
  '4xl': 'lg:text-4xl',
}

const ALIGN_MOBILE: Record<TextAlignMode, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const ALIGN_TABLET: Record<TextAlignMode, string> = {
  left: 'md:text-left',
  center: 'md:text-center',
  right: 'md:text-right',
  justify: 'md:text-justify',
}

const ALIGN_DESKTOP: Record<TextAlignMode, string> = {
  left: 'lg:text-left',
  center: 'lg:text-center',
  right: 'lg:text-right',
  justify: 'lg:text-justify',
}

export function responsiveFontClasses(r: ResponsiveSize): string {
  return cn(SIZE_MOBILE[r.mobile], SIZE_TABLET[r.tablet], SIZE_DESKTOP[r.desktop])
}

export function responsiveAlignClasses(r: ResponsiveAlign): string {
  return cn(ALIGN_MOBILE[r.mobile], ALIGN_TABLET[r.tablet], ALIGN_DESKTOP[r.desktop])
}

/** `flex flex-col`: posiciona o eixo cruzado (horizontal) conforme o alinhamento do texto. */
const FLEX_COL_ITEMS_MOBILE: Record<TextAlignMode, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
  justify: 'items-stretch',
}

const FLEX_COL_ITEMS_TABLET: Record<TextAlignMode, string> = {
  left: 'md:items-start',
  center: 'md:items-center',
  right: 'md:items-end',
  justify: 'md:items-stretch',
}

const FLEX_COL_ITEMS_DESKTOP: Record<TextAlignMode, string> = {
  left: 'lg:items-start',
  center: 'lg:items-center',
  right: 'lg:items-end',
  justify: 'lg:items-stretch',
}

export function responsiveFlexColItemsClasses(r: ResponsiveAlign): string {
  return cn(
    FLEX_COL_ITEMS_MOBILE[r.mobile],
    FLEX_COL_ITEMS_TABLET[r.tablet],
    FLEX_COL_ITEMS_DESKTOP[r.desktop],
  )
}

/** `flex flex-wrap`: alinha a faixa de badges/chips ao texto. */
const FLEX_WRAP_JUSTIFY_MOBILE: Record<TextAlignMode, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  justify: 'justify-between',
}

const FLEX_WRAP_JUSTIFY_TABLET: Record<TextAlignMode, string> = {
  left: 'md:justify-start',
  center: 'md:justify-center',
  right: 'md:justify-end',
  justify: 'md:justify-between',
}

const FLEX_WRAP_JUSTIFY_DESKTOP: Record<TextAlignMode, string> = {
  left: 'lg:justify-start',
  center: 'lg:justify-center',
  right: 'lg:justify-end',
  justify: 'lg:justify-between',
}

export function responsiveFlexWrapJustifyClasses(r: ResponsiveAlign): string {
  return cn(
    FLEX_WRAP_JUSTIFY_MOBILE[r.mobile],
    FLEX_WRAP_JUSTIFY_TABLET[r.tablet],
    FLEX_WRAP_JUSTIFY_DESKTOP[r.desktop],
  )
}

export type FooterSectionAlignments = {
  slogan: ResponsiveAlign
  badges: ResponsiveAlign
  menu: ResponsiveAlign
  contact: ResponsiveAlign
  social: ResponsiveAlign
  bottom: ResponsiveAlign
}

export const DEFAULT_FOOTER_SECTION_ALIGNMENTS: FooterSectionAlignments = {
  slogan: { mobile: 'left', tablet: 'left', desktop: 'left' },
  badges: { mobile: 'left', tablet: 'left', desktop: 'left' },
  menu: { mobile: 'left', tablet: 'left', desktop: 'left' },
  contact: { mobile: 'left', tablet: 'left', desktop: 'left' },
  social: { mobile: 'left', tablet: 'left', desktop: 'left' },
  bottom: { mobile: 'left', tablet: 'left', desktop: 'left' },
}

export function parseFooterSectionAlignments(
  v: unknown,
  fallback: FooterSectionAlignments,
): FooterSectionAlignments {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { ...fallback }
  const o = v as Record<string, unknown>
  return {
    slogan: parseResponsiveAlign(o.slogan, fallback.slogan),
    badges: parseResponsiveAlign(o.badges, fallback.badges),
    menu: parseResponsiveAlign(o.menu, fallback.menu),
    contact: parseResponsiveAlign(o.contact, fallback.contact),
    social: parseResponsiveAlign(o.social, fallback.social),
    bottom: parseResponsiveAlign(o.bottom, fallback.bottom),
  }
}

export const TEXT_SIZE_OPTIONS: { value: TextSizePreset; label: string }[] = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'base', label: 'Base' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
]

export const TEXT_ALIGN_OPTIONS: { value: TextAlignMode; label: string }[] = [
  { value: 'left', label: 'Esquerda' },
  { value: 'center', label: 'Centro' },
  { value: 'right', label: 'Direita' },
  { value: 'justify', label: 'Justificar' },
]

export function isTextSizePreset(x: unknown): x is TextSizePreset {
  return (
    x === 'xs' ||
    x === 'sm' ||
    x === 'base' ||
    x === 'lg' ||
    x === 'xl' ||
    x === '2xl' ||
    x === '3xl' ||
    x === '4xl'
  )
}

export function isTextAlignMode(x: unknown): x is TextAlignMode {
  return x === 'left' || x === 'center' || x === 'right' || x === 'justify'
}

export function parseResponsiveSize(
  v: unknown,
  fallback: ResponsiveSize,
): ResponsiveSize {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { ...fallback }
  const o = v as Record<string, unknown>
  const m = isTextSizePreset(o.mobile) ? o.mobile : fallback.mobile
  const t = isTextSizePreset(o.tablet) ? o.tablet : fallback.tablet
  const d = isTextSizePreset(o.desktop) ? o.desktop : fallback.desktop
  return { mobile: m, tablet: t, desktop: d }
}

export function parseResponsiveAlign(
  v: unknown,
  fallback: ResponsiveAlign,
): ResponsiveAlign {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { ...fallback }
  const o = v as Record<string, unknown>
  const m = isTextAlignMode(o.mobile) ? o.mobile : fallback.mobile
  const t = isTextAlignMode(o.tablet) ? o.tablet : fallback.tablet
  const d = isTextAlignMode(o.desktop) ? o.desktop : fallback.desktop
  return { mobile: m, tablet: t, desktop: d }
}

export const DEFAULT_CASES_ALIGN: ResponsiveAlign = {
  mobile: 'left',
  tablet: 'left',
  desktop: 'left',
}

export const DEFAULT_HERO_ALIGN: ResponsiveAlign = {
  mobile: 'left',
  tablet: 'left',
  desktop: 'left',
}

export const DEFAULT_CASES_TYPOGRAPHY: {
  eyebrow: ResponsiveSize
  title: ResponsiveSize
} = {
  eyebrow: { mobile: 'sm', tablet: 'sm', desktop: 'base' },
  title: { mobile: '3xl', tablet: '3xl', desktop: '4xl' },
}

export const DEFAULT_SLOGAN_TYPOGRAPHY: ResponsiveSize = {
  mobile: 'sm',
  tablet: 'sm',
  desktop: 'base',
}

export const DEFAULT_FOOTER_BADGES_TYPOGRAPHY: ResponsiveSize = {
  mobile: 'xs',
  tablet: 'xs',
  desktop: 'sm',
}
