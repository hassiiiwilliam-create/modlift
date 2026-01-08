import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const LOCAL_STORAGE_KEY = 'modlift_filters'

export default function useSavedFilters(user) {
  const [savedFilters, setSavedFilters] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadFiltersFromSupabase = useCallback(async () => {
    setLoading(true)
    try {
      if (user) {
        const { data, error } = await supabase
          .from('user_filters')
          .select('filters')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Failed to load saved filters', error)
          return null
        }

        const filters = data?.filters ?? null
        setSavedFilters(filters)
        return filters
      }

      if (typeof window !== 'undefined') {
        const local = window.localStorage.getItem(LOCAL_STORAGE_KEY)
        if (local) {
          try {
            const parsed = JSON.parse(local)
            setSavedFilters(parsed)
            return parsed
          } catch (err) {
            console.error('Failed to parse saved filters from localStorage', err)
          }
        }
      }

      setSavedFilters(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])

  const saveFiltersToSupabase = useCallback(
    async (filters) => {
      setSavedFilters(filters)

      if (user) {
        const { error } = await supabase
          .from('user_filters')
          .upsert(
            {
              user_id: user.id,
              filters,
            },
            { onConflict: 'user_id' }
          )

        if (error) {
          console.error('Failed to save filters', error)
        }
      } else if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters))
      }
    },
    [user]
  )

  useEffect(() => {
    loadFiltersFromSupabase()
  }, [loadFiltersFromSupabase])

  return { savedFilters, saveFiltersToSupabase, loadFiltersFromSupabase, loading }
}
