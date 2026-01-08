import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { ChevronDown, FilterIcon, Sparkles, X } from 'lucide-react'
import VehicleSelectorAdvanced from './VehicleSelectorAdvanced.jsx'
import { useProductFilters } from '../hooks/useProductFilters.jsx'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'

const baseInputClass = 'w-full rounded-xl bg-[#F8F8F8] px-4 py-2.5 text-sm font-medium text-gray-800 transition outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF33] focus-visible:bg-white focus-visible:shadow-[0_0_0_2px_#007AFF22]'
const sectionLabelClass = 'text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'

const sectionMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

function FilterSection({ id, title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-2xl bg-white/60 p-4 shadow-sm shadow-black/5 ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
        aria-expanded={open}
        aria-controls={`${id}-section`}
      >
        <span className={sectionLabelClass}>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            id={`${id}-section`}
            key={id}
            {...sectionMotion}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              {children}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SuggestionChips({ items, onApply }) {
  if (!items.length) return null

  return (
    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onApply(item.key, item.value)}
          className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 transition hover:bg-gray-200"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#007AFF]" />
          {item.label}
        </button>
      ))}
    </div>
  )
}

const staticLiftOptions = ['Level Kit', '2"', '3"', '4"', '5"', '6"', '7"+']
const staticWheelOptions = ['17"', '18"', '20"', '22"']

export default function FilterSidebar({ onClose, isMobile = false }) {
  const {
    filters,
    setFilter,
    clearFilters,
    uniqueOptions,
    hasActiveFilters,
  } = useProductFilters()

  const [searchValue, setSearchValue] = useState(filters.search || '')
  const debouncedSearch = useDebouncedValue(searchValue, 350)
  const lastSyncedSearchRef = useRef(filters.search || '')

  useEffect(() => {
    const nextSearch = filters.search || ''
    if (lastSyncedSearchRef.current === nextSearch) return
    lastSyncedSearchRef.current = nextSearch
    setSearchValue(nextSearch)
  }, [filters.search])

  useEffect(() => {
    const normalized = debouncedSearch || ''
    if (lastSyncedSearchRef.current === normalized && (filters.search || '') === normalized) return

    lastSyncedSearchRef.current = normalized

    if ((filters.search || '') !== normalized) {
      setFilter('search', normalized)
    } else if (searchValue !== normalized) {
      setSearchValue(normalized)
    }
  }, [debouncedSearch, filters.search, searchValue, setFilter])

  const suggestions = useMemo(() => {
    const hints = []
    if (!filters.lift_height_range) {
      const lift = uniqueOptions.lift_heights?.[0] || staticLiftOptions[2]
      if (lift) {
        hints.push({ key: 'lift_height_range', label: `Try ${lift} lift`, value: lift })
      }
    }
    if (!filters.wheel_diameter) {
      const diameter = uniqueOptions.wheel_diameters?.[0] || staticWheelOptions[2]
      if (diameter) {
        hints.push({ key: 'wheel_diameter', label: `${diameter} wheels`, value: diameter })
      }
    }
    if (!filters.brand && uniqueOptions.brands?.length) {
      const brand = uniqueOptions.brands[0]
      hints.push({ key: 'brand', label: `Popular: ${brand}`, value: brand })
    }
    if (filters.brand && !filters.search && uniqueOptions.skus?.length) {
      const sku = uniqueOptions.skus[0]
      hints.push({ key: 'search', label: `Search SKU ${sku}`, value: sku })
    }
    return hints.slice(0, 2)
  }, [filters, uniqueOptions])

  const handleClearAll = () => {
    clearFilters()
    if (onClose) onClose()
  }

  const inputClass = `${baseInputClass} ${isMobile ? 'bg-white/90' : ''}`

  const suggestionsVisible = suggestions.length > 0

  const content = (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          disabled={!hasActiveFilters}
          className={`text-sm font-medium text-[#007AFF] transition ${hasActiveFilters ? 'opacity-100 hover:opacity-100' : 'opacity-40 cursor-not-allowed'}`}
        >
          Clear All
        </button>
      </div>

      <FilterSection id="vehicle" title="Vehicle">
        <VehicleSelectorAdvanced
          value={{
            year: filters.vehicle_year,
            make: filters.vehicle_make,
            model: filters.vehicle_model,
            trim: filters.vehicle_trim,
          }}
          onChange={(vehicle) => {
            setFilter('vehicle_year', vehicle.year)
            setFilter('vehicle_make', vehicle.make)
            setFilter('vehicle_model', vehicle.model)
            setFilter('vehicle_trim', vehicle.trim)
          }}
        />
      </FilterSection>

      <FilterSection id="search" title="Search & Pricing">
        <div className="space-y-3">
          <input
            type="search"
            className={inputClass}
            placeholder="Search SKU, brand, or spec"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          {suggestionsVisible && (
            <SuggestionChips
              items={suggestions}
              onApply={(key, value) => setFilter(key, value)}
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              className={inputClass}
              placeholder="Price Min"
              value={filters.price_min || ''}
              onChange={(event) => setFilter('price_min', event.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              min="0"
              className={inputClass}
              placeholder="Price Max"
              value={filters.price_max || ''}
              onChange={(event) => setFilter('price_max', event.target.value)}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection id="specs" title="Fitment Filters">
        <SelectField
          label="Lift Height"
          placeholder="Select Lift"
          options={uniqueOptions.lift_heights?.length ? uniqueOptions.lift_heights : staticLiftOptions}
          value={filters.lift_height_range}
          onChange={(value) => setFilter('lift_height_range', value)}
        />
        <SelectField
          label="Wheel Diameter"
          placeholder="Select Diameter"
          options={uniqueOptions.wheel_diameters?.length ? uniqueOptions.wheel_diameters : staticWheelOptions}
          value={filters.wheel_diameter}
          onChange={(value) => setFilter('wheel_diameter', value)}
        />
        <SelectField
          label="Tire Size"
          placeholder="Select Tire Size"
          options={uniqueOptions.tire_sizes ?? []}
          value={filters.tire_size}
          onChange={(value) => setFilter('tire_size', value)}
        />
        <SelectField
          label="Brand"
          placeholder="Select Brand"
          options={uniqueOptions.brands ?? []}
          value={filters.brand}
          onChange={(value) => setFilter('brand', value)}
        />
      </FilterSection>

      <FilterSection id="toggles" title="Quick Toggles" defaultOpen={false}>
        <ToggleField
          label="On Sale"
          checked={filters.on_sale}
          onChange={(value) => setFilter('on_sale', value)}
        />
        <ToggleField
          label="Free Shipping"
          checked={filters.free_shipping}
          onChange={(value) => setFilter('free_shipping', value)}
        />
        <ToggleField
          label="Combos Only"
          checked={filters.combo_only}
          onChange={(value) => setFilter('combo_only', value)}
        />
      </FilterSection>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Motion.button
          type="button"
          onClick={handleClearAll}
          disabled={!hasActiveFilters}
          className={`w-full rounded-full px-5 py-3 text-sm font-semibold shadow-lg shadow-black/30 transition ${hasActiveFilters ? 'bg-black text-white hover:bg-gray-900' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          animate={{ opacity: hasActiveFilters ? 1 : 0.5, y: hasActiveFilters ? 0 : 4 }}
          transition={{ duration: 0.2 }}
        >
          Clear All Filters
        </Motion.button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500"
          >
            <X className="h-4 w-4" /> Close
          </button>
        )}
      </div>
    </div>
  )

  if (!isMobile) {
    return (
      <aside className="sticky top-24 max-h-[calc(100vh-6rem)] w-full max-w-xs overflow-y-auto rounded-3xl bg-[#F5F5F7] p-5 shadow-inner shadow-white/80 backdrop-blur" data-testid="filter-sidebar">
        {content}
      </aside>
    )
  }

  return (
    <Motion.aside
      key="mobile-filter"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm overflow-y-auto bg-[#F5F5F7] p-6 shadow-2xl"
    >
      {content}
    </Motion.aside>
  )
}

function SelectField({ label, placeholder, options, value, onChange }) {
  return (
    <label className="block text-sm text-gray-700">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        {label}
      </span>
      <div className="flex items-center rounded-xl bg-[#F8F8F8] px-3">
        <select
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none bg-transparent py-2.5 text-sm font-medium text-gray-800 outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#F8F8F8] px-4 py-3 text-sm font-medium text-gray-800">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border border-gray-300 accent-black"
      />
    </label>
  )
}
