import { useEffect, useMemo, useRef } from 'react'
import { Mark, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import { Toggle } from '@/components/ui/toggle'
import { Bold } from 'lucide-react'

/** Marca Tiptap → `<span class="text-gradient-av">` (parse/render alinhados ao site). */
export const GradientMark = Mark.create({
  name: 'gradientMark',
  inclusive: true,
  parseHTML() {
    return [
      {
        tag: 'span[class]',
        getAttrs: (el) => {
          const node = el as HTMLElement
          return node.classList.contains('text-gradient-av') ? {} : false
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ class: 'text-gradient-av' }, HTMLAttributes), 0]
  },
})

interface RichTextMiniProps {
  value: string
  onChange: (value: string) => void
  label: string
}

export default function RichTextMini({ value, onChange, label }: RichTextMiniProps) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const lastEmittedHtml = useRef<string | null>(null)
  const initialContentRef = useRef(value || '<p></p>')

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        italic: false,
        strike: false,
        code: false,
      }),
      GradientMark,
    ],
    [],
  )

  const editorProps = useMemo(
    () => ({
      attributes: {
        class:
          'min-h-[160px] rounded-md border border-av-border bg-av-bg p-3 text-av-text focus:outline-none prose prose-invert max-w-none text-sm',
      },
    }),
    [],
  )

  const editor = useEditor(
    {
      extensions,
      editorProps,
      content: initialContentRef.current,
      onUpdate: ({ editor: current }) => {
        const html = current.getHTML()
        lastEmittedHtml.current = html
        onChangeRef.current(html)
      },
    },
    [],
  )

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    if (value === lastEmittedHtml.current) return
    editor.commands.setContent(value || '<p></p>', { emitUpdate: false })
    lastEmittedHtml.current = value || '<p></p>'
  }, [value, editor])

  return (
    <div className="space-y-2">
      <label className="text-sm text-av-text-secondary">{label}</label>
      <div className="flex flex-wrap items-center gap-2 border border-av-border rounded-md bg-av-surface p-1">
        <Toggle
          pressed={editor?.isActive('bold') ?? false}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          aria-label="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor?.isActive('gradientMark') ?? false}
          onPressedChange={() => editor?.chain().focus().toggleMark('gradientMark').run()}
          aria-label="Destaque em gradiente"
          className="text-xs px-2"
        >
          Destaque
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
