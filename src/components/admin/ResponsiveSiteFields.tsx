import { Controller, type Control, type FieldPath } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SiteContentFormValues } from '@/lib/site-settings'
import { TEXT_ALIGN_OPTIONS, TEXT_SIZE_OPTIONS } from '@/lib/responsive-site-ui'

type Paths = {
  mobile: FieldPath<SiteContentFormValues>
  tablet: FieldPath<SiteContentFormValues>
  desktop: FieldPath<SiteContentFormValues>
}

export function ResponsiveAlignGroup({
  control,
  paths,
  title,
}: {
  control: Control<SiteContentFormValues>
  paths: Paths
  title: string
}) {
  const items: { key: keyof Paths; label: string }[] = [
    { key: 'mobile', label: 'Mobile' },
    { key: 'tablet', label: 'Tablet' },
    { key: 'desktop', label: 'Desktop' },
  ]
  return (
    <div className="space-y-3 rounded-lg border border-av-border bg-av-surface p-4">
      <p className="text-sm font-medium text-av-text">{title}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs text-av-text-muted">{label}</Label>
            <Controller
              control={control}
              name={paths[key]}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXT_ALIGN_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResponsiveSizeGroup({
  control,
  paths,
  title,
}: {
  control: Control<SiteContentFormValues>
  paths: Paths
  title: string
}) {
  const items: { key: keyof Paths; label: string }[] = [
    { key: 'mobile', label: 'Mobile' },
    { key: 'tablet', label: 'Tablet' },
    { key: 'desktop', label: 'Desktop' },
  ]
  return (
    <div className="space-y-3 rounded-lg border border-av-border bg-av-surface p-4">
      <p className="text-sm font-medium text-av-text">{title}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs text-av-text-muted">{label}</Label>
            <Controller
              control={control}
              name={paths[key]}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXT_SIZE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
