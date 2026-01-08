import { useEffect, useMemo, useState } from 'react'
import VehicleSelectorAdvanced from './VehicleSelectorAdvanced.jsx'
import FilterCombobox from './FilterCombobox.jsx'
import {
  getLiftHeights,
  getTireSizes,
  getWheelDiameters,
  getBrands,
} from '../services/supabaseFilters.js'
import { useProductFilters } from '../hooks/useProductFilters.jsx'

export default function SidebarFilters({ onClose, isMobile = false }) {
  const {
    filters,
    setFilter,
    clearFilters,
  } = useProductFilters()

  const [liftOptions, setLiftOptions] = useState([])
  const [tireSizeOptions, setTireSizeOptions] = useState([])
  const [diameterOptions, setDiameterOptions] = useState([])
  const [brandOptions, setBrandOptions] = useState([])

  const [loadingLifts, setLoadingLifts] = useState(false)
  const [loadingTires, setLoadingTires] = useState(false)
  const [loadingDiameters, setLoadingDiameters] = useState(false)
  const [loadingBrands, setLoadingBrands] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadingLifts(true)
      setLoadingTires(true)
      setLoadingDiameters(true)
      setLoadingBrands(true)

      try {
        const [liftValues, tireValues, diameterValues, brandValues] = await Promise.all([
          getLiftHeights(),
          getTireSizes(),
          getWheelDiameters(),
          getBrands(),
        ])

        if (cancelled) return

        setLiftOptions(liftValues)
        setTireSizeOptions(tireValues)
        setDiameterOptions(diameterValues)
        setBrandOptions(brandValues)
      } finally {
        if (!cancelled) {
          setLoadingLifts(false)
          setLoadingTires(false)
          setLoadingDiameters(false)
          setLoadingBrands(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const updateFilter = (key, value) => {
    setFilter(key, value ?? '')
  }

  const handleVehicleChange = (vehicle) => {
    updateFilter('vehicle_year', vehicle.year || '')
    updateFilter('vehicle_make', vehicle.make || '')
    updateFilter('vehicle_model', vehicle.model || '')
    updateFilter('vehicle_trim', vehicle.trim || '')
  }

  const inputBase = useMemo(
    () =>
      `w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition focus-visible:ring-2 focus-visible:ring-black/10 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500`,
    []
  )

  const asideClass = useMemo(
    () =>
      `w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${
        isMobile ? 'max-h-[85vh] overflow-y-auto' : ''
      }`,
    [isMobile]
  )

  return (
    <aside className={asideClass}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Filters</h2>
          <p className="text-xs text-zinc-400">Refine results for the perfect fit.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearFilters()
            onClose?.()
          }}
          className="text-xs font-semibold text-blue-500 transition hover:text-blue-600 disabled:opacity-40"
        >
          Clear All
        </button>
      </div>

      <section className="mt-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          Vehicle
        </h3>
        <VehicleSelectorAdvanced
          value={{
            year: filters.vehicle_year,
            make: filters.vehicle_make,
            model: filters.vehicle_model,
            trim: filters.vehicle_trim,
          }}
          onChange={handleVehicleChange}
        />
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          Search &amp; Pricing
        </h3>
        <input
          type="search"
          value={filters.search || ''}
          onChange={(event) => updateFilter('search', event.target.value)}
          placeholder="Search SKU, brand, or spec"
          className={inputBase}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            value={filters.price_min || ''}
            onChange={(event) => updateFilter('price_min', event.target.value)}
            placeholder="Price Min"
            className={inputBase}
          />
          <input
            type="number"
            min={0}
            value={filters.price_max || ''}
            onChange={(event) => updateFilter('price_max', event.target.value)}
            placeholder="Price Max"
            className={inputBase}
          />
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Fitment Filters
          </h3>
          <button
            type="button"
            onClick={() => {
              updateFilter('lift_height_range', '')
              updateFilter('wheel_diameter', '')
              updateFilter('tire_size', '')
              updateFilter('brand', '')
            }}
            className="text-xs font-semibold text-blue-500 transition hover:text-blue-600"
          >
            Clear
          </button>
        </div>

        <FilterCombobox
          label="Lift Height"
          placeholder="Select Lift"
          value={filters.lift_height_range || ''}
          options={liftOptions}
          onChange={(val) => updateFilter('lift_height_range', val)}
          isLoading={loadingLifts}
        />

        <FilterCombobox
          label="Wheel Diameter"
          placeholder="Select Diameter"
          value={filters.wheel_diameter || ''}
          options={diameterOptions}
          onChange={(val) => updateFilter('wheel_diameter', val)}
          isLoading={loadingDiameters}
        />

        <FilterCombobox
          label="Tire Size"
          placeholder="Select Tire Size"
          value={filters.tire_size || ''}
          options={tireSizeOptions}
          onChange={(val) => updateFilter('tire_size', val)}
          isLoading={loadingTires}
        />

        <FilterCombobox
          label="Brand"
          placeholder="Select Brand"
          value={filters.brand || ''}
          options={brandOptions}
          onChange={(val) => updateFilter('brand', val)}
          isLoading={loadingBrands}
        />
      </section>
    </aside>
  )
}
