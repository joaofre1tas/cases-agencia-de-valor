import { useState, type ChangeEvent } from 'react'
import { Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadAsset } from '@/lib/cases'

interface ImageFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
}

export default function ImageField({ label, value, onChange, folder = 'cases' }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setUploading(true)
    try {
      const url = await uploadAsset(file, folder)
      onChange(url)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-av-text-secondary">{label}</label>
      <div className="flex gap-2">
        <Input
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Cole a URL da imagem"
          className="bg-av-bg border-av-border"
        />
        <Button type="button" variant="av-outline" className="relative overflow-hidden">
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Enviando...' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </Button>
      </div>
      {value ? (
        <img
          src={value}
          alt={label}
          className="h-16 w-auto max-w-[240px] object-contain rounded-md border border-av-border bg-av-surface p-2"
        />
      ) : null}
    </div>
  )
}
