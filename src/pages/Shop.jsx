import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VehicleContextProvider, useVehicle } from '@/components/filters/VehicleContext.jsx'
import FilterSidebar from '@/components/filters/FilterSidebar.jsx'
import { ProductFiltersProvider, useProductFilters } from '@/hooks/useProductFilters.jsx'
import ProductGrid from '@/components/products/ProductGrid.jsx'
import { useDebouncedValue } from '@/hooks/useDebouncedValue.js'
import {
  Search,
  X,
  SlidersHorizontal,
  Package,
  Grid3X3,
  LayoutGrid,
  Car,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All Products', value: '' },
  { id: 'suspension', label: 'Suspension', value: 'suspension' },
  { id: 'wheels', label: 'Wheels', value: 'wheels' },
  { id: 'tires', label: 'Tires', value: 'tires' },
  { id: 'accessories', label: 'Accessories', value: 'accessories' },
]

function VehicleBanner({ onOpenFilters }) {
  const { selection, clearSelection } = useVehicle()
  const { setFilter } = useProductFilters()
  const hasVehicle = selection?.year && selection?.make && selection?.model

  const handleClearVehicle = (e) => {
    e.stopPropagation()
    // Clear from VehicleContext
    clearSelection()
    // Clear vehicle filters from ProductFilters
    setFilter('vehicle_year', '')
    setFilter('vehicle_make', '')
    setFilter('vehicle_model', '')
    setFilter('vehicle_trim', '')
    // Clear localStorage to prevent persistence
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('modlift_vehicle')
      // Also clear the filters localStorage to fully reset
      const storedFilters = window.localStorage.getItem('modlift-filters')
      if (storedFilters) {
        try {
          const parsed = JSON.parse(storedFilters)
          delete parsed.vehicle_year
          delete parsed.vehicle_make
          delete parsed.vehicle_model
          delete parsed.vehicle_trim
          window.localStorage.setItem('modlift-filters', JSON.stringify(parsed))
        } catch (e) {
          window.localStorage.removeItem('modlift-filters')
        }
      }
    }
  }

  if (hasVehicle) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-lime-500/10 border border-lime-500/30"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/20">
          <Car className="h-5 w-5 text-lime-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {selection.year} {selection.make} {selection.model} {selection.trim}
          </p>
          <p className="text-xs text-lime-400">Showing compatible parts for your vehicle</p>
        </div>
        <button
          type="button"
          onClick={handleClearVehicle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-night-800/80 border border-night-700 text-slate-400 hover:text-white hover:border-night-600 transition-all text-xs font-medium"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      </motion.div>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onOpenFilters}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-lime-500/10 border border-lime-500/30 hover:bg-lime-500/15 hover:border-lime-500/40 transition-all cursor-pointer text-left"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/20">
        <Car className="h-5 w-5 text-lime-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">Select Your Vehicle</p>
        <p className="text-xs text-lime-400">Get personalized fitment recommendations</p>
      </div>
      <ChevronRight className="h-5 w-5 text-lime-400 flex-shrink-0" />
    </motion.button>
  )
}

function ShopHeader({ onOpenFilters }) {
  const { filters, setFilter, selectedBadges } = useProductFilters()
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const [viewMode, setViewMode] = useState('grid')
  const debouncedSearch = useDebouncedValue(searchInput, 350)

  const selectedCategories = Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : []

  useEffect(() => {
    setSearchInput(filters.search ?? '')
  }, [filters.search])

  useEffect(() => {
    if (debouncedSearch === undefined || debouncedSearch === null) return
    setFilter('search', debouncedSearch)
  }, [debouncedSearch, setFilter])

  const handleCategoryChange = (categoryValue) => {
    if (!categoryValue) {
      // "All Products" - clear categories
      setFilter('category', [])
    } else {
      // Toggle individual category
      const newCategories = selectedCategories.includes(categoryValue)
        ? selectedCategories.filter((c) => c !== categoryValue)
        : [...selectedCategories, categoryValue]
      setFilter('category', newCategories)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 text-lime-500">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Shop</h1>
              <p className="text-slate-400">
                Find the perfect lift kits, wheels, and tires for your build
                {selectedBadges.length > 0 && (
                  <span className="ml-2 text-lime-400">
                    • {selectedBadges.length} filter{selectedBadges.length !== 1 ? 's' : ''} active
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {/* Search Input */}
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by SKU, size, or brand..."
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-night-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white font-medium transition-all hover:bg-night-800 hover:border-night-600"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {selectedBadges.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-500 text-night-950 text-xs font-bold">
                {selectedBadges.length}
              </span>
            )}
          </button>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-night-800/50 border border-night-700/50">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-lime-500 text-night-950'
                  : 'text-slate-400 hover:text-white hover:bg-night-700/50'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('large')}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === 'large'
                  ? 'bg-lime-500 text-night-950'
                  : 'text-slate-400 hover:text-white hover:bg-night-700/50'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Vehicle Banner */}
      <VehicleBanner onOpenFilters={onOpenFilters} />

      {/* Category Tags - Multi-select */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {CATEGORIES.map((category) => {
          const isAllProducts = category.value === ''
          const isActive = isAllProducts
            ? selectedCategories.length === 0
            : selectedCategories.includes(category.value)
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                  : 'bg-night-800/50 text-slate-400 border border-night-700/50 hover:bg-night-800 hover:text-white hover:border-night-600'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}

function MobileFilterDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-night-950 border-r border-night-800 overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-night-950/95 backdrop-blur-sm border-b border-night-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-500">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">Filters</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-800/50 border border-night-700/50 text-slate-400 hover:text-white hover:border-night-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ShopContent() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <>
      <ShopHeader onOpenFilters={() => setShowMobileFilters(true)} />

      <div className="flex flex-col gap-8 lg:flex-row mt-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-[320px] lg:shrink-0">
          <FilterSidebar />
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
        />

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid />
        </div>
      </div>
    </>
  )
}

export default function Shop() {
  return (
    <VehicleContextProvider>
      <ProductFiltersProvider>
        <main className="min-h-screen bg-night-950 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ShopContent />
          </div>
        </main>
      </ProductFiltersProvider>
    </VehicleContextProvider>
  )
}
