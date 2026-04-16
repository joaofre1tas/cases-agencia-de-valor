import { supabase } from '@/lib/supabase'

export interface SegmentOption {
  id: string
  name: string
  sort_order: number
}

export async function countCasesBySegment(name: string) {
  const segment = name.trim()
  if (!segment) {
    return 0
  }
  const { count, error } = await supabase
    .from('cases')
    .select('id', { count: 'exact', head: true })
    .eq('segment', segment)
  if (error) {
    throw error
  }
  return count ?? 0
}

function mapSegmentsError(error: { message?: string } | null | undefined) {
  const message = error?.message ?? ''
  if (message.includes("Could not find the table 'public.segments'")) {
    throw new Error(
      'A tabela public.segments ainda não existe no Supabase. Rode o SQL de segmentos (arquivo supabase/005_segments.sql) e recarregue a página.',
    )
  }
  if (error) {
    throw error
  }
}

export async function listSegments() {
  const { data, error } = await supabase
    .from('segments')
    .select('id,name,sort_order')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    mapSegmentsError(error)
  }
  return (data ?? []) as SegmentOption[]
}

export async function createSegment(name: string) {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Nome do segmento é obrigatório.')
  }
  const { data, error } = await supabase
    .from('segments')
    .insert({ name: trimmed })
    .select('id,name,sort_order')
    .single()
  if (error) {
    mapSegmentsError(error)
  }
  return data as SegmentOption
}

export async function renameSegment(currentName: string, nextName: string) {
  const from = currentName.trim()
  const to = nextName.trim()
  if (!from || !to) {
    throw new Error('Nome do segmento é obrigatório.')
  }
  if (from === to) {
    return
  }

  const { data: existing } = await supabase.from('segments').select('id').eq('name', to).maybeSingle()
  if (existing) {
    throw new Error('Já existe um segmento com esse nome.')
  }

  const { error: updateSegmentError } = await supabase.from('segments').update({ name: to }).eq('name', from)
  if (updateSegmentError) {
    mapSegmentsError(updateSegmentError)
  }

  const { error: migrateError } = await supabase.from('cases').update({ segment: to }).eq('segment', from)
  if (migrateError) {
    throw migrateError
  }
}

export async function deleteSegmentWithReplacement(name: string, replacement?: string) {
  const source = name.trim()
  const target = replacement?.trim()
  if (!source) {
    throw new Error('Segmento é obrigatório.')
  }

  const totalCases = await countCasesBySegment(source)
  if (totalCases > 0 && !target) {
    throw new Error('Escolha um segmento substituto para migrar os cases.')
  }
  if (target && source === target) {
    throw new Error('O segmento substituto precisa ser diferente do segmento excluído.')
  }

  if (totalCases > 0) {
    const { data: replacementSegment } = await supabase
      .from('segments')
      .select('id')
      .eq('name', target!)
      .maybeSingle()
    if (!replacementSegment) {
      throw new Error('Segmento substituto não encontrado.')
    }

    const { error: migrateError } = await supabase
      .from('cases')
      .update({ segment: target! })
      .eq('segment', source)
    if (migrateError) {
      throw migrateError
    }
  }

  const { error: deleteError } = await supabase.from('segments').delete().eq('name', source)
  if (deleteError) {
    mapSegmentsError(deleteError)
  }
}
