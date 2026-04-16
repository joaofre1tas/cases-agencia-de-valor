import { Link } from 'react-router-dom'
import { Eye, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CaseRow } from '@/lib/cases'

interface CaseListProps {
  cases: CaseRow[]
}

export default function CaseList({ cases }: CaseListProps) {
  if (cases.length === 0) {
    return <p className="text-av-text-muted">Nenhum case cadastrado ainda.</p>
  }

  return (
    <div className="overflow-x-auto border border-av-border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-av-surface text-av-text-secondary">
          <tr>
            <th className="text-left px-4 py-3">Case</th>
            <th className="text-left px-4 py-3">Segmento</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Atualizado</th>
            <th className="text-right px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => (
            <tr key={item.id} className="border-t border-av-border">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.title}
                      className="h-8 w-12 object-contain rounded border border-av-border bg-av-surface p-1"
                    />
                  ) : (
                    <div className="h-8 w-12 rounded border border-av-border bg-av-surface" />
                  )}
                  <div>
                    <p className="font-medium text-av-text line-clamp-1">
                      {item.agency_name || item.title}
                    </p>
                    <p className="text-xs text-av-text-secondary line-clamp-1">{item.title}</p>
                    <p className="text-xs text-av-text-muted">/{item.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-av-text-secondary">{item.segment}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${item.published ? 'bg-green-500/15 text-green-300' : 'bg-amber-500/15 text-amber-300'}`}
                >
                  {item.published ? 'Publicado' : 'Rascunho'}
                </span>
              </td>
              <td className="px-4 py-3 text-av-text-muted">
                {new Date(item.updated_at).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="av-outline" size="sm" asChild>
                    <Link to={`/admin/cases/${item.id}`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/cases/${item.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Link>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
