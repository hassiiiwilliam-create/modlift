import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { STORAGE_KEYS } from '../config/constants.js'

// Use the centralized storage key for consistency across the app
const STORAGE_KEY = STORAGE_KEYS.VEHICLE // 'modlift_vehicle'

const VehicleContext = createContext({
  selection: null,
  updateSelection: async () => {},
  clearSelection: async () => {},
  loading: true,
})

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

// Old key used in previous version - migrate to new key if found
const OLD_STORAGE_KEY = 'vehicle_selection'

const readFromStorage = () => {
  if (!isBrowser()) return null
  try {
    // Try new key first
    let raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }

    // Migrate from old key if it exists
    raw = window.localStorage.getItem(OLD_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Save to new key and remove old key
      window.localStorage.setItem(STORAGE_KEY, raw)
      window.localStorage.removeItem(OLD_STORAGE_KEY)
      return parsed
    }

    return null
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
          // Also sync to filters storage on initial load
          syncToFiltersStorageImmediate(stored)
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
            // Also sync to filters storage on initial load from DB
            syncToFiltersStorageImmediate(record)
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

  // Helper to sync vehicle to filters storage (used during initial load)
  const syncToFiltersStorageImmediate = (vehicle) => {
    if (!isBrowser()) return
    try {
      const filtersKey = STORAGE_KEYS.FILTERS
      const existing = window.localStorage.getItem(filtersKey)
      const filters = existing ? JSON.parse(existing) : {}
      filters.vehicle_year = vehicle.year || ''
      filters.vehicle_make = vehicle.make || ''
      filters.vehicle_model = vehicle.model || ''
      filters.vehicle_trim = vehicle.trim || ''
      window.localStorage.setItem(filtersKey, JSON.stringify(filters))
    } catch (error) {
      console.warn('Failed to sync vehicle to filters storage', error)
    }
  }

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
        // Also sync to filters localStorage so ProductFilters picks up the vehicle
        syncToFiltersStorage(value)
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
        // Clear vehicle from filters storage too
        clearFromFiltersStorage()
      }
    }
    await persistSelection(value)
  }

  // Sync vehicle selection to the modlift-filters localStorage
  const syncToFiltersStorage = (vehicle) => {
    try {
      const filtersKey = STORAGE_KEYS.FILTERS // 'modlift-filters'
      const existing = window.localStorage.getItem(filtersKey)
      const filters = existing ? JSON.parse(existing) : {}

      // Update vehicle fields in filters
      filters.vehicle_year = vehicle.year || ''
      filters.vehicle_make = vehicle.make || ''
      filters.vehicle_model = vehicle.model || ''
      filters.vehicle_trim = vehicle.trim || ''

      window.localStorage.setItem(filtersKey, JSON.stringify(filters))
    } catch (error) {
      console.warn('Failed to sync vehicle to filters storage', error)
    }
  }

  const clearFromFiltersStorage = () => {
    try {
      const filtersKey = STORAGE_KEYS.FILTERS
      const existing = window.localStorage.getItem(filtersKey)
      if (existing) {
        const filters = JSON.parse(existing)
        delete filters.vehicle_year
        delete filters.vehicle_make
        delete filters.vehicle_model
        delete filters.vehicle_trim
        window.localStorage.setItem(filtersKey, JSON.stringify(filters))
      }
    } catch (error) {
      console.warn('Failed to clear vehicle from filters storage', error)
    }
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
