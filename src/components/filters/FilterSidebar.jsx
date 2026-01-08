import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Truck,
  Gauge,
  Tag,
  CircleDot,
  DollarSign,
  ArrowUpFromLine,
  Circle,
  Hexagon,
  Wrench,
  Sparkles,
  Ruler,
  Building2,
} from 'lucide-react'
import VehicleSelectorCombobox from '@/components/filters/VehicleSelectorCombobox.jsx'
import FilterCombobox from '@/components/FilterCombobox.jsx'
import { useProductFilters } from '@/hooks/useProductFilters.jsx'
import { useVehicle } from '@/components/filters/VehicleContext.jsx'
import { getProductTags } from '@/lib/filterOptions.js'
import { fetchDrivetrainsForVehicle } from '@/services/drivetrainService.js'
import { useFitmentFilters } from '@/hooks/useFitmentFilters'

const CATEGORY_OPTIONS = [
  { value: 'suspension', label: 'Suspension', icon: ArrowUpFromLine, description: 'Lifts, coilovers & more' },
  { value: 'wheels', label: 'Wheels', icon: Hexagon, description: 'Rims & alloys' },
  { value: 'tires', label: 'Tires', icon: Circle, description: 'All terrain & more' },
  { value: 'accessories', label: 'Accessories', icon: Wrench, description: 'Parts & extras' },
]

const SUSPENSION_TYPE_OPTIONS = [
  { value: '', label: 'Shop All' },
  { value: 'air_suspension', label: 'Air Suspension' },
  { value: 'body_lift', label: 'Body Lift Kits' },
  { value: 'coilovers', label: 'Coilovers' },
  { value: 'leveling', label: 'Leveling Kits' },
  { value: 'lift_kits', label: 'Lift Kits' },
  { value: 'lowering', label: 'Lowering Kits' },
  { value: 'shocks_struts', label: 'Shocks & Struts' },
]

const TIRE_TYPE_OPTIONS = [
  { value: '', label: 'Shop All' },
  { value: 'all_season', label: 'All Season' },
  { value: 'all_terrain', label: 'All Terrain' },
  { value: 'hybrid', label: 'Hybrid AT/MT' },
  { value: 'mud_terrain', label: 'Mud Terrain' },
]

const WHEEL_DIAMETER_OPTIONS = [
  { value: '17', label: '17"' },
  { value: '18', label: '18"' },
  { value: '20', label: '20"' },
  { value: '22', label: '22"' },
  { value: '24', label: '24"' },
]

// Category Card Component
function CategoryCard({ category, isSelected, onClick }) {
  const Icon = category.icon
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200',
        'group cursor-pointer',
        isSelected
          ? 'bg-lime-500/15 border-lime-500/50 shadow-lg shadow-lime-500/10'
          : 'bg-night-800/30 border-night-700/50 hover:bg-night-800/50 hover:border-night-600'
      )}
    >
      <div
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200',
          isSelected
            ? 'bg-lime-500/20 text-lime-400'
            : 'bg-night-700/50 text-slate-400 group-hover:bg-night-700 group-hover:text-white'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span
        className={clsx(
          'mt-2 text-xs font-medium transition-colors',
          isSelected ? 'text-lime-400' : 'text-slate-300 group-hover:text-white'
        )}
      >
        {category.label}
      </span>
      {isSelected && (
        <motion.div
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Sparkles className="h-2.5 w-2.5 text-night-950" />
        </motion.div>
      )}
    </motion.button>
  )
}

// Helper to check if category is selected (handles array)
function isCategorySelected(categories, value) {
  if (Array.isArray(categories)) {
    return categories.includes(value)
  }
  return categories === value
}

// Helper to toggle category in array
function toggleCategory(categories, value) {
  const currentCategories = Array.isArray(categories) ? categories : categories ? [categories] : []
  if (currentCategories.includes(value)) {
    return currentCategories.filter((c) => c !== value)
  }
  return [...currentCategories, value]
}

// Spec Chip Component (reusable for wheel size, tire size, lift height)
function SpecChip({ label, isSelected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        'relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-200',
        'border',
        isSelected
          ? 'bg-lime-500 text-night-950 border-lime-500 shadow-lg shadow-lime-500/30'
          : 'bg-night-800/50 text-slate-300 border-night-700/50 hover:bg-night-800 hover:text-white hover:border-night-600'
      )}
    >
      {label}
    </motion.button>
  )
}

// Guided Spec Section Component
function GuidedSpecSection({ title, icon: Icon, options, value, onChange, placeholder, isHighlighted }) {
  const hasValue = Boolean(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={clsx(
        'p-3 rounded-xl border transition-all duration-300',
        isHighlighted && !hasValue
          ? 'bg-lime-500/5 border-lime-500/30 ring-1 ring-lime-500/20'
          : 'bg-night-800/20 border-night-700/30'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={clsx(
              'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
              isHighlighted && !hasValue ? 'bg-lime-500/20 text-lime-400' : 'bg-night-700/50 text-slate-400'
            )}>
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}
          <span className={clsx(
            'text-xs font-medium uppercase tracking-wider transition-colors',
            isHighlighted && !hasValue ? 'text-lime-400' : 'text-slate-400'
          )}>
            {title}
          </span>
          {isHighlighted && !hasValue && (
            <span className="text-[10px] font-medium text-lime-500 bg-lime-500/10 px-1.5 py-0.5 rounded">
              Next
            </span>
          )}
        </div>
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-slate-500 hover:text-lime-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <SpecChip
            key={option.value}
            label={option.label}
            isSelected={value === option.value}
            onClick={() => onChange(value === option.value ? '' : option.value)}
          />
        ))}
        {options.length === 0 && (
          <p className="text-xs text-slate-500 italic">{placeholder || 'No options available'}</p>
        )}
      </div>
    </motion.div>
  )
}

export default function FilterSidebar({ className }) {
  const {
    filters,
    setFilter,
    clearAllFilters: resetAllFilters,
    selectedBadges,
    removeFilterValue,
    uniqueOptions,
  } = useProductFilters()

  const { selection, clearSelection } = useVehicle()
  const { fitment, setFitment, resetFitment, availableFilters, isLoadingFilters } = useFitmentFilters()

  const [drivetrains, setDrivetrains] = useState([])
  const [productTags, setProductTags] = useState([])
  const [loading, setLoading] = useState({
    drivetrain: false,
    tags: false,
  })
  const [expandedSections, setExpandedSections] = useState(['vehicle', 'fitment', 'specs'])

  // Load drivetrains dynamically based on vehicle selection
  useEffect(() => {
    let cancelled = false

    const loadDrivetrains = async () => {
      setLoading((prev) => ({ ...prev, drivetrain: true }))
      try {
        // Fetch drivetrains based on selected vehicle (or defaults if none)
        const options = await fetchDrivetrainsForVehicle({
          year: selection?.year,
          make: selection?.make,
          model: selection?.model,
          trim: selection?.trim,
        })
        if (!cancelled) {
          setDrivetrains(options)
        }
      } finally {
        if (!cancelled) {
          setLoading((prev) => ({ ...prev, drivetrain: false }))
        }
      }
    }

    loadDrivetrains()

    return () => {
      cancelled = true
    }
  }, [selection?.year, selection?.make, selection?.model, selection?.trim])

  // Load product tags (only once on mount)
  useEffect(() => {
    let cancelled = false

    const loadTags = async () => {
      setLoading((prev) => ({ ...prev, tags: true }))
      try {
        const options = await getProductTags()
        if (!cancelled) {
          setProductTags(options)
        }
      } finally {
        if (!cancelled) {
          setLoading((prev) => ({ ...prev, tags: false }))
        }
      }
    }

    loadTags()

    return () => {
      cancelled = true
    }
  }, [])

  const formatBadgeValue = (badgeValue) => {
    if (Array.isArray(badgeValue)) {
      return badgeValue.join(', ')
    }
    if (typeof badgeValue !== 'string') return badgeValue
    return badgeValue
      .split('_')
      .map((segment) => segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : segment)
      .join(' ')
  }

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleClearAll = () => {
    resetFitment()
    resetAllFilters()
    clearSelection?.()
    // Also clear localStorage to prevent filters from persisting
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('modlift-filters')
    }
  }

  const activeFilterCount = selectedBadges.length

  return (
    <aside
      className={clsx(
        'w-full max-w-xs',
        className
      )}
    >
      <div className="sticky top-24 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-500">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <p className="text-xs text-slate-500">
                {activeFilterCount > 0 ? `${activeFilterCount} active` : 'No filters applied'}
              </p>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-night-800 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear All
            </button>
          )}
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {selectedBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-night-900/50 border border-night-800/50">
                {selectedBadges.map(({ key, value, label }) => (
                  <motion.span
                    key={`${key}-${value}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-lime-500/10 border border-lime-500/30 px-2.5 py-1.5 text-xs font-medium text-lime-400"
                  >
                    <span className="text-slate-500">{label}:</span>
                    {formatBadgeValue(value)}
                    <button
                      type="button"
                      onClick={() => removeFilterValue(key, value)}
                      className="ml-0.5 rounded-full p-0.5 text-lime-400/70 transition-colors hover:bg-lime-500/20 hover:text-lime-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Sections */}
        <div className="space-y-2">
          {/* Vehicle Section */}
          <div className="rounded-xl bg-night-900/50 border border-night-800/50">
            <button
              type="button"
              onClick={() => toggleSection('vehicle')}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-night-800/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500/10 text-lime-500">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Vehicle</span>
                  <p className="text-xs text-slate-500">Year, Make, Model, Trim</p>
                </div>
              </div>
              <ChevronDown
                className={clsx(
                  'h-4 w-4 text-slate-500 transition-transform duration-200',
                  expandedSections.includes('vehicle') && 'rotate-180'
                )}
              />
            </button>

            {expandedSections.includes('vehicle') && (
              <div className="px-4 pb-4 space-y-3">
                <VehicleSelectorCombobox includeDrivetrain={false} />
                <div>
                  <FilterCombobox
                    label="Drivetrain"
                    options={drivetrains}
                    value={filters.drivetrain}
                    onChange={(value) => setFilter('drivetrain', value)}
                    isLoading={loading.drivetrain}
                    placeholder="Select drivetrain..."
                  />
                  {selection?.make && selection?.model && (
                    <p className="mt-1.5 text-xs text-slate-500">
                      Showing drivetrains for {selection.year} {selection.make} {selection.model}
                      {selection.trim && ` ${selection.trim}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Product Specs Section */}
          <div className="rounded-xl bg-night-900/50 border border-night-800/50">
            <button
              type="button"
              onClick={() => toggleSection('specs')}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-night-800/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500/10 text-lime-500">
                  <CircleDot className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Product Specs</span>
                  <p className="text-xs text-slate-500">Category, Wheel Size, Brand</p>
                </div>
              </div>
              <ChevronDown
                className={clsx(
                  'h-4 w-4 text-slate-500 transition-transform duration-200',
                  expandedSections.includes('specs') && 'rotate-180'
                )}
              />
            </button>

            {expandedSections.includes('specs') && (
              <div>
                  <div className="px-4 pb-4 space-y-4">
                    {/* Category Visual Selector - Multi-select */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Categories
                          </label>
                          {(!filters.category || (Array.isArray(filters.category) && filters.category.length === 0)) && (
                            <span className="text-[10px] font-medium text-lime-500 bg-lime-500/10 px-1.5 py-0.5 rounded">
                              Select one or more
                            </span>
                          )}
                          {Array.isArray(filters.category) && filters.category.length > 0 && (
                            <span className="text-[10px] font-medium text-slate-400 bg-night-700/50 px-1.5 py-0.5 rounded">
                              {filters.category.length} selected
                            </span>
                          )}
                        </div>
                        {Array.isArray(filters.category) && filters.category.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setFilter('category', [])}
                            className="text-xs text-slate-500 hover:text-lime-400 transition-colors"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORY_OPTIONS.map((category) => (
                          <CategoryCard
                            key={category.value}
                            category={category}
                            isSelected={isCategorySelected(filters.category, category.value)}
                            onClick={() =>
                              setFilter('category', toggleCategory(filters.category, category.value))
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Guided Specs based on Selected Categories */}
                    <AnimatePresence>
                      {/* Suspension Filters */}
                      {isCategorySelected(filters.category, 'suspension') && (
                        <motion.div
                          key="suspension-filters"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          {/* Suspension Type Dropdown */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <FilterCombobox
                              label="Suspension Type"
                              options={SUSPENSION_TYPE_OPTIONS}
                              value={filters.suspension_type}
                              onChange={(value) => setFilter('suspension_type', value)}
                              placeholder="Shop All Suspension..."
                            />
                          </div>

                          {/* Lift Height - only show for lift kits and leveling kits */}
                          {(filters.suspension_type === '' || filters.suspension_type === 'lift_kits' || filters.suspension_type === 'leveling') && (
                            <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                              <FilterCombobox
                                label="Lift Height"
                                options={availableFilters.liftHeights}
                                value={fitment.liftHeight}
                                onChange={(value) => setFitment('liftHeight', value)}
                                placeholder="Select lift height..."
                              />
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Wheel Filters */}
                      {isCategorySelected(filters.category, 'wheels') && (
                        <motion.div
                          key="wheel-filters"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          {/* Shop All Wheels Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setFilter('wheel_diameter', '')
                              setFilter('wheel_width', '')
                              setFilter('wheel_offset', '')
                              setFilter('wheel_brand', '')
                              setFilter('wheel_model', '')
                              setFilter('wheel_material', '')
                              setFilter('wheel_finish', '')
                              setFilter('wheel_weight', '')
                              setFilter('bolt_pattern', '')
                              setFilter('search', '')
                            }}
                            className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all border bg-lime-500/20 text-lime-400 border-lime-500/30 hover:bg-lime-500/30"
                          >
                            Shop All Wheels
                          </button>

                          {/* Wheel Search */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                              Search Wheels
                            </label>
                            <input
                              type="text"
                              value={filters.search || ''}
                              onChange={(e) => setFilter('search', e.target.value)}
                              placeholder="Search by keyword, SKU..."
                              className="w-full px-3 py-2 rounded-lg bg-night-800/50 border border-night-700/50 text-white text-sm placeholder:text-slate-500 focus:border-lime-500 focus:ring-1 focus:ring-lime-500/20 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Diameter */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <FilterCombobox
                              label="Diameter"
                              options={uniqueOptions.wheel_diameters?.map(d => ({ value: d.replace('"', ''), label: d })) || WHEEL_DIAMETER_OPTIONS}
                              value={filters.wheel_diameter}
                              onChange={(value) => setFilter('wheel_diameter', value)}
                              placeholder="Select diameter..."
                            />
                          </div>

                          {/* Width */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <FilterCombobox
                              label="Width"
                              options={uniqueOptions.wheel_widths?.map(w => ({ value: w, label: w + '"' })) || []}
                              value={filters.wheel_width}
                              onChange={(value) => setFilter('wheel_width', value)}
                              placeholder="Select width..."
                            />
                          </div>

                          {/* Offset */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <FilterCombobox
                              label="Offset"
                              options={uniqueOptions.wheel_offsets?.map(o => ({ value: o, label: o + 'mm' })) || []}
                              value={filters.wheel_offset}
                              onChange={(value) => setFilter('wheel_offset', value)}
                              placeholder="Select offset..."
                            />
                          </div>

                          {/* Bolt Pattern */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <FilterCombobox
                              label="Bolt Pattern"
                              options={uniqueOptions.bolt_patterns?.map(bp => ({ value: bp, label: bp })) || []}
                              value={filters.bolt_pattern}
                              onChange={(value) => setFilter('bolt_pattern', value)}
                              placeholder="Select bolt pattern..."
                            />
                          </div>

                          {/* Brand & Model */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30 space-y-3">
                            <FilterCombobox
                              label="Brand"
                              options={uniqueOptions.wheel_brands?.map(b => ({ value: b, label: b })) || []}
                              value={filters.wheel_brand}
                              onChange={(value) => setFilter('wheel_brand', value)}
                              placeholder="Select brand..."
                            />
                            <FilterCombobox
                              label="Model"
                              options={uniqueOptions.wheel_models?.map(m => ({ value: m, label: m })) || []}
                              value={filters.wheel_model}
                              onChange={(value) => setFilter('wheel_model', value)}
                              placeholder="Select model..."
                            />
                          </div>

                          {/* Price Range */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                              Price Range
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                placeholder="Min $"
                                value={filters.price_min || ''}
                                onChange={(e) => setFilter('price_min', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-night-800/50 border border-night-700/50 text-white text-sm placeholder:text-slate-500 focus:border-lime-500 focus:ring-1 focus:ring-lime-500/20 focus:outline-none transition-all"
                              />
                              <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                placeholder="Max $"
                                value={filters.price_max || ''}
                                onChange={(e) => setFilter('price_max', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-night-800/50 border border-night-700/50 text-white text-sm placeholder:text-slate-500 focus:border-lime-500 focus:ring-1 focus:ring-lime-500/20 focus:outline-none transition-all"
                              />
                            </div>
                          </div>

                          {/* Material, Finish, Weight */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30 space-y-3">
                            <FilterCombobox
                              label="Material"
                              options={uniqueOptions.wheel_materials?.map(m => ({ value: m, label: m })) || []}
                              value={filters.wheel_material}
                              onChange={(value) => setFilter('wheel_material', value)}
                              placeholder="Select material..."
                            />
                            <FilterCombobox
                              label="Finish"
                              options={uniqueOptions.wheel_finishes?.map(f => ({ value: f, label: f })) || []}
                              value={filters.wheel_finish}
                              onChange={(value) => setFilter('wheel_finish', value)}
                              placeholder="Select finish..."
                            />
                            <FilterCombobox
                              label="Weight"
                              options={uniqueOptions.wheel_weights?.map(w => ({ value: w, label: w + ' lbs' })) || []}
                              value={filters.wheel_weight}
                              onChange={(value) => setFilter('wheel_weight', value)}
                              placeholder="Select weight..."
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Tire Filters */}
                      {isCategorySelected(filters.category, 'tires') && (
                        <motion.div
                          key="tire-filters"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          {/* Tire Type Dropdown */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <FilterCombobox
                              label="Tire Type"
                              options={TIRE_TYPE_OPTIONS}
                              value={filters.tire_type}
                              onChange={(value) => setFilter('tire_type', value)}
                              placeholder="Shop All Tires..."
                            />
                          </div>

                          {/* Tire Size Dropdown */}
                          <div className="p-3 rounded-xl bg-night-800/20 border border-night-700/30">
                            <FilterCombobox
                              label="Tire Size"
                              options={availableFilters.tireSizes}
                              value={fitment.tireSize}
                              onChange={(value) => setFitment('tireSize', value)}
                              placeholder="Select tire size..."
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Brand Selector - Always visible when any category selected */}
                    {Array.isArray(filters.category) && filters.category.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-night-800/20 border border-night-700/30"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-night-700/50 text-slate-400">
                              <Building2 className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                              Brand
                            </span>
                          </div>
                          {filters.brand && (
                            <button
                              type="button"
                              onClick={() => setFilter('brand', '')}
                              className="text-xs text-slate-500 hover:text-lime-400 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <FilterCombobox
                          options={uniqueOptions.brands?.map(b => ({ value: b, label: b })) || []}
                          value={filters.brand}
                          onChange={(value) => setFilter('brand', value)}
                          placeholder="Search brands..."
                        />
                      </motion.div>
                    )}

                    {/* Helper text when no category */}
                    {(!filters.category || (Array.isArray(filters.category) && filters.category.length === 0)) && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-slate-500 text-center py-2"
                      >
                        Select categories above to see relevant specs
                      </motion.p>
                    )}
                  </div>
              </div>
            )}
          </div>

          {/* Fitment Section */}
          <div className="rounded-xl bg-night-900/50 border border-night-800/50">
            <button
              type="button"
              onClick={() => toggleSection('fitment')}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-night-800/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500/10 text-lime-500">
                  <Gauge className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Fitment</span>
                  <p className="text-xs text-slate-500">Lift, Tire Size, Preference</p>
                </div>
              </div>
              <ChevronDown
                className={clsx(
                  'h-4 w-4 text-slate-500 transition-transform duration-200',
                  expandedSections.includes('fitment') && 'rotate-180'
                )}
              />
            </button>

            {expandedSections.includes('fitment') && (
              <div className="px-4 pb-4 space-y-3">
                <FilterCombobox
                  label="Lift Height"
                  options={availableFilters.liftHeights}
                  value={fitment.liftHeight}
                  onChange={(value) => setFitment('liftHeight', value)}
                  placeholder="Any lift height"
                />
                <FilterCombobox
                  label="Tire Size"
                  options={availableFilters.tireSizes}
                  value={fitment.tireSize}
                  onChange={(value) => setFitment('tireSize', value)}
                  placeholder="Any tire size"
                />
                <FilterCombobox
                  label="Fitment Preference"
                  options={availableFilters.preferences}
                  value={fitment.preference}
                  onChange={(value) => setFitment('preference', value)}
                  isLoading={isLoadingFilters}
                  placeholder="Select preference"
                />
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="rounded-xl bg-night-900/50 border border-night-800/50">
            <button
              type="button"
              onClick={() => toggleSection('price')}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-night-800/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500/10 text-lime-500">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Price</span>
                  <p className="text-xs text-slate-500">Set your budget</p>
                </div>
              </div>
              <ChevronDown
                className={clsx(
                  'h-4 w-4 text-slate-500 transition-transform duration-200',
                  expandedSections.includes('price') && 'rotate-180'
                )}
              />
            </button>

            {expandedSections.includes('price') && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Min Price</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="$0"
                      value={filters.price_min || ''}
                      onChange={(e) => setFilter('price_min', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-night-800/50 border border-night-700/50 text-white text-sm placeholder:text-slate-500 focus:border-lime-500 focus:ring-1 focus:ring-lime-500/20 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Max Price</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="$5000"
                      value={filters.price_max || ''}
                      onChange={(e) => setFilter('price_max', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-night-800/50 border border-night-700/50 text-white text-sm placeholder:text-slate-500 focus:border-lime-500 focus:ring-1 focus:ring-lime-500/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="rounded-xl bg-night-900/50 border border-night-800/50">
            <button
              type="button"
              onClick={() => toggleSection('tags')}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-night-800/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500/10 text-coral-500">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Tags</span>
                  <p className="text-xs text-slate-500">Sale, New, Featured</p>
                </div>
              </div>
              <ChevronDown
                className={clsx(
                  'h-4 w-4 text-slate-500 transition-transform duration-200',
                  expandedSections.includes('tags') && 'rotate-180'
                )}
              />
            </button>

            {expandedSections.includes('tags') && (
              <div className="px-4 pb-4">
                <FilterCombobox
                  label="Product Tags"
                  options={productTags}
                  value={filters.tags}
                  onChange={(values) => setFilter('tags', values)}
                  isMulti
                  isLoading={loading.tags}
                  placeholder="Select tags..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="px-4 py-3 rounded-xl bg-night-800/30 border border-night-800/50">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-medium">Pro tip:</span> Select your vehicle first for the most accurate fitment recommendations.
          </p>
        </div>
      </div>
    </aside>
  )
}
