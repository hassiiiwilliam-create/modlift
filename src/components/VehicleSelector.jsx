import { useEffect, useState, useCallback } from 'react'
import { fetchYears, fetchMakes, fetchModels, fetchTrims } from '@/services/wheelsizeService'
import { cn } from '@/lib/utils'

export default function VehicleFilters({ value, onChange }) {
  const [year, setYear] = useState(value?.year || '')
  const [make, setMake] = useState(value?.make || '')
  const [model, setModel] = useState(value?.model || '')
  const [trim, setTrim] = useState(value?.trim || '')

  const [years, setYears] = useState([])
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [trims, setTrims] = useState([])

  const [loadingYear, setLoadingYear] = useState(false)
  const [loadingMake, setLoadingMake] = useState(false)
  const [loadingModel, setLoadingModel] = useState(false)
  const [loadingTrim, setLoadingTrim] = useState(false)

  useEffect(() => {
    setLoadingYear(true)
    fetchYears()
      .then((res) => setYears(res))
      .finally(() => setLoadingYear(false))
  }, [])

  useEffect(() => {
    if (!year) return
    setLoadingMake(true)
    fetchMakes(year)
      .then((res) => setMakes(res))
      .finally(() => setLoadingMake(false))
  }, [year])

  useEffect(() => {
    if (!year || !make) return
    setLoadingModel(true)
    fetchModels(year, make)
      .then((res) => setModels(res))
      .finally(() => setLoadingModel(false))
  }, [year, make])

  useEffect(() => {
    if (!year || !make || !model) return
    setLoadingTrim(true)
    fetchTrims(year, make, model)
      .then((res) => setTrims(res))
      .finally(() => setLoadingTrim(false))
  }, [year, make, model])

  const emit = useCallback(
    (update) => {
      const next = {
        year: update.year ?? year,
        make: update.make ?? make,
        model: update.model ?? model,
        trim: update.trim ?? trim,
      }
      onChange?.(next)
    },
    [year, make, model, trim, onChange]
  )

  return (
    <div className="rounded-xl bg-[#f9f9fa] p-3 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-zinc-100">Choose your vehicle</div>
      <div className="mb-4 text-xs text-gray-500 dark:text-zinc-400">We'll filter compatible products based on your selection.</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <SelectBox
          label="Year"
          value={year}
          loading={loadingYear}
          options={years}
          onChange={(val) => {
            setYear(val)
            setMake('')
            setModel('')
            setTrim('')
            emit({ year: val, make: '', model: '', trim: '' })
          }}
        />
        <SelectBox
          label="Make"
          value={make}
          loading={loadingMake}
          options={makes.map((m) => m.name || m)}
          onChange={(val) => {
            setMake(val)
            setModel('')
            setTrim('')
            emit({ make: val, model: '', trim: '' })
          }}
        />
        <SelectBox
          label="Model"
          value={model}
          loading={loadingModel}
          options={models.map((m) => m.name || m)}
          onChange={(val) => {
            setModel(val)
            setTrim('')
            emit({ model: val, trim: '' })
          }}
        />
        <SelectBox
          label="Trim"
          value={trim}
          loading={loadingTrim}
          options={trims.map((t) => t.name || t)}
          onChange={(val) => {
            setTrim(val)
            emit({ trim: val })
          }}
        />
      </div>
    </div>
  )
}

function SelectBox({ label, value, options, onChange, loading }) {
  return (
    <div className="text-xs">
      <label className="block pb-1 font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </label>
      <select
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-inner outline-none transition dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        value={value || ''}
        disabled={loading || !options?.length}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">
          {loading ? `Loading ${label}...` : `Select ${label}`}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}