import { supabase } from '@/lib/supabase'
import type { CaseMetric, Database } from '@/lib/database.types'

export type CaseRow = Database['public']['Tables']['cases']['Row']
export type CaseInsert = Database['public']['Tables']['cases']['Insert']
export type CaseUpdate = Database['public']['Tables']['cases']['Update']
export type CaseWithMetrics = Omit<CaseRow, 'metrics'> & { metrics: CaseMetric[] }

export function normalizeMetrics(raw: unknown): CaseMetric[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null
      }
      const value = 'value' in item ? String((item as { value: unknown }).value ?? '') : ''
      const label = 'label' in item ? String((item as { label: unknown }).label ?? '') : ''
      if (!value && !label) {
        return null
      }
      return { value, label }
    })
    .filter((x): x is CaseMetric => Boolean(x))
}

export async function listCases(includeDrafts = false) {
  let query = supabase.from('cases').select('*').order('sort_order', { ascending: true })
  if (!includeDrafts) {
    query = query.eq('published', true)
  }
  const { data, error } = await query
  if (error) {
    throw error
  }
  return (data ?? []).map((item) => ({ ...item, metrics: normalizeMetrics(item.metrics) })) as CaseWithMetrics[]
}

export async function getCaseBySlug(slug: string, includeDraft = false) {
  let query = supabase.from('cases').select('*').eq('slug', slug)
  if (!includeDraft) {
    query = query.eq('published', true)
  }
  const { data, error } = await query.single()
  if (error) {
    throw error
  }
  return { ...data, metrics: normalizeMetrics(data.metrics) } as CaseWithMetrics
}

export async function getCaseById(id: string) {
  const { data, error } = await supabase.from('cases').select('*').eq('id', id).single()
  if (error) {
    throw error
  }
  return { ...data, metrics: normalizeMetrics(data.metrics) } as CaseWithMetrics
}

export async function createCase(payload: CaseInsert) {
  const { data, error } = await supabase.from('cases').insert(payload).select('*').single()
  if (error) {
    throw error
  }
  return data
}

export async function updateCase(id: string, payload: CaseUpdate) {
  const { data, error } = await supabase
    .from('cases')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()
  if (error) {
    throw error
  }
  return data
}

export async function removeCase(id: string) {
  const { error } = await supabase.from('cases').delete().eq('id', id)
  if (error) {
    throw error
  }
}

export async function uploadAsset(file: File, folder = 'cases') {
  const ext = file.name.split('.').pop() || 'bin'
  const fileName = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('case-assets').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    throw error
  }

  const { data } = supabase.storage.from('case-assets').getPublicUrl(fileName)
  return data.publicUrl
}
