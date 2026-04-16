import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import CaseEditor from '@/components/admin/CaseEditor'
import { getCaseById, updateCase, removeCase, type CaseUpdate } from '@/lib/cases'

export default function AdminEditCase() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const caseQuery = useQuery({
    queryKey: ['admin', 'case', id],
    queryFn: () => getCaseById(id!),
    enabled: Boolean(id),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: CaseUpdate) => updateCase(id!, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'cases'] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'case', id] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'cases'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'case'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => removeCase(id!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'cases'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'cases'] })
      navigate('/admin')
    },
  })

  async function handleDelete() {
    const confirmed = window.confirm('Tem certeza que deseja excluir este case?')
    if (!confirmed) {
      return
    }
    await deleteMutation.mutateAsync()
    toast.success('Case excluído.')
  }

  if (caseQuery.isLoading) {
    return <p className="text-av-text-muted">Carregando case...</p>
  }

  if (!caseQuery.data) {
    return <p className="text-av-text-muted">Case não encontrado.</p>
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Editar case</h1>
      <CaseEditor
        initialValues={caseQuery.data}
        onSubmit={(values) => updateMutation.mutateAsync(values)}
        onDelete={handleDelete}
      />
    </section>
  )
}
