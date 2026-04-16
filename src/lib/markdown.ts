import DOMPurify from 'dompurify'

/**
 * HTML rico vindo do admin (Tiptap). O DOMPurify costuma preservar `class` em tags
 * permitidas — usamos principalmente `span.text-gradient-av` e negrito (`strong`/`b`).
 */
export function sanitizeRichHtml(html?: string | null) {
  if (!html) {
    return ''
  }
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style'],
  })
}
