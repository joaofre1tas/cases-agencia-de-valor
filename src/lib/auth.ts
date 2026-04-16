import { useQuery } from '@tanstack/react-query'
import type { AuthError, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw error
  }
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw error
  }
  return data.session
}

export async function isAdmin() {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) {
    throw error
  }
  return Boolean(data)
}

export async function isSuperAdmin() {
  const { data, error } = await supabase.rpc('is_super_admin')
  if (error) {
    throw error
  }
  return Boolean(data)
}

export function useAuth() {
  return useQuery<Session | null, AuthError | Error>({
    queryKey: ['auth', 'session'],
    queryFn: getSession,
    staleTime: 1000 * 30,
  })
}

export function useIsAdmin(enabled = true) {
  return useQuery<boolean, AuthError | Error>({
    queryKey: ['auth', 'is-admin'],
    queryFn: isAdmin,
    enabled,
    staleTime: 1000 * 30,
  })
}

export function useIsSuperAdmin(enabled = true) {
  return useQuery<boolean, AuthError | Error>({
    queryKey: ['auth', 'is-super-admin'],
    queryFn: isSuperAdmin,
    enabled,
    staleTime: 1000 * 30,
  })
}
