import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CaseEditor from '@/components/admin/CaseEditor'
import { createCase, type CaseInsert } from '@/lib/cases'

export default function AdminNewCase() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createMutation = useMutation({
    mutationFn: (payload: CaseInsert) => createCase(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'cases'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'cases'] })
      navigate('/admin')
    },
  })

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Novo case</h1>
      <CaseEditor onSubmit={(values) => createMutation.mutateAsync(values)} />
    </section>
  )
}
