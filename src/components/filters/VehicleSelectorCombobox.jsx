import { useEffect, useMemo, useState } from 'react'
import FilterCombobox from '@/components/FilterCombobox.jsx'
import { fetchYears, fetchMakes, fetchModels, fetchTrims } from '@/services/wheelsizeService'
import { useProductFilters } from '@/hooks/useProductFilters.jsx'
import { useVehicle } from '@/components/filters/VehicleContext.jsx'

const KEY_TO_FILTER = {
  year: 'vehicle_year',
  make: 'vehicle_make',
  model: 'vehicle_model',
  trim: 'vehicle_trim',
  drivetrain: 'drivetrain',
}

const DRIVETRAIN_OPTIONS = [
  { value: '4WD', label: '4WD (4x4)' },
  { value: 'RWD', label: 'RWD (Rear Wheel)' },
  { value: 'FWD', label: 'FWD (Front Wheel)' },
  { value: 'AWD', label: 'AWD (All Wheel)' },
]

// Popular makes to show at the top of the list
const POPULAR_MAKES = ['Ford', 'RAM', 'Chevrolet', 'Toyota', 'GMC', 'Jeep', 'Nissan', 'Honda']

// Popular models to prioritize
const POPULAR_MODELS = [
  'F-150', 'F-250', 'F-350',
  '1500', '2500', '3500',
  'Silverado 1500', 'Silverado 2500HD', 'Silverado 3500HD',
  'Sierra 1500', 'Sierra 2500HD',
  'Tacoma', 'Tundra', '4Runner', 'Land Cruiser',
  'Wrangler', 'Gladiator', 'Grand Cherokee',
  'Titan', 'Frontier',
  'Colorado', 'Canyon', 'Ranger',
  'Ridgeline', 'Passport', 'Pilot',
]

const toOptionList = (items = []) =>
  items
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const value = String(item)
        return { value, label: value }
      }
      if (!item) return null
      const candidate =
        item.name ??
        item.label ??
        item.title ??
        item.value ??
        item.slug ??
        item.model ??
        item.make ??
        item.trim ??
        item.year
      if (!candidate) {
        return null
      }
      const value = String(candidate)
      return { value, label: value }
    })
    .filter((option) => option?.value)

export default function VehicleSelectorCombobox({
  includeDrivetrain = true,
  onSelectionChange,
  onCompleteSelection,
}) {
  const { filters, setFilter } = useProductFilters()
  const { selection, updateSelection, clearSelection } = useVehicle()

  const [years, setYears] = useState([])
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [trims, setTrims] = useState([])

  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingTrims, setLoadingTrims] = useState(false)

  const year = filters.vehicle_year ?? ''
  const make = filters.vehicle_make ?? ''
  const model = filters.vehicle_model ?? ''
  const trim = filters.vehicle_trim ?? ''
  const drivetrain = filters.drivetrain ?? ''

  useEffect(() => {
    let active = true
    setLoadingYears(true)

    fetchYears()
      .then((list) => {
        if (!active) return
        setYears(toOptionList(list))
      })
      .catch((error) => {
        console.warn('Failed to load vehicle years', error)
      })
      .finally(() => {
        if (active) setLoadingYears(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!year) {
      setMakes([])
      return
    }
    setLoadingMakes(true)

    fetchMakes(year)
      .then((list) => {
        if (cancelled) return
        const options = toOptionList(list)
        // Sort popular makes to the top
        const sorted = [...options].sort((a, b) => {
          const aPopular = POPULAR_MAKES.findIndex((m) => m.toLowerCase() === a.value.toLowerCase())
          const bPopular = POPULAR_MAKES.findIndex((m) => m.toLowerCase() === b.value.toLowerCase())
          const aIsPopular = aPopular !== -1
          const bIsPopular = bPopular !== -1
          if (aIsPopular && !bIsPopular) return -1
          if (!aIsPopular && bIsPopular) return 1
          if (aIsPopular && bIsPopular) return aPopular - bPopular
          return a.label.localeCompare(b.label)
        })
        setMakes(sorted)
      })
      .catch((error) => {
        console.warn('Failed to load vehicle makes', error)
        if (!cancelled) setMakes([])
      })
      .finally(() => {
        if (!cancelled) setLoadingMakes(false)
      })

    return () => {
      cancelled = true
    }
  }, [year])

  useEffect(() => {
    let cancelled = false
    if (!year || !make) {
      setModels([])
      return
    }
    setLoadingModels(true)
    fetchModels(year, make)
      .then((list) => {
        if (cancelled) return
        const options = toOptionList(list)
        // Sort popular models to the top
        const sorted = [...options].sort((a, b) => {
          const aPopular = POPULAR_MODELS.some((m) => a.value.toLowerCase().includes(m.toLowerCase()))
          const bPopular = POPULAR_MODELS.some((m) => b.value.toLowerCase().includes(m.toLowerCase()))
          if (aPopular && !bPopular) return -1
          if (!aPopular && bPopular) return 1
          return a.label.localeCompare(b.label)
        })
        setModels(sorted)
      })
      .catch((error) => {
        console.warn('Failed to load vehicle models', error)
        if (!cancelled) setModels([])
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false)
      })

    return () => {
      cancelled = true
    }
  }, [year, make])

  useEffect(() => {
    let cancelled = false
    if (!year || !make || !model) {
      setTrims([])
      return
    }
    setLoadingTrims(true)
    fetchTrims(year, make, model)
      .then((list) => {
        if (cancelled) return
        setTrims(toOptionList(list))
      })
      .catch((error) => {
        console.warn('Failed to load vehicle trims', error)
        if (!cancelled) setTrims([])
      })
      .finally(() => {
        if (!cancelled) setLoadingTrims(false)
      })

    return () => {
      cancelled = true
    }
  }, [year, make, model])

  useEffect(() => {
    if (!selection) return

    const applyIfEmpty = (key, value, currentValue) => {
      if (!value || currentValue) return
      const filterKey = KEY_TO_FILTER[key]
      if (!filterKey) return
      setFilter(filterKey, value)
    }

    // Only apply vehicle fields from selection, not drivetrain
    // Drivetrain should be controlled independently via the filter
    applyIfEmpty('year', selection.year, year)
    applyIfEmpty('make', selection.make, make)
    applyIfEmpty('model', selection.model, model)
    applyIfEmpty('trim', selection.trim, trim)
  }, [selection, year, make, model, trim, setFilter])

  useEffect(() => {
    const nextSelection = {
      year,
      make,
      model,
      trim,
      drivetrain,
    }
    const hasSelection = Object.values(nextSelection).some(Boolean)
    const currentHasSelection = selection
      ? Object.values(selection).some(Boolean)
      : false

    if (!hasSelection) {
      if (currentHasSelection) {
        clearSelection?.()
        onCompleteSelection?.(null)
      }
      onSelectionChange?.(nextSelection)
      return
    }

    onSelectionChange?.(nextSelection)

    if (
      !selection ||
      selection.year !== year ||
      selection.make !== make ||
      selection.model !== model ||
      selection.trim !== trim ||
      selection.drivetrain !== drivetrain
    ) {
      updateSelection?.(nextSelection)
    }

    const ready = Boolean(year && make && model && trim && drivetrain)

    if (ready) {
      onCompleteSelection?.(nextSelection)
    }
  }, [
    year,
    make,
    model,
    trim,
    drivetrain,
    selection,
    updateSelection,
    clearSelection,
    onCompleteSelection,
    onSelectionChange,
  ])

  const disabledStates = useMemo(
    () => ({
      make: !year || loadingYears,
      model: !year || !make || loadingMakes,
      trim: !year || !make || !model || loadingModels,
      drivetrain: includeDrivetrain && (!year || !make || !model),
    }),
    [year, make, model, loadingYears, loadingMakes, loadingModels, includeDrivetrain],
  )

  const handleChange = (key, value) => {
    const filterKey = KEY_TO_FILTER[key]
    if (!filterKey) return

    setFilter(filterKey, value ?? '')

    if (key === 'year') {
      setFilter(KEY_TO_FILTER.make, '')
      setFilter(KEY_TO_FILTER.model, '')
      setFilter(KEY_TO_FILTER.trim, '')
      setFilter(KEY_TO_FILTER.drivetrain, '')
    } else if (key === 'make') {
      setFilter(KEY_TO_FILTER.model, '')
      setFilter(KEY_TO_FILTER.trim, '')
      setFilter(KEY_TO_FILTER.drivetrain, '')
    } else if (key === 'model') {
      setFilter(KEY_TO_FILTER.trim, '')
      setFilter(KEY_TO_FILTER.drivetrain, '')
    }
  }

  return (
    <div className="space-y-3">
      <FilterCombobox
        label="Year"
        options={years}
        value={year}
        onChange={(val) => handleChange('year', val)}
        isLoading={loadingYears}
      />
      <FilterCombobox
        label="Make"
        options={makes}
        value={make}
        onChange={(val) => handleChange('make', val)}
        isLoading={loadingMakes}
        disabled={disabledStates.make}
      />
      <FilterCombobox
        label="Model"
        options={models}
        value={model}
        onChange={(val) => handleChange('model', val)}
        isLoading={loadingModels}
        disabled={disabledStates.model}
      />
      <FilterCombobox
        label="Trim"
        options={trims}
        value={trim}
        onChange={(val) => handleChange('trim', val)}
        isLoading={loadingTrims}
        disabled={disabledStates.trim}
      />
      {includeDrivetrain && (
        <FilterCombobox
          label="Drivetrain"
          options={DRIVETRAIN_OPTIONS}
          value={drivetrain}
          onChange={(val) => handleChange('drivetrain', val)}
          disabled={disabledStates.drivetrain}
        />
      )}
    </div>
  )
}
