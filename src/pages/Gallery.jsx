import { useEffect, useState, useMemo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { AppContext } from '../App'
import VehiclePhotoUpload from '../components/VehiclePhotoUpload'
import {
  Search,
  X,
  Image,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Car,
  Camera,
  User,
  Loader2,
  ImageIcon,
} from 'lucide-react'
import {
  fetchGalleryItems,
  fetchGalleryWheelSizes,
  fetchGalleryTireSizes,
  fetchGalleryLiftHeights,
} from '../services/galleryService'
import { fetchYears, fetchMakes, fetchModels } from '../services/wheelsizeService'
import VehicleSelect from '../components/ui/VehicleSelect'

// Popular makes to show at the top
const POPULAR_MAKES = ['Ford', 'RAM', 'Chevrolet', 'Toyota', 'GMC', 'Jeep', 'Nissan', 'Honda']

// Sort function to put popular makes first
const sortMakesWithPopularFirst = (makes) => {
  return [...makes].sort((a, b) => {
    const aVal = typeof a === 'object' ? a.value || a.name || a : a
    const bVal = typeof b === 'object' ? b.value || b.name || b : b
    const aPopular = POPULAR_MAKES.findIndex((m) => m.toLowerCase() === String(aVal).toLowerCase())
    const bPopular = POPULAR_MAKES.findIndex((m) => m.toLowerCase() === String(bVal).toLowerCase())
    const aIsPopular = aPopular !== -1
    const bIsPopular = bPopular !== -1
    if (aIsPopular && !bIsPopular) return -1
    if (!aIsPopular && bIsPopular) return 1
    if (aIsPopular && bIsPopular) return aPopular - bPopular
    return String(aVal).localeCompare(String(bVal))
  })
}

function FilterChip({ label, onRemove }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-medium"
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-lime-500/20 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.span>
  )
}

function GalleryFilters({
  filters,
  setFilters,
  years,
  makes,
  models,
  wheelSizes,
  tireSizes,
  liftHeights,
  loading,
  onYearChange,
  onMakeChange,
  onModelChange,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeFilterCount = [
    filters.vehicle_year,
    filters.vehicle_make,
    filters.vehicle_model,
    filters.wheel_size,
    filters.tire_size,
    filters.lift_height,
    filters.featured_only,
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setFilters({
      vehicle_year: '',
      vehicle_make: '',
      vehicle_model: '',
      wheel_size: '',
      tire_size: '',
      lift_height: '',
      featured_only: false,
      search: '',
    })
  }

  const FilterContent = () => (
    <div className="space-y-5">
      {/* Vehicle Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Car className="h-4 w-4 text-lime-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <VehicleSelect
            label="Year"
            value={filters.vehicle_year}
            options={years}
            onChange={onYearChange}
            placeholder="All Years"
            loading={loading.years}
          />

          <VehicleSelect
            label="Make"
            value={filters.vehicle_make}
            options={makes}
            onChange={onMakeChange}
            placeholder="All Makes"
            disabled={!filters.vehicle_year}
            loading={loading.makes}
          />

          <VehicleSelect
            label="Model"
            value={filters.vehicle_model}
            options={models}
            onChange={onModelChange}
            placeholder="All Models"
            disabled={!filters.vehicle_make}
            loading={loading.models}
          />
        </div>
      </div>

      {/* Setup Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-4 w-4 text-lime-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Setup</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <VehicleSelect
            label="Wheel Size"
            value={filters.wheel_size}
            options={wheelSizes}
            onChange={(val) => setFilters((prev) => ({ ...prev, wheel_size: val }))}
            placeholder="All Wheels"
            loading={loading.wheelSizes}
          />

          <VehicleSelect
            label="Tire Size"
            value={filters.tire_size}
            options={tireSizes}
            onChange={(val) => setFilters((prev) => ({ ...prev, tire_size: val }))}
            placeholder="All Tires"
            loading={loading.tireSizes}
          />

          <VehicleSelect
            label="Lift Height"
            value={filters.lift_height}
            options={liftHeights}
            onChange={(val) => setFilters((prev) => ({ ...prev, lift_height: val }))}
            placeholder="All Lifts"
            loading={loading.liftHeights}
          />

          {/* Featured Toggle */}
          <div className="flex flex-col">
            <span className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
              Featured
            </span>
            <motion.button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, featured_only: !prev.featured_only }))}
              whileTap={{ scale: 0.95 }}
              className={`
                h-12 flex items-center justify-center gap-2 rounded-xl
                text-sm font-medium transition-all duration-200
                ${filters.featured_only
                  ? 'bg-lime-500 text-night-950 shadow-lg shadow-lime-500/30'
                  : 'bg-night-800 border border-night-700 text-slate-400 hover:border-night-600 hover:text-white'
                }
              `}
            >
              <Star className={`h-4 w-4 ${filters.featured_only ? 'fill-current' : ''}`} />
              <span>{filters.featured_only ? 'Featured' : 'All Builds'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )

  const hasActiveFilters = filters.vehicle_year || filters.vehicle_make || filters.vehicle_model ||
    filters.wheel_size || filters.tire_size || filters.lift_height

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="p-5 rounded-2xl bg-night-900/90 backdrop-blur-xl border border-night-800 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-lime-400" />
              <span className="text-sm font-semibold text-white">Filter Builds</span>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-lime-500 text-night-950 text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-night-800 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear All
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <FilterContent />

          {/* Active Filter Chips */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-night-800/50"
              >
                {filters.vehicle_year && (
                  <FilterChip
                    label={`${filters.vehicle_year}`}
                    onRemove={() => onYearChange('')}
                  />
                )}
                {filters.vehicle_make && (
                  <FilterChip
                    label={filters.vehicle_make}
                    onRemove={() => onMakeChange('')}
                  />
                )}
                {filters.vehicle_model && (
                  <FilterChip
                    label={filters.vehicle_model}
                    onRemove={() => onModelChange('')}
                  />
                )}
                {filters.wheel_size && (
                  <FilterChip
                    label={`${filters.wheel_size} wheels`}
                    onRemove={() => setFilters((prev) => ({ ...prev, wheel_size: '' }))}
                  />
                )}
                {filters.tire_size && (
                  <FilterChip
                    label={`${filters.tire_size} tires`}
                    onRemove={() => setFilters((prev) => ({ ...prev, tire_size: '' }))}
                  />
                )}
                {filters.lift_height && (
                  <FilterChip
                    label={`${filters.lift_height} lift`}
                    onRemove={() => setFilters((prev) => ({ ...prev, lift_height: '' }))}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-night-900/80 border border-night-700/50 text-white text-sm font-medium transition-all hover:border-lime-500/30"
        >
          <Filter className="h-4 w-4 text-lime-400" />
          <span>Filter Builds</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-lime-500 text-night-950 text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-night-900 border-t border-night-700/50 p-6 pb-10 md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-lime-400" />
                  <span className="text-lg font-bold text-white">Filter Builds</span>
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-lime-500 text-night-950 text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg bg-night-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <FilterContent />
              </div>

              <div className="flex gap-3 mt-6 sticky bottom-0 pt-4 bg-night-900">
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters()
                    setMobileOpen(false)
                  }}
                  className="flex-1 py-3 rounded-xl bg-night-800 text-slate-300 font-medium transition-all hover:bg-night-700"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-lime-500 text-night-950 font-bold transition-all hover:bg-lime-400"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function FeaturedGalleryCard({ item, onClick }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(item)}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-night-900/50 border border-night-800/50 transition-all hover:border-lime-500/30 hover:shadow-xl hover:shadow-lime-500/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={`${item.vehicle_year} ${item.vehicle_make} ${item.vehicle_model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-night-800">
            <Image className="h-12 w-12 text-night-600" />
          </div>
        )}

        {item.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-500/90 text-night-950 text-xs font-semibold backdrop-blur-sm">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        )}

        {item.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm">
            <Image className="h-3 w-3" />
            {item.images.length}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-lime-400 transition-colors">
            {item.vehicle_year} {item.vehicle_make} {item.vehicle_model}
            {item.vehicle_trim ? ` ${item.vehicle_trim}` : ''}
          </h3>
          {item.title && (
            <p className="text-sm font-medium text-lime-400 mt-0.5">{item.title}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {item.lift_height && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-medium">
              {item.lift_height} lift
            </span>
          )}
          {item.wheel_size && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-night-800 text-slate-300 text-xs font-medium">
              {item.wheel_size} wheels
            </span>
          )}
          {item.tire_size && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-night-800 text-slate-300 text-xs font-medium">
              {item.tire_size} tires
            </span>
          )}
        </div>

        {item.customer_name && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Build by {item.customer_name}</span>
            {item.customer_location && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.customer_location}
                </span>
              </>
            )}
          </div>
        )}

        {item.description && (
          <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
        )}
      </div>
    </motion.article>
  )
}

function ImageLightbox({ item, onClose, onPrev, onNext, hasPrev, hasNext, isCommunity = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') {
        if (!isCommunity && currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1)
        } else if (hasPrev) {
          onPrev()
        }
      }
      if (e.key === 'ArrowRight') {
        if (!isCommunity && currentIndex < (item.images?.length || 1) - 1) {
          setCurrentIndex((prev) => prev + 1)
        } else if (hasNext) {
          onNext()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [item, currentIndex, onClose, onPrev, onNext, hasPrev, hasNext, isCommunity])

  useEffect(() => {
    setCurrentIndex(0)
  }, [item])

  if (!item) return null

  const images = isCommunity ? [item.image_url] : (item.images || [])
  const currentImage = images[currentIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      <div
        className="relative max-w-6xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-video flex items-center justify-center">
          {currentImage ? (
            <img
              src={currentImage}
              alt={isCommunity ? (item.caption || 'Community build') : `${item.vehicle_year} ${item.vehicle_make} ${item.vehicle_model}`}
              className="max-h-[70vh] max-w-full object-contain rounded-lg"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-night-900 rounded-lg">
              <Image className="h-16 w-16 text-night-700" />
            </div>
          )}

          {!isCommunity && images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1))}
                disabled={currentIndex === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {!isCommunity && images.length > 1 && (
          <div className="flex items-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-lime-500'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-center max-w-2xl">
          {isCommunity ? (
            <>
              {item.vehicle_year && (
                <h2 className="text-2xl font-bold text-white">
                  {[item.vehicle_year, item.vehicle_make, item.vehicle_model].filter(Boolean).join(' ')}
                </h2>
              )}
              {item.caption && (
                <p className="text-slate-300 mt-2">{item.caption}</p>
              )}
              <p className="text-xs text-slate-500 mt-3">
                Shared {new Date(item.created_at).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">
                {item.vehicle_year} {item.vehicle_make} {item.vehicle_model}
                {item.vehicle_trim ? ` ${item.vehicle_trim}` : ''}
              </h2>
              {item.title && (
                <p className="text-lime-400 font-medium mt-1">{item.title}</p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                {item.lift_height && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-lime-500/10 border border-lime-500/20 text-lime-400 text-sm font-medium">
                    {item.lift_height} lift
                  </span>
                )}
                {item.wheel_size && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-night-800 text-slate-300 text-sm font-medium">
                    {item.wheel_size} wheels
                  </span>
                )}
                {item.tire_size && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-night-800 text-slate-300 text-sm font-medium">
                    {item.tire_size} tires
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-slate-400 mt-4">{item.description}</p>
              )}

              {item.customer_name && (
                <p className="text-sm text-slate-500 mt-3">
                  Build by {item.customer_name}
                  {item.customer_location && ` • ${item.customer_location}`}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-night-800 text-white text-sm font-medium transition-all hover:bg-night-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            disabled={!hasNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-night-800 text-white text-sm font-medium transition-all hover:bg-night-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Community Gallery Section
function CommunitySection({ user }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_vehicle_photos')
        .select('*')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (err) {
      console.error('Error fetching gallery:', err)
    } finally {
      setLoading(false)
    }
  }

  const navigatePhoto = (direction) => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id)
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = photos.length - 1
    if (newIndex >= photos.length) newIndex = 0
    setSelectedPhoto(photos[newIndex])
  }

  const selectedIndex = selectedPhoto ? photos.findIndex((p) => p.id === selectedPhoto.id) : -1

  return (
    <div className="space-y-8">
      {/* Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-lime-500/10 to-lime-600/5 border border-lime-500/20">
        <div>
          <h3 className="text-lg font-semibold text-white">Share Your Build</h3>
          <p className="text-sm text-slate-400 mt-1">
            Upload photos of your vehicle and get featured in the gallery!
          </p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 transition-colors"
          >
            <Camera className="h-5 w-5" />
            {showUpload ? 'Hide Upload' : 'Upload Photo'}
          </button>
        ) : (
          <Link
            to="/account"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-night-800 border border-night-700 text-white font-medium hover:bg-night-700 transition-colors"
          >
            <User className="h-5 w-5" />
            Sign in to Upload
          </Link>
        )}
      </div>

      {/* Upload Section */}
      <AnimatePresence>
        {showUpload && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-xl mx-auto"
          >
            <VehiclePhotoUpload
              onUploadComplete={() => {
                setShowUpload(false)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Community Builds */}
      {photos.filter((p) => p.featured).length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Featured Community Builds</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos
              .filter((p) => p.featured)
              .slice(0, 3)
              .map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-night-900 border-2 border-amber-500/30 hover:border-amber-500/50 transition-all"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={photo.image_url}
                      alt={photo.caption || 'Featured build'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-lg bg-amber-500 text-night-950 text-xs font-bold">
                        FEATURED
                      </span>
                    </div>
                    {photo.vehicle_year && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 text-white">
                          <Car className="h-4 w-4" />
                          <span className="font-medium">
                            {[photo.vehicle_year, photo.vehicle_make, photo.vehicle_model]
                              .filter(Boolean)
                              .join(' ')}
                          </span>
                        </div>
                        {photo.caption && (
                          <p className="text-sm text-slate-300 mt-1 line-clamp-2">{photo.caption}</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* All Community Photos */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
            <ImageIcon className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Community Builds</h3>
          <span className="text-sm text-slate-400">({photos.length} photos)</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-night-900/40 border border-night-800/50">
            <Camera className="h-16 w-16 text-night-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No photos yet</h3>
            <p className="text-slate-400 mb-6">Be the first to share your build with the community!</p>
            {user ? (
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 transition-colors"
              >
                <Camera className="h-5 w-5" />
                Upload Your Build
              </button>
            ) : (
              <Link
                to="/account"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-night-800 border border-night-700 text-white font-medium hover:bg-night-700 transition-colors"
              >
                Sign in to Upload
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos
              .filter((p) => !p.featured)
              .map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-night-900 border border-night-800/50 hover:border-lime-500/30 transition-all"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={photo.image_url}
                      alt={photo.caption || 'Community build'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {photo.vehicle_year && (
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 text-xs text-white bg-night-950/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <Car className="h-3 w-3" />
                          {[photo.vehicle_year, photo.vehicle_make, photo.vehicle_model]
                            .filter(Boolean)
                            .join(' ')}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Community Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <ImageLightbox
            item={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            onPrev={() => navigatePhoto(-1)}
            onNext={() => navigatePhoto(1)}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex < photos.length - 1}
            isCommunity
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Gallery() {
  const { user } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('featured')

  // Featured builds state
  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    wheel_size: '',
    tire_size: '',
    lift_height: '',
    featured_only: false,
    search: '',
  })
  const [years, setYears] = useState([])
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [wheelSizes, setWheelSizes] = useState([])
  const [tireSizes, setTireSizes] = useState([])
  const [liftHeights, setLiftHeights] = useState([])
  const [loading, setLoading] = useState({
    years: true,
    makes: false,
    models: false,
    wheelSizes: true,
    tireSizes: true,
    liftHeights: true,
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  // Load years on mount
  useEffect(() => {
    const loadYears = async () => {
      setLoading((prev) => ({ ...prev, years: true }))
      try {
        const data = await fetchYears()
        const sortedYears = data
          .map((y) => (typeof y === 'object' ? y.slug || y.name : y))
          .sort((a, b) => Number(b) - Number(a))
          .slice(0, 20)
        setYears(sortedYears)
      } catch (err) {
        console.error('Failed to load years:', err)
      } finally {
        setLoading((prev) => ({ ...prev, years: false }))
      }
    }
    loadYears()
  }, [])

  // Load setup filter options on mount
  useEffect(() => {
    const loadSetupOptions = async () => {
      setLoading((prev) => ({ ...prev, wheelSizes: true }))
      try {
        const data = await fetchGalleryWheelSizes()
        setWheelSizes(data)
      } catch (err) {
        console.error('Failed to load wheel sizes:', err)
      } finally {
        setLoading((prev) => ({ ...prev, wheelSizes: false }))
      }

      setLoading((prev) => ({ ...prev, tireSizes: true }))
      try {
        const data = await fetchGalleryTireSizes()
        setTireSizes(data)
      } catch (err) {
        console.error('Failed to load tire sizes:', err)
      } finally {
        setLoading((prev) => ({ ...prev, tireSizes: false }))
      }

      setLoading((prev) => ({ ...prev, liftHeights: true }))
      try {
        const data = await fetchGalleryLiftHeights()
        setLiftHeights(data)
      } catch (err) {
        console.error('Failed to load lift heights:', err)
      } finally {
        setLoading((prev) => ({ ...prev, liftHeights: false }))
      }
    }
    loadSetupOptions()
  }, [])

  // Load makes when year changes
  useEffect(() => {
    if (!filters.vehicle_year) {
      setMakes([])
      return
    }

    const loadMakes = async () => {
      setLoading((prev) => ({ ...prev, makes: true }))
      try {
        const data = await fetchMakes(filters.vehicle_year)
        const makesList = data.map((m) => (typeof m === 'object' ? m.slug || m.name : m))
        setMakes(sortMakesWithPopularFirst(makesList))
      } catch (err) {
        console.error('Failed to load makes:', err)
      } finally {
        setLoading((prev) => ({ ...prev, makes: false }))
      }
    }
    loadMakes()
  }, [filters.vehicle_year])

  // Load models when make changes
  useEffect(() => {
    if (!filters.vehicle_year || !filters.vehicle_make) {
      setModels([])
      return
    }

    const loadModels = async () => {
      setLoading((prev) => ({ ...prev, models: true }))
      try {
        const data = await fetchModels(filters.vehicle_year, filters.vehicle_make)
        const modelsList = data.map((m) => (typeof m === 'object' ? m.slug || m.name : m))
        setModels(modelsList)
      } catch (err) {
        console.error('Failed to load models:', err)
      } finally {
        setLoading((prev) => ({ ...prev, models: false }))
      }
    }
    loadModels()
  }, [filters.vehicle_year, filters.vehicle_make])

  const handleYearChange = (year) => {
    setFilters((prev) => ({ ...prev, vehicle_year: year, vehicle_make: '', vehicle_model: '' }))
  }

  const handleMakeChange = (make) => {
    setFilters((prev) => ({ ...prev, vehicle_make: make, vehicle_model: '' }))
  }

  const handleModelChange = (model) => {
    setFilters((prev) => ({ ...prev, vehicle_model: model }))
  }

  // Load gallery items when filters change
  useEffect(() => {
    if (activeTab !== 'featured') return

    const loadItems = async () => {
      try {
        setItemsLoading(true)
        setError(null)
        const data = await fetchGalleryItems(filters)
        setItems(data)
      } catch (err) {
        console.error('Failed to load gallery:', err)
        setError('Unable to load gallery. Please try again.')
      } finally {
        setItemsLoading(false)
      }
    }
    loadItems()
  }, [filters, activeTab])

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }))
    }, 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  const selectedIndex = useMemo(() => {
    if (!selectedItem) return -1
    return items.findIndex((item) => item.id === selectedItem.id)
  }, [selectedItem, items])

  const handlePrevItem = () => {
    if (selectedIndex > 0) {
      setSelectedItem(items[selectedIndex - 1])
    }
  }

  const handleNextItem = () => {
    if (selectedIndex < items.length - 1) {
      setSelectedItem(items[selectedIndex + 1])
    }
  }

  const activeFilterCount = [
    filters.vehicle_year,
    filters.vehicle_make,
    filters.vehicle_model,
    filters.wheel_size,
    filters.tire_size,
    filters.lift_height,
    filters.featured_only,
    filters.search,
  ].filter(Boolean).length

  return (
    <main className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 text-night-950 shadow-lg shadow-lime-500/30"
              >
                <Image className="h-8 w-8" />
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Build Gallery</h1>
            <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
              Get inspired by builds from ModLift and the community
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-night-900/80 border border-night-800/50">
              <button
                type="button"
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'featured'
                    ? 'bg-lime-500 text-night-950 shadow-lg shadow-lime-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star className={`h-4 w-4 ${activeTab === 'featured' ? 'fill-current' : ''}`} />
                  Featured Builds
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('community')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'community'
                    ? 'bg-lime-500 text-night-950 shadow-lg shadow-lime-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Community
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'featured' ? (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Search */}
                <div className="flex justify-center">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search builds by make, model, lift..."
                      className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-night-900/80 backdrop-blur-sm border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-night-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters */}
                <GalleryFilters
                  filters={filters}
                  setFilters={setFilters}
                  years={years}
                  makes={makes}
                  models={models}
                  wheelSizes={wheelSizes}
                  tireSizes={tireSizes}
                  liftHeights={liftHeights}
                  loading={loading}
                  onYearChange={handleYearChange}
                  onMakeChange={handleMakeChange}
                  onModelChange={handleModelChange}
                />

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-coral-500/10 border border-coral-500/30 text-coral-400"
                  >
                    <X className="h-5 w-5" />
                    <p>{error}</p>
                  </motion.div>
                )}

                {/* Results Header */}
                {!itemsLoading && !error && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-white">{items.length}</span>{' '}
                      {items.length === 1 ? 'build' : 'builds'} found
                      {activeFilterCount > 0 && (
                        <span className="ml-2 text-lime-400">
                          ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Loading */}
                {itemsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-lime-500/30 border-t-lime-500" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-lime-400" />
                      </div>
                      <p className="text-sm text-slate-400">Loading amazing builds...</p>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex h-20 w-20 items-center justify-center rounded-3xl bg-night-800 border border-night-700/50 mb-6"
                    >
                      <Image className="h-10 w-10 text-night-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">No builds found</h3>
                    <p className="text-slate-400 mt-2 max-w-md">
                      {activeFilterCount > 0
                        ? 'Try adjusting your filters to discover more builds.'
                        : 'Check back soon for more build showcases!'}
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setFilters({
                          vehicle_year: '',
                          vehicle_make: '',
                          vehicle_model: '',
                          wheel_size: '',
                          tire_size: '',
                          lift_height: '',
                          featured_only: false,
                          search: '',
                        })}
                        className="mt-6 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold transition-all hover:bg-lime-400"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <FeaturedGalleryCard
                          key={item.id}
                          item={item}
                          onClick={setSelectedItem}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="community"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CommunitySection user={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Featured Lightbox */}
      <AnimatePresence>
        {selectedItem && activeTab === 'featured' && (
          <ImageLightbox
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onPrev={handlePrevItem}
            onNext={handleNextItem}
            hasPrev={selectedIndex > 0}
            hasNext={selectedIndex < items.length - 1}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
