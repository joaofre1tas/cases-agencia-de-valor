import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type BellPrintRow = Database['public']['Tables']['mentor_bell_prints']['Row']

export async function listBellPrints(includeDrafts = false) {
  let query = supabase
    .from('mentor_bell_prints')
    .select('*')
    .order('sort_order', { ascending: true })

  if (!includeDrafts) {
    query = query.eq('published', true)
  }

  const { data, error } = await query
  if (error) {
    throw error
  }
  return (data ?? []) as BellPrintRow[]
}
