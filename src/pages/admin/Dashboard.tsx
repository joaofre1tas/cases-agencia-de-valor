import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { listCases } from '@/lib/cases'
import CaseList from '@/components/admin/CaseList'
import SegmentManager from '@/components/admin/SegmentManager'

export default function AdminDashboard() {
  const casesQuery = useQuery({
    queryKey: ['admin', 'cases'],
    queryFn: () => listCases(true),
  })

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Cases</h1>
          <p className="text-av-text-secondary">Gerencie preview e conteúdo completo de cada case.</p>
        </div>
        <Button asChild>
          <Link to="/admin/cases/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo case
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <div className="card-av p-4">
          {casesQuery.isLoading ? (
            <p className="text-av-text-muted">Carregando cases...</p>
          ) : (
            <CaseList cases={casesQuery.data ?? []} />
          )}
        </div>
        <SegmentManager />
      </div>
    </section>
  )
}
