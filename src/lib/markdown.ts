import DOMPurify from 'dompurify'

export function sanitizeRichHtml(html?: string | null) {
  if (!html) {
    return ''
  }
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style'],
  })
}
