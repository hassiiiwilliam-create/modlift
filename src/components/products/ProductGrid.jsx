import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard.jsx'
import SkeletonGrid from '@/components/SkeletonGrid.jsx'
import { useProductFilters } from '@/hooks/useProductFilters.jsx'
import { AlertCircle, Car, Loader2, PackageSearch, RefreshCw } from 'lucide-react'

export function ProductGrid() {
  const {
    results,
    total,
    loading,
    error,
    hasMore,
    fetchNextPage,
    filters,
  } = useProductFilters()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNextPage()
    }
  }

  const vehicleComplete =
    filters.vehicle_year &&
    filters.vehicle_make &&
    filters.vehicle_model &&
    filters.vehicle_trim

  const hasPartialVehicle =
    filters.vehicle_year ||
    filters.vehicle_make ||
    filters.vehicle_model

  return (
    <div className="space-y-6">
      {/* Results Count Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl bg-night-900/80 border border-night-800/50 px-5 py-4"
      >
        <div>
          <p className="text-sm text-slate-300">
            Showing <span className="font-semibold text-white">{total}</span> product
            {total === 1 ? '' : 's'}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {vehicleComplete
              ? 'Filtered for your selected vehicle'
              : 'Showing all products • Select vehicle to verify fitment'}
          </p>
        </div>
        {vehicleComplete ? (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-lime-500/10 border border-lime-500/20">
            <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span className="text-xs font-medium text-lime-400">Vehicle Matched</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Car className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">Verify Fitment</span>
          </div>
        )}
      </motion.div>

      {loading && results.length === 0 ? (
        <SkeletonGrid />
      ) : error ? (
        /* Error State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-coral-500/10 border border-coral-500/30 px-6 py-8 text-center"
        >
          <div className="max-w-sm mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-coral-500/20 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-coral-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Something went wrong</h3>
              <p className="text-sm text-coral-300">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-night-800 border border-night-700 text-sm font-medium text-white hover:bg-night-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </motion.div>
      ) : results.length === 0 ? (
        /* No Results State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-night-900/50 border border-night-800/50 px-6 py-16 text-center"
        >
          <div className="max-w-sm mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-night-800/50 border border-night-700/50 flex items-center justify-center">
              <PackageSearch className="h-10 w-10 text-slate-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">No products found</h3>
              <p className="text-sm text-slate-500">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Product Grid */
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence>
            {results.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
              >
                <ProductCard product={product} showFitmentBadge={!vehicleComplete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-4"
        >
          <button
            type="button"
            onClick={handleLoadMore}
            className="group flex items-center gap-2 px-8 py-3 rounded-xl bg-night-800 border border-night-700/50 text-white font-medium transition-all hover:bg-night-700 hover:border-night-600 hover:shadow-lg"
          >
            Load More Products
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Loading More Indicator */}
      {loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 py-6"
        >
          <Loader2 className="h-5 w-5 text-lime-500 animate-spin" />
          <span className="text-sm text-slate-400">Loading more products…</span>
        </motion.div>
      )}
    </div>
  )
}

export default ProductGrid
