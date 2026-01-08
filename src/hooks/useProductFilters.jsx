import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { fetchDistinct } from '../services/productsService'
import { fetchFilteredProducts as fetchFilteredProductsFromSupabase } from '../supabase/products'

const DEFAULT_FILTERS = {
  search: '',
  brand: '',
  category: [],
  price_min: '',
  price_max: '',
  lift_height_range: '',
  wheel_diameter: '',
  wheel_width: '',
  wheel_offset: '',
  wheel_brand: '',
  wheel_model: '',
  wheel_weight: '',
  wheel_material: '',
  wheel_finish: '',
  bolt_pattern: '',
  tire_size: '',
  tire_type: '',
  suspension_type: '',
  drivetrain: '',
  fitment_preference: '',
  fitment_preference_range: null,
  fitment_preference_label: '',
  tags: [],
  on_sale: false,
  free_shipping: false,
  combo_only: false,
  vehicle_year: '',
  vehicle_make: '',
  vehicle_model: '',
  vehicle_trim: '',
}

const FILTER_KEYS = Object.keys(DEFAULT_FILTERS)

const DEFAULT_OPTIONS = {
  brands: [],
  tire_sizes: [],
  wheel_diameters: [],
  wheel_widths: [],
  wheel_offsets: [],
  wheel_brands: [],
  wheel_models: [],
  wheel_weights: [],
  wheel_materials: [],
  wheel_finishes: [],
  bolt_patterns: [],
  lift_heights: [],
  skus: [],
}

const DEFAULT_RESULTS = {
  items: [],
  total: 0,
  page: 1,
  hasMore: false,
  loading: false,
  error: '',
}

const PER_PAGE = 12
const VEHICLE_STORAGE_KEY = 'modlift_vehicle'

const ProductFiltersContext = createContext(undefined)

const ARRAY_FILTER_KEYS = ['tags', 'category']

const FILTER_LABELS = {
  search: 'Search',
  brand: 'Brand',
  category: 'Category',
  price_min: 'Price Min',
  price_max: 'Price Max',
  lift_height_range: 'Lift Height',
  wheel_diameter: 'Diameter',
  wheel_width: 'Width',
  wheel_offset: 'Offset',
  wheel_brand: 'Wheel Brand',
  wheel_model: 'Wheel Model',
  wheel_weight: 'Weight',
  wheel_material: 'Material',
  wheel_finish: 'Finish',
  bolt_pattern: 'Bolt Pattern',
  tire_size: 'Tire Size',
  tire_type: 'Tire Type',
  suspension_type: 'Suspension Type',
  drivetrain: 'Drivetrain',
  fitment_preference: 'Preference',
  tags: 'Tags',
  on_sale: 'On Sale',
  free_shipping: 'Free Shipping',
  combo_only: 'Combos Only',
  vehicle_year: 'Year',
  vehicle_make: 'Make',
  vehicle_model: 'Model',
  vehicle_trim: 'Trim',
}

const areArraysEqual = (a = [], b = []) => {
  if (a === b) return true
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return false
  return a.every((value, index) => value === b[index])
}

const normalizeValue = (key, value) => {
  if (ARRAY_FILTER_KEYS.includes(key)) {
    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === 'string' ? item : String(item ?? ''))).filter((item) => item && item.trim().length > 0)
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    }
    return []
  }
  if (value === undefined || value === null) return DEFAULT_FILTERS[key] ?? ''
  if (typeof DEFAULT_FILTERS[key] === 'boolean') {
    if (typeof value === 'string') {
      const normalized = value.toLowerCase()
      return normalized === 'true' || normalized === '1' || normalized === 'yes'
    }
    return Boolean(value)
  }
  if (typeof DEFAULT_FILTERS[key] === 'string') return String(value)
  return value
}

const cloneDefaultFilters = () => {
  const clone = { ...DEFAULT_FILTERS }
  ARRAY_FILTER_KEYS.forEach((key) => {
    clone[key] = [...(DEFAULT_FILTERS[key] ?? [])]
  })
  return clone
}

const buildFiltersFromOverrides = (overrides = {}) => {
  const merged = cloneDefaultFilters()

  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(DEFAULT_FILTERS, key)) {
      const normalized = normalizeValue(key, value)
      merged[key] = ARRAY_FILTER_KEYS.includes(key) ? [...normalized] : normalized
    }
  })

  return merged
}

const haveFiltersChanged = (prev, next) =>
  FILTER_KEYS.some((key) => {
    if (ARRAY_FILTER_KEYS.includes(key)) {
      return !areArraysEqual(prev[key], next[key])
    }
    if (key === 'fitment_preference_range') {
      const prevRange = prev[key]
      const nextRange = next[key]
      const prevSerialized = prevRange ? JSON.stringify(prevRange) : ''
      const nextSerialized = nextRange ? JSON.stringify(nextRange) : ''
      return prevSerialized !== nextSerialized
    }
    return prev[key] !== next[key]
  })

const buildChips = (filters) => {
  const chips = []

  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'fitment_preference_label' || key === 'fitment_preference_range') {
      return
    }

    if (typeof DEFAULT_FILTERS[key] === 'boolean') {
      if (value) chips.push({ key, value: 'Yes', label: FILTER_LABELS[key] ?? key })
      return
    }

    if (ARRAY_FILTER_KEYS.includes(key)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((item) => {
          chips.push({ key, value: item, label: FILTER_LABELS[key] ?? key })
        })
      }
      return
    }

    if (key === 'fitment_preference') {
      if (typeof value === 'string' && value.trim().length > 0) {
        const label = filters.fitment_preference_label || value
        chips.push({ key, value: label, label: FILTER_LABELS[key] ?? key })
      }
      return
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      chips.push({ key, value, label: FILTER_LABELS[key] ?? key })
    }
  })

  if (filters.price_min || filters.price_max) {
    chips.push({
      key: 'price',
      value: `${filters.price_min ? `$${filters.price_min}` : 'Any'} - ${filters.price_max ? `$${filters.price_max}` : 'Any'}`,
      label: 'Price',
    })
  }

  return chips
}

const toSortedStringList = (values = []) =>
  Array.from(new Set(values.filter((value) => value !== null && value !== undefined && value !== '')).values())
    .map((value) => (typeof value === 'string' ? value : String(value)))
    .sort((a, b) => a.localeCompare(b))

const formatWheelDiameters = (values = []) =>
  toSortedStringList(values).map((value) => {
    const numeric = Number(value)
    if (Number.isFinite(numeric)) {
      return `${numeric}` + '"'
    }
    return value.includes('"') ? value : `${value}` + '"'
  })

const formatLiftHeights = (values = []) =>
  toSortedStringList(values).map((value) => {
    if (value.toLowerCase().includes('level')) return value
    const numeric = Number(value)
    if (Number.isFinite(numeric)) {
      return numeric === 0 ? 'Level Kit' : `${numeric}` + '"'
    }
    return value
  })

function useProvideProductFilters() {
  const [filters, setFilters] = useState(() => cloneDefaultFilters())
  const [uniqueOptions, setUniqueOptions] = useState({ ...DEFAULT_OPTIONS })
  const baseOptionsRef = useRef(null)
  const hasHydratedFilters = useRef(false)
  const [results, setResultsState] = useState(DEFAULT_RESULTS.items)
  const [total, setTotal] = useState(DEFAULT_RESULTS.total)
  const [loading, setLoading] = useState(DEFAULT_RESULTS.loading)
  const [error, setError] = useState(DEFAULT_RESULTS.error)
  const [page, setPage] = useState(DEFAULT_RESULTS.page)
  const [hasMore, setHasMore] = useState(DEFAULT_RESULTS.hasMore)
  const filtersSnapshot = useMemo(() => JSON.stringify(filters), [filters])
  const lastSyncedUrlRef = useRef('')

  useEffect(() => {
    let cancelled = false

    const loadBaseOptions = async () => {
      try {
        const [
          brands,
          tireSizes,
          wheelDiameters,
          wheelWidths,
          wheelOffsets,
          wheelBrands,
          wheelModels,
          wheelWeights,
          wheelMaterials,
          wheelFinishes,
          boltPatterns,
          liftHeights,
          skus,
        ] = await Promise.all([
          fetchDistinct({ column: 'brand' }),
          fetchDistinct({ column: 'tire_size' }),
          fetchDistinct({ column: 'wheel_diameter' }),
          fetchDistinct({ column: 'wheel_width' }),
          fetchDistinct({ column: 'offset' }),
          fetchDistinct({ column: 'wheel_brand' }),
          fetchDistinct({ column: 'wheel_model' }),
          fetchDistinct({ column: 'weight' }),
          fetchDistinct({ column: 'material' }),
          fetchDistinct({ column: 'wheel_finish' }),
          fetchDistinct({ column: 'bolt_pattern' }),
          fetchDistinct({ column: 'lift_height' }),
          fetchDistinct({ column: 'sku' }),
        ])

        if (cancelled) return

        const options = {
          brands: toSortedStringList(brands),
          tire_sizes: toSortedStringList(tireSizes),
          wheel_diameters: formatWheelDiameters(wheelDiameters),
          wheel_widths: toSortedStringList(wheelWidths),
          wheel_offsets: toSortedStringList(wheelOffsets),
          wheel_brands: toSortedStringList(wheelBrands),
          wheel_models: toSortedStringList(wheelModels),
          wheel_weights: toSortedStringList(wheelWeights),
          wheel_materials: toSortedStringList(wheelMaterials),
          wheel_finishes: toSortedStringList(wheelFinishes),
          bolt_patterns: toSortedStringList(boltPatterns),
          lift_heights: formatLiftHeights(liftHeights),
          skus: toSortedStringList(skus),
        }

        baseOptionsRef.current = options
        setUniqueOptions(options)
      } catch (error) {
        console.error('Failed to load base filter options', error)
        if (!cancelled) {
          baseOptionsRef.current = { ...DEFAULT_OPTIONS }
          setUniqueOptions({ ...DEFAULT_OPTIONS })
        }
      }
    }

    loadBaseOptions()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let currentFilters

    try {
      currentFilters = JSON.parse(filtersSnapshot)
    } catch (error) {
      console.warn('Failed to parse filters snapshot', error)
      currentFilters = cloneDefaultFilters()
    }

    const load = async () => {
      setLoading(true)
      setError('')

      if (page === 1) {
        setResultsState([])
      }

      try {
        const { data, total: newTotal, hasMore: more } = await fetchFilteredProductsFromSupabase(currentFilters, page, PER_PAGE)
        if (cancelled) return

        setResultsState((prev) => {
          const next = page === 1 ? data : [...prev, ...data]
          setTotal(typeof newTotal === 'number' ? newTotal : next.length)
          return next
        })
        setHasMore(Boolean(more ?? (data.length === PER_PAGE)))
      } catch (err) {
        console.error('Failed to fetch filtered products', err)
        if (!cancelled) {
          setError(err.message || 'Failed to load products')
          if (page === 1) {
            setResultsState([])
            setTotal(0)
          }
          setHasMore(false)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [filtersSnapshot, page])

  useEffect(() => {
    if (!baseOptionsRef.current) return

    let cancelled = false

    const filter = {}
    if (filters.vehicle_year) filter.vehicle_year = filters.vehicle_year
    if (filters.vehicle_make) filter.vehicle_make = filters.vehicle_make
    if (filters.vehicle_model) filter.vehicle_model = filters.vehicle_model
    if (filters.vehicle_trim) filter.vehicle_trim = filters.vehicle_trim
    if (filters.brand) filter.brand = filters.brand

    const loadFilteredOptions = async () => {
      try {
        const [
          wheelDiameters,
          wheelWidths,
          wheelOffsets,
          wheelBrands,
          wheelModels,
          wheelWeights,
          wheelMaterials,
          wheelFinishes,
          boltPatterns,
          tireSizes,
          liftHeights,
          skus,
          brands,
        ] = await Promise.all([
          fetchDistinct({ column: 'wheel_diameter', filter }),
          fetchDistinct({ column: 'wheel_width', filter }),
          fetchDistinct({ column: 'offset', filter }),
          fetchDistinct({ column: 'wheel_brand', filter }),
          fetchDistinct({ column: 'wheel_model', filter }),
          fetchDistinct({ column: 'weight', filter }),
          fetchDistinct({ column: 'material', filter }),
          fetchDistinct({ column: 'wheel_finish', filter }),
          fetchDistinct({ column: 'bolt_pattern', filter }),
          fetchDistinct({ column: 'tire_size', filter }),
          fetchDistinct({ column: 'lift_height', filter }),
          fetchDistinct({ column: 'sku', filter }),
          fetchDistinct({ column: 'brand', filter }),
        ])

        if (cancelled) return

        const base = baseOptionsRef.current ?? DEFAULT_OPTIONS

        setUniqueOptions({
          brands: brands.length ? toSortedStringList(brands) : base.brands,
          tire_sizes: tireSizes.length ? toSortedStringList(tireSizes) : base.tire_sizes,
          wheel_diameters: wheelDiameters.length ? formatWheelDiameters(wheelDiameters) : base.wheel_diameters,
          wheel_widths: wheelWidths.length ? toSortedStringList(wheelWidths) : base.wheel_widths,
          wheel_offsets: wheelOffsets.length ? toSortedStringList(wheelOffsets) : base.wheel_offsets,
          wheel_brands: wheelBrands.length ? toSortedStringList(wheelBrands) : base.wheel_brands,
          wheel_models: wheelModels.length ? toSortedStringList(wheelModels) : base.wheel_models,
          wheel_weights: wheelWeights.length ? toSortedStringList(wheelWeights) : base.wheel_weights,
          wheel_materials: wheelMaterials.length ? toSortedStringList(wheelMaterials) : base.wheel_materials,
          wheel_finishes: wheelFinishes.length ? toSortedStringList(wheelFinishes) : base.wheel_finishes,
          bolt_patterns: boltPatterns.length ? toSortedStringList(boltPatterns) : base.bolt_patterns,
          lift_heights: liftHeights.length ? formatLiftHeights(liftHeights) : base.lift_heights,
          skus: skus.length ? toSortedStringList(skus) : base.skus,
        })
      } catch (error) {
        console.error('Failed to fetch filtered option data', error)
        if (!cancelled && baseOptionsRef.current) {
          setUniqueOptions(baseOptionsRef.current)
        }
      }
    }

    loadFilteredOptions()
    return () => {
      cancelled = true
    }
  }, [filters.vehicle_year, filters.vehicle_make, filters.vehicle_model, filters.vehicle_trim, filters.brand])

  const setFilter = useCallback((key, value) => {
    let didUpdate = false

    setFilters((prev) => {
      const normalized = normalizeValue(key, value)
      if (ARRAY_FILTER_KEYS.includes(key)) {
        if (areArraysEqual(prev[key], normalized)) {
          return prev
        }
      } else if (prev[key] === normalized) {
        return prev
      }

      didUpdate = true
      return {
        ...prev,
        [key]: normalized,
      }
    })

    if (didUpdate) {
      setPage(1)
    }
  }, [])

  const setFiltersDirect = useCallback((next) => {
    let didUpdate = false

    setFilters((prev) => {
      const merged = buildFiltersFromOverrides(next)
      if (!haveFiltersChanged(prev, merged)) {
        return prev
      }

      didUpdate = true
      return merged
    })

    if (didUpdate) {
      setPage(1)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || hasHydratedFilters.current) return

    const params = new URLSearchParams(window.location.search)
    const fromQuery = {}
    params.forEach((value, key) => {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_FILTERS, key)) {
        fromQuery[key] = normalizeValue(key, value)
      }
    })

    if (Object.keys(fromQuery).length > 0) {
      const nextFromQuery = buildFiltersFromOverrides(fromQuery)
      setFilters((prev) => (haveFiltersChanged(prev, nextFromQuery) ? nextFromQuery : prev))
      hasHydratedFilters.current = true
      return
    }

    const initialFilters = cloneDefaultFilters()
    let hasInitialFilters = false

    const stored = window.localStorage.getItem('modlift-filters')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        Object.entries(parsed).forEach(([key, value]) => {
          if (Object.prototype.hasOwnProperty.call(DEFAULT_FILTERS, key)) {
            initialFilters[key] = normalizeValue(key, value)
            hasInitialFilters = true
          }
        })
      } catch (error) {
        console.warn('Failed to parse stored filters', error)
      }
    }

    if (initialFilters.vehicle_year === DEFAULT_FILTERS.vehicle_year) {
      const savedVehicle = window.localStorage.getItem(VEHICLE_STORAGE_KEY)
      if (savedVehicle) {
        try {
          const parsedVehicle = JSON.parse(savedVehicle)
          if (parsedVehicle.year) {
            initialFilters.vehicle_year = String(parsedVehicle.year)
            hasInitialFilters = true
          }
          if (parsedVehicle.make) {
            initialFilters.vehicle_make = String(parsedVehicle.make)
            hasInitialFilters = true
          }
          if (parsedVehicle.model) {
            initialFilters.vehicle_model = String(parsedVehicle.model)
            hasInitialFilters = true
          }
          if (parsedVehicle.trim) {
            initialFilters.vehicle_trim = String(parsedVehicle.trim)
            hasInitialFilters = true
          }
        } catch (error) {
          console.warn('Failed to parse stored vehicle selection', error)
        }
      }
    }

    if (hasInitialFilters) {
      setFilters((prev) => (haveFiltersChanged(prev, initialFilters) ? initialFilters : prev))
    }

    hasHydratedFilters.current = true
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !hasHydratedFilters.current) return

    window.localStorage.setItem('modlift-filters', filtersSnapshot)

    let parsedFilters
    try {
      parsedFilters = JSON.parse(filtersSnapshot)
    } catch (error) {
      console.warn('Failed to parse filters snapshot during persistence', error)
      parsedFilters = cloneDefaultFilters()
    }

    if (typeof window === 'undefined') return

    const currentPathname = window.location.pathname
    if (currentPathname !== '/shop') {
      lastSyncedUrlRef.current = currentPathname
      return
    }

    const params = new URLSearchParams()
    Object.entries(parsedFilters).forEach(([key, value]) => {
      const defaultValue = DEFAULT_FILTERS[key]
      if (typeof defaultValue === 'boolean') {
        if (value === true) params.set(key, 'true')
        return
      }
      if (ARRAY_FILTER_KEYS.includes(key)) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','))
        }
        return
      }
      if (typeof value === 'string' && value.trim().length > 0 && value !== defaultValue) {
        params.set(key, value)
      }
    })

    const query = params.toString()
    const currentSearch = window.location.search
    const nextUrl = query ? `${currentPathname}?${query}` : currentPathname
    const currentUrl = `${currentPathname}${currentSearch}`

    if (lastSyncedUrlRef.current !== nextUrl) {
      lastSyncedUrlRef.current = nextUrl
      if (nextUrl !== currentUrl) {
        window.history.replaceState({}, '', nextUrl)
      }
    }
  }, [filtersSnapshot])

  const removeFilter = useCallback((key) => {
    let didUpdate = false

    setFilters((prev) => {
      if (key === 'price') {
        const nextMin = DEFAULT_FILTERS.price_min
        const nextMax = DEFAULT_FILTERS.price_max
        if (prev.price_min === nextMin && prev.price_max === nextMax) {
          return prev
        }

        didUpdate = true
        return {
          ...prev,
          price_min: nextMin,
          price_max: nextMax,
        }
      }

      if (key === 'fitment_preference') {
        const nextPreference = DEFAULT_FILTERS.fitment_preference
        const nextRange = DEFAULT_FILTERS.fitment_preference_range
        const nextLabel = DEFAULT_FILTERS.fitment_preference_label
        if (
          prev.fitment_preference === nextPreference &&
          prev.fitment_preference_label === nextLabel &&
          prev.fitment_preference_range === nextRange
        ) {
          return prev
        }

        didUpdate = true
        return {
          ...prev,
          fitment_preference: nextPreference,
          fitment_preference_label: nextLabel,
          fitment_preference_range: nextRange,
        }
      }

      const defaultValue = DEFAULT_FILTERS[key] ?? ''
      if (ARRAY_FILTER_KEYS.includes(key)) {
        const nextValues = []
        if (areArraysEqual(prev[key], nextValues)) {
          return prev
        }

        didUpdate = true
        return {
          ...prev,
          [key]: nextValues,
        }
      } else {
        if (prev[key] === defaultValue) {
          return prev
        }

        didUpdate = true
        return {
          ...prev,
          [key]: defaultValue,
        }
      }
    })

    if (didUpdate) {
      setPage(1)
    }
  }, [])

  const removeFilterValue = useCallback(
    (key, valueToRemove) => {
      if (!ARRAY_FILTER_KEYS.includes(key)) {
        removeFilter(key)
        return
      }

      let didUpdate = false
      setFilters((prev) => {
        const current = Array.isArray(prev[key]) ? prev[key] : []
        const nextValues = current.filter((item) => item !== valueToRemove)
        if (areArraysEqual(current, nextValues)) {
          return prev
        }

        didUpdate = true
        return {
          ...prev,
          [key]: nextValues,
        }
      })

      if (didUpdate) {
        setPage(1)
      }
    },
    [removeFilter],
  )

  const clearFilters = useCallback(() => {
    let didUpdate = false

    setFilters((prev) => {
      const nextFilters = cloneDefaultFilters()
      if (!haveFiltersChanged(prev, nextFilters)) {
        return prev
      }

      didUpdate = true
      return nextFilters
    })

    if (didUpdate) {
      setPage(1)
    }
  }, [])

  const clearAllFilters = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  const setResults = useCallback((items) => {
    setResultsState(items)
    setTotal(items.length)
  }, [])

  const fetchNextPage = useCallback(() => {
    setPage((prev) => (hasMore && !loading ? prev + 1 : prev))
  }, [hasMore, loading])

  const activeChips = useMemo(() => buildChips(filters), [filters])
  const hasActiveFilters = activeChips.length > 0

  const selectedBadges = activeChips

  return {
    filters,
    setFilter,
    setFilters: setFiltersDirect,
    removeFilter,
    clearFilters,
    clearAllFilters,
    removeFilterValue,
    uniqueOptions,
    activeChips,
    selectedBadges,
    hasActiveFilters,
    results,
    total,
    loading,
    error,
    hasMore,
    fetchNextPage,
    setResults,
  }
}

export function ProductFiltersProvider({ children }) {
  const value = useProvideProductFilters()
  return <ProductFiltersContext.Provider value={value}>{children}</ProductFiltersContext.Provider>
}

export function useProductFilters() {
  const context = useContext(ProductFiltersContext)
  if (!context) {
    throw new Error('useProductFilters must be used within a ProductFiltersProvider')
  }
  return context
}

export const PRODUCT_DEFAULT_FILTERS = DEFAULT_FILTERS

export default useProductFilters
