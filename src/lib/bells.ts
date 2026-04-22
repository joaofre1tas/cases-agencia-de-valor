import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type BellPrintRow = Database['public']['Tables']['mentor_bell_prints']['Row']
export type BellPrintInsert = Database['public']['Tables']['mentor_bell_prints']['Insert']
export type BellPrintUpdate = Database['public']['Tables']['mentor_bell_prints']['Update']

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

export async function createBellPrint(payload: BellPrintInsert) {
  const { data, error } = await supabase.from('mentor_bell_prints').insert(payload).select('*').single()
  if (error) throw error
  return data as BellPrintRow
}

export async function createBellPrints(payloads: BellPrintInsert[]) {
  if (payloads.length === 0) {
    return [] as BellPrintRow[]
  }
  const { data, error } = await supabase.from('mentor_bell_prints').insert(payloads).select('*')
  if (error) throw error
  return (data ?? []) as BellPrintRow[]
}

export async function updateBellPrint(id: string, payload: BellPrintUpdate) {
  const { data, error } = await supabase
    .from('mentor_bell_prints')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data as BellPrintRow
}

export async function removeBellPrint(id: string) {
  const { error } = await supabase.from('mentor_bell_prints').delete().eq('id', id)
  if (error) throw error
}
