import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BellPrintsManager from '@/components/admin/BellPrintsManager'
import { listCases } from '@/lib/cases'
import CaseList from '@/components/admin/CaseList'
import SegmentManager from '@/components/admin/SegmentManager'
import VideoTestimonialsManager from '@/components/admin/VideoTestimonialsManager'

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
          <Link to="/admin/novo-case">
            <Plus className="h-4 w-4 mr-2" />
            Novo case
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4">
          <Tabs defaultValue="cases">
            <TabsList className="h-auto rounded-md bg-av-surface border border-av-border p-1 grid grid-cols-3">
              <TabsTrigger
                value="cases"
                className="rounded-sm data-[state=active]:bg-av-bg data-[state=active]:text-av-text data-[state=active]:shadow-none text-av-text-secondary"
              >
                Cases
              </TabsTrigger>
              <TabsTrigger
                value="sinos"
                className="rounded-sm data-[state=active]:bg-av-bg data-[state=active]:text-av-text data-[state=active]:shadow-none text-av-text-secondary"
              >
                Sinos
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="rounded-sm data-[state=active]:bg-av-bg data-[state=active]:text-av-text data-[state=active]:shadow-none text-av-text-secondary"
              >
                Vídeos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cases" className="mt-4 card-av p-4">
              {casesQuery.isLoading ? (
                <p className="text-av-text-muted">Carregando cases...</p>
              ) : (
                <CaseList cases={casesQuery.data ?? []} />
              )}
            </TabsContent>

            <TabsContent value="sinos" className="mt-4">
              <BellPrintsManager />
            </TabsContent>

            <TabsContent value="videos" className="mt-4">
              <VideoTestimonialsManager />
            </TabsContent>
          </Tabs>
        </div>
        <SegmentManager />
      </div>
    </section>
  )
}
