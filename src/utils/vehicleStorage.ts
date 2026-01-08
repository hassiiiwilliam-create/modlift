import { supabase } from '../supabaseClient.js'

const STORAGE_KEY = 'selectedVehicle'

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const saveVehicleSelection = async (
  vehicle: { year?: string; make?: string; model?: string; trim?: string } | null,
  userId: string | null = null,
) => {
  if (!vehicle) {
    return clearVehicleSelection(userId)
  }

  if (userId) {
    const payload = {
      user_id: userId,
      year: vehicle.year ?? null,
      make: vehicle.make ?? null,
      model: vehicle.model ?? null,
      trim: vehicle.trim ?? null,
    }
    return supabase.from('vehicle_selections').upsert(payload, { onConflict: 'user_id' })
  }

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicle))
  }

  return { data: null, error: null }
}

export const loadVehicleSelection = () => {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Failed to parse stored vehicle selection', error)
    return null
  }
}

export const clearVehicleSelection = async (userId: string | null = null) => {
  if (userId) {
    return supabase.from('vehicle_selections').delete().eq('user_id', userId)
  }

  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return { data: null, error: null }
}
