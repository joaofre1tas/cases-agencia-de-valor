import { normalizeMetrics } from '@/lib/cases'
import type { CaseMetric, Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

export type TestimonialVideoRow = Database['public']['Tables']['testimonial_videos']['Row']
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
