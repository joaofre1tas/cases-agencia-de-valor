import { Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { CaseMetric } from '@/lib/database.types'

interface MetricsFieldProps {
  value: CaseMetric[]
  onChange: (value: CaseMetric[]) => void
}

export default function MetricsField({ value, onChange }: MetricsFieldProps) {
  const metrics = value ?? []

  function updateAt(index: number, patch: Partial<CaseMetric>) {
    onChange(metrics.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function removeAt(index: number) {
    onChange(metrics.filter((_, i) => i !== index))
  }

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= metrics.length) {
      return
    }
    const clone = [...metrics]
    const [item] = clone.splice(index, 1)
    clone.splice(nextIndex, 0, item)
    onChange(clone)
  }

  function addMetric() {
    onChange([...metrics, { value: '', label: '' }])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-av-text-secondary">Métricas</label>
        <Button type="button" variant="av-outline" size="sm" onClick={addMetric}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      {metrics.length === 0 ? (
        <p className="text-sm text-av-text-muted">Nenhuma métrica adicionada.</p>
      ) : null}
      {metrics.map((metric, index) => (
        <div key={`${index}-${metric.label}`} className="grid grid-cols-12 gap-2 items-center">
          <Input
            value={metric.value}
            onChange={(event) => updateAt(index, { value: event.target.value })}
            placeholder="Valor (ex: R$ 236.000)"
            className="col-span-5 bg-av-bg border-av-border"
          />
          <Input
            value={metric.label}
            onChange={(event) => updateAt(index, { label: event.target.value })}
            placeholder="Label"
            className="col-span-5 bg-av-bg border-av-border"
          />
          <div className="col-span-2 flex gap-1 justify-end">
            <Button type="button" variant="ghost" size="icon" onClick={() => move(index, -1)}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => move(index, 1)}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeAt(index)}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
