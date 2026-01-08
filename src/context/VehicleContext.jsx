import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const STORAGE_KEY = 'vehicle_selection'

const VehicleContext = createContext({
  selection: null,
  updateSelection: async () => {},
  clearSelection: async () => {},
  loading: true,
})

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const readFromStorage = () => {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('Failed to parse stored vehicle selection', error)
    return null
  }
}

export const VehicleProvider = ({ children }) => {
  const [selection, setSelection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSelection = async () => {
      try {
        const stored = readFromStorage()
        if (stored) {
          setSelection(stored)
          return
        }

        const { data: authData, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const user = authData?.user
        if (!user) return

        const { data: record, error } = await supabase
          .from('vehicle_selections')
          .select('year, make, model, trim')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) throw error
        if (record) {
          setSelection(record)
          if (isBrowser()) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
          }
        }
      } catch (error) {
        console.warn('Unable to load vehicle selection', error.message ?? error)
      } finally {
        setLoading(false)
      }
    }

    loadSelection()
  }, [])

  const persistSelection = async (value) => {
    try {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user

      if (user) {
        if (value) {
          await supabase
            .from('vehicle_selections')
            .upsert({ user_id: user.id, year: value.year, make: value.make, model: value.model, trim: value.trim })
        } else {
          await supabase.from('vehicle_selections').delete().eq('user_id', user.id)
        }
      }
    } catch (error) {
      console.warn('Failed to persist vehicle selection', error.message ?? error)
    }
  }

  const updateSelection = async (value) => {
    setSelection(value)
    if (isBrowser()) {
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    await persistSelection(value)
  }

  const clearSelection = async () => {
    await updateSelection(null)
  }

  const value = useMemo(
    () => ({
      selection,
      updateSelection,
      clearSelection,
      loading,
    }),
    [selection, loading],
  )

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
}

export const useVehicle = () => useContext(VehicleContext)
