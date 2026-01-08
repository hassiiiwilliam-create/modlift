import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { useProductFilters } from './useProductFilters.jsx'

type FitmentKey = 'liftHeight' | 'tireSize' | 'preference'

const FITMENT_TO_FILTER_KEY: Record<FitmentKey, keyof ReturnType<typeof useProductFilters>['filters']> =
  {
    liftHeight: 'lift_height_range',
    tireSize: 'tire_size',
    preference: 'fitment_preference',
  }

const mapOptions = (values: Array<string | { value: string; label?: string }> = []) =>
  values
    .map((option) => {
      if (typeof option === 'string') {
        return { value: option, label: option }
      }
      if (!option) {
        return null
      }
      const value = option.value ?? ''
      const label = option.label ?? option.value ?? ''
      if (!value && !label) {
        return null
      }
      return {
        value: String(value),
        label: String(label || value),
      }
    })
    .filter((item): item is { value: string; label: string } => Boolean(item?.value))

export function useFitmentFilters() {
  const { filters, setFilter, uniqueOptions } = useProductFilters()
  const [preferenceOptions, setPreferenceOptions] = useState<
    Array<{ value: string; label: string; offset_min: number | null; offset_max: number | null }>
  >([])
  const [loadingPreferences, setLoadingPreferences] = useState(false)

  useEffect(() => {
    let active = true
    const loadPreferences = async () => {
      try {
        setLoadingPreferences(true)
        const { data, error } = await supabase
          .from('fitment_preferences')
          .select('id, label, offset_min, offset_max')

        if (error) throw error
        if (!active) return

        const mapped = (data ?? [])
          .map((item) => {
            const rawMin = item?.offset_min
            const rawMax = item?.offset_max
            const minValue = rawMin === null || rawMin === undefined ? null : Number(rawMin)
            const maxValue = rawMax === null || rawMax === undefined ? null : Number(rawMax)

            return {
              value: String(item.id ?? ''),
              label: item.label ?? String(item.id ?? ''),
              offset_min: Number.isFinite(minValue) ? minValue : null,
              offset_max: Number.isFinite(maxValue) ? maxValue : null,
            }
          })
          .filter((item) => item.value)

        setPreferenceOptions(mapped)
      } catch (error) {
        console.warn('Failed to load fitment preferences', error)
        if (active) {
          setPreferenceOptions([])
        }
      } finally {
        if (active) {
          setLoadingPreferences(false)
        }
      }
    }

    loadPreferences()

    return () => {
      active = false
    }
  }, [])

  const preferenceMap = useMemo(() => {
    const map = new Map<string, { label: string; offset_min: number | null; offset_max: number | null }>()
    preferenceOptions.forEach((item) => {
      map.set(item.value, { label: item.label, offset_min: item.offset_min, offset_max: item.offset_max })
    })
    return map
  }, [preferenceOptions])

  const fitment = useMemo(
    () => ({
      liftHeight: filters.lift_height_range ?? '',
      tireSize: filters.tire_size ?? '',
      preference: filters.fitment_preference ?? '',
    }),
    [filters.fitment_preference, filters.lift_height_range, filters.tire_size],
  )

  const setFitment = useCallback(
    (key: FitmentKey, value: string) => {
      const filterKey = FITMENT_TO_FILTER_KEY[key]
      if (!filterKey) return
      if (key === 'preference') {
        const normalized = value ?? ''
        setFilter('fitment_preference', normalized)
        const option = normalized ? preferenceMap.get(normalized) : undefined
        if (option) {
          setFilter('fitment_preference_range', {
            offset_min: option.offset_min,
            offset_max: option.offset_max,
          })
          setFilter('fitment_preference_label', option.label)
        } else {
          setFilter('fitment_preference_range', null)
          setFilter('fitment_preference_label', '')
        }
      } else {
        setFilter(filterKey, value ?? '')
      }
    },
    [preferenceMap, setFilter],
  )

  const resetFitment = useCallback(() => {
    ;(Object.keys(FITMENT_TO_FILTER_KEY) as FitmentKey[]).forEach((key) => {
      const filterKey = FITMENT_TO_FILTER_KEY[key]
      if (key === 'preference') {
        setFilter('fitment_preference', '')
        setFilter('fitment_preference_range', null)
        setFilter('fitment_preference_label', '')
      } else {
        setFilter(filterKey, '')
      }
    })
  }, [setFilter])

  const availableFilters = useMemo(
    () => ({
      liftHeights: mapOptions(uniqueOptions.lift_heights),
      tireSizes: mapOptions(uniqueOptions.tire_sizes),
      preferences: preferenceOptions.map(({ value, label }) => ({ value, label })),
    }),
    [preferenceOptions, uniqueOptions.lift_heights, uniqueOptions.tire_sizes],
  )

  return {
    fitment,
    setFitment,
    resetFitment,
    availableFilters,
    isLoadingFilters: loadingPreferences,
  }
}
