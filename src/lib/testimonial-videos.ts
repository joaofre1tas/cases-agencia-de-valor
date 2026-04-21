import { normalizeMetrics } from '@/lib/cases'
import type { CaseMetric, Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

export type TestimonialVideoRow = Database['public']['Tables']['testimonial_videos']['Row']
export type TestimonialVideoInsert = Database['public']['Tables']['testimonial_videos']['Insert']
export type TestimonialVideoUpdate = Database['public']['Tables']['testimonial_videos']['Update']
export type TestimonialVideoWithMetrics = Omit<TestimonialVideoRow, 'metrics'> & { metrics: CaseMetric[] }

export async function listTestimonialVideos(includeDrafts = false) {
  let query = supabase
    .from('testimonial_videos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (!includeDrafts) {
    query = query.eq('published', true)
  }

  const { data, error } = await query
  if (error) {
    throw error
  }

  return (data ?? []).map((item) => ({ ...item, metrics: normalizeMetrics(item.metrics) })) as TestimonialVideoWithMetrics[]
}

export async function createTestimonialVideo(payload: TestimonialVideoInsert) {
  const { data, error } = await supabase.from('testimonial_videos').insert(payload).select('*').single()
  if (error) throw error
  return { ...data, metrics: normalizeMetrics(data.metrics) } as TestimonialVideoWithMetrics
}

export async function updateTestimonialVideo(id: string, payload: TestimonialVideoUpdate) {
  const { data, error } = await supabase
    .from('testimonial_videos')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return { ...data, metrics: normalizeMetrics(data.metrics) } as TestimonialVideoWithMetrics
}

export async function removeTestimonialVideo(id: string) {
  const { error } = await supabase.from('testimonial_videos').delete().eq('id', id)
  if (error) throw error
}
