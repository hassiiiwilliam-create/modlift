// VehicleSelectorAdvanced.jsx

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import {
  fetchYears,
  fetchMakes,
  fetchModels,
  fetchTrims,
} from '../services/wheelsizeService'
import { AppContext } from '../App.jsx'
import { supabase } from '../supabaseClient.js'

// === Styles ===
const segmentClass =
  'flex-1 min-w-[120px] rounded-xl bg-white/40 px-3 py-2 text-sm font-medium text-gray-900 transition focus-within:bg-white focus-within:shadow-[0_0_0_2px_#007AFF22] focus-within:outline-none'
const selectClass =
  'w-full bg-transparent text-sm font-medium text-gray-900 outline-none'

const LOCAL_STORAGE_KEY = 'modlift_vehicle'

// === Helpers ===

const extractArray = (payload, keys = []) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  for (const key of keys) {
    const candidate = payload?.[key]
    if (Array.isArray(candidate)) return candidate
  }
  if (typeof payload === 'object') {
    const candidate = Object.values(payload).find((value) => Array.isArray(value))
    if (Array.isArray(candidate)) return candidate
  }
  return []
}

const toYearList = (payload) =>
  extractArray(payload, ['years', 'data'])
    .map((item) =>
      typeof item === 'object' ? String(item.year ?? item.value ?? item.name ?? item.label) : String(item)
    )
    .filter(Boolean)

const coerceOption = (option) => {
  if (!option) return { slug: '', name: '' }
  if (typeof option === 'string' || typeof option === 'number') {
    const value = String(option)
    return { slug: value, name: value }
  }

  const slug =
    option.slug ?? option.value ?? option.id ?? option.code ?? option.year ?? option.make ?? option.model ?? option.trim ?? ''
  const name =
    option.name ?? option.label ?? option.title ?? option.displayName ?? option.trim ?? option.model ?? option.make ?? option.year ?? slug

  return {
    slug: String(slug || name || ''),
    name: String(name || slug || ''),
  }
}

const dedupeStrings = (values) =>
  Array.from(new Set(values.filter((value) => value !== null && value !== '')))

const dedupeOptions = (options) => {
  const deduped = new Map()
  options.forEach(({ slug, name }) => {
    const key = slug || name
    if (!deduped.has(key)) deduped.set(key, { slug, name })
  })
  return Array.from(deduped.values())
}

const areArraysEqual = (a = [], b = []) =>
  a.length === b.length && a.every((val, idx) => val === b[idx])

// === Component ===

export default function VehicleSelectorAdvanced({
  value,
  onSelectionChange,
  onChange,
  onVehicleSelected,
  onComplete,
}) {
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [trim, setTrim] = useState('')

  const [years, setYears] = useState([])
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [trims, setTrims] = useState([])

  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingTrims, setLoadingTrims] = useState(false)

  const { user } = useContext(AppContext) || {}

  const lastPersistedRef = useRef('')
  const isPersistingRef = useRef(false)
  const hasHydratedFromStorage = useRef(false)
  const previousSelectionRef = useRef({ year: '', make: '', model: '', trim: '' })

  // === Hydrate from props or storage ===
  useEffect(() => {
    if (!value) return
    const next = {
      year: value.year ?? value.vehicle_year ?? '',
      make: value.make ?? value.vehicle_make ?? '',
      model: value.model ?? value.vehicle_model ?? '',
      trim: value.trim ?? value.vehicle_trim ?? '',
    }
    const differs =
      next.year !== year || next.make !== make || next.model !== model || next.trim !== trim
    if (differs) {
      setYear(next.year)
      setMake(next.make)
      setModel(next.model)
      setTrim(next.trim)
    }
  }, [value])

  useEffect(() => {
    let active = true
    setLoadingYears(true)
    fetchYears()
      .then((list) => {
        if (!active) return
        const options = dedupeStrings(toYearList(list)).sort((a, b) => Number(b) - Number(a))
        setYears((prev) => (areArraysEqual(prev, options) ? prev : options))
      })
      .catch(console.error)
      .finally(() => active && setLoadingYears(false))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || hasHydratedFromStorage.current) return
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setYear(parsed.year || '')
        setMake(parsed.make || '')
        setModel(parsed.model || '')
        setTrim(parsed.trim || '')
        lastPersistedRef.current = JSON.stringify(parsed)
      }
    } catch (err) {
      console.warn('Vehicle selector localStorage error:', err)
    }
    hasHydratedFromStorage.current = true
  }, [])

  useEffect(() => {
    if (!year) {
      setMakes([])
      setMake('')
      return
    }
    setLoadingMakes(true)
    fetchMakes(year)
      .then((list) => {
        const raw = extractArray(list, ['makes', 'data'])
        const options = dedupeOptions(raw.map(coerceOption))
        setMakes(options)
      })
      .catch(console.error)
      .finally(() => setLoadingMakes(false))
  }, [year])

  useEffect(() => {
    if (!year || !make) {
      setModels([])
      setModel('')
      return
    }
    setLoadingModels(true)
    fetchModels(year, make)
      .then((list) => {
        const raw = extractArray(list, ['models', 'data'])
        const options = dedupeOptions(raw.map(coerceOption))
        setModels(options)
      })
      .catch(console.error)
      .finally(() => setLoadingModels(false))
  }, [year, make])

  useEffect(() => {
    if (!year || !make || !model) {
      setTrims([])
      setTrim('')
      return
    }
    setLoadingTrims(true)
    fetchTrims(year, make, model)
      .then((list) => {
        const raw = extractArray(list, ['trims', 'data'])
        const options = dedupeOptions(raw.map(coerceOption))
        setTrims(options)
      })
      .catch(console.error)
      .finally(() => setLoadingTrims(false))
  }, [year, make, model])

  const emitSelection = useCallback((selection) => {
    onSelectionChange?.(selection)
    onChange?.(selection)
  }, [onSelectionChange, onChange])

  useEffect(() => {
    const selection = { year, make, model, trim }
    const prev = previousSelectionRef.current
    const unchanged = prev.year === year && prev.make === make && prev.model === model && prev.trim === trim
    if (unchanged) return

    previousSelectionRef.current = selection
    emitSelection(selection)

    const complete = year && make && model && trim
    if (!complete) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      return
    }

    const serialized = JSON.stringify(selection)
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized)

    onVehicleSelected?.(selection)
    onComplete?.(selection)

    if (lastPersistedRef.current === serialized || !user?.id || isPersistingRef.current) return

    isPersistingRef.current = true
    supabase.from('user_vehicles').insert({ user_id: user.id, year, make, model, trim })
      .then(({ error }) => {
        if (error) console.error('Supabase insert error:', error.message)
        else lastPersistedRef.current = serialized
      })
      .finally(() => {
        isPersistingRef.current = false
      })
  }, [year, make, model, trim, emitSelection, user?.id, onVehicleSelected, onComplete])

  const segments = useMemo(() => ([
    {
      label: 'Year',
      value: year,
      options: years.map((y) => ({ value: y, label: y })),
      setValue: (v) => {
        setYear(v)
        if (!v) setMake('') & setModel('') & setTrim('')
      },
      loading: loadingYears,
    },
    {
      label: 'Make',
      value: make,
      options: makes.map(({ slug, name }) => ({ value: slug || name, label: name })),
      setValue: (v) => {
        setMake(v)
        if (!v) setModel('') & setTrim('')
      },
      loading: loadingMakes,
      disabled: !year,
    },
    {
      label: 'Model',
      value: model,
      options: models.map(({ slug, name }) => ({ value: slug || name, label: name })),
      setValue: (v) => {
        setModel(v)
        if (!v) setTrim('')
      },
      loading: loadingModels,
      disabled: !year || !make,
    },
    {
      label: 'Trim',
      value: trim,
      options: trims.map(({ slug, name }) => ({ value: slug || name, label: name })),
      setValue: setTrim,
      loading: loadingTrims,
      disabled: !year || !make || !model,
    },
  ]), [year, make, model, trim, years, makes, models, trims, loadingYears, loadingMakes, loadingModels, loadingTrims])

  const clearSelection = () => {
    setYear('')
    setMake('')
    setModel('')
    setTrim('')
    setMakes([])
    setModels([])
    setTrims([])
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    emitSelection({ year: '', make: '', model: '', trim: '' })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#F5F5F7] p-2 shadow-inner shadow-white/80">
      <div className="flex flex-wrap gap-2">
        {segments.map(({ label, value, options, setValue, loading, disabled }) => (
          <Motion.label
            key={label}
            className={`${segmentClass} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            layout
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              {label}
            </span>
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled || loading}
              className={`${selectClass} ${disabled ? 'text-gray-400' : ''}`}
            >
              <option value="">
                {loading ? `Loading ${label}…` : `Select ${label}`}
              </option>
              {options.map(({ value: val, label }) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </Motion.label>
        ))}
      </div>
      {(year || make || model || trim) && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs font-semibold text-red-500 transition hover:text-red-600"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  )
}