import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import { Toggle } from '@/components/ui/toggle'
import { Bold, Italic, List, ListOrdered, Link2 } from 'lucide-react'

interface RichTextFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
}

export default function RichTextField({ value, onChange, label }: RichTextFieldProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] rounded-md border border-av-border bg-av-bg p-3 text-av-text focus:outline-none prose prose-invert max-w-none',
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  })

  function setLink() {
    const previousUrl = editor?.getAttributes('link').href ?? ''
    const url = window.prompt('URL do link', previousUrl)
    if (!url) {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-av-text-secondary">{label}</label>
      <div className="flex items-center gap-2 border border-av-border rounded-md bg-av-surface p-1">
        <Toggle
          pressed={editor?.isActive('bold')}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          aria-label="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor?.isActive('italic')}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          aria-label="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor?.isActive('bulletList')}
          onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
          aria-label="Lista"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor?.isActive('orderedList')}
          onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
          aria-label="Lista ordenada"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor?.isActive('link')} onPressedChange={setLink} aria-label="Link">
          <Link2 className="h-4 w-4" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
