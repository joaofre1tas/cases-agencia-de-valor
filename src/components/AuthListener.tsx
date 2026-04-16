import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export default function AuthListener() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      queryClient.setQueryData(['auth', 'session'], session ?? null)
      if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(['auth', 'is-admin'], false)
      } else {
        queryClient.invalidateQueries({ queryKey: ['auth', 'is-admin'] })
      }
    })
    return () => subscription.unsubscribe()
  }, [queryClient])

  return null
}
