import { useEffect } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import ProductCard from './ProductCard'
import SidebarFilters from './SidebarFilters.jsx'
import FilterChips from './FilterChips'
import SkeletonGrid from './SkeletonGrid'
import MobileTopbar from './MobileTopbar'
import { useProductFilters } from '../hooks/useProductFilters.jsx'

export default function ProductList() {
  const {
    filters,
    removeFilter,
    clearFilters,
    results,
    total,
    loading,
    error,
    hasMore,
    fetchNextPage,
    activeChips,
  } = useProductFilters()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchNextPage()
    }
  }

  const activeCount = activeChips.length

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="lg:hidden">
        <MobileTopbar />
      </div>

      <div className="hidden lg:block lg:w-[300px] shrink-0">
        <SidebarFilters />
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-white/70 px-4 py-3 shadow-sm shadow-black/5 ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-medium text-gray-600">
              Showing <span className="text-gray-900">{total}</span> product{total === 1 ? '' : 's'}
              {activeCount > 0 && (
                <span className="text-gray-400"> · {activeCount} filter{activeCount === 1 ? '' : 's'} active</span>
              )}
            </p>
          </div>

          <FilterChips
            filters={filters}
            chips={activeChips}
            onRemove={removeFilter}
            onClear={clearFilters}
            totalResults={total}
          />
        </div>

        {loading && results.length === 0 ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="py-12 text-center text-red-500">{error}</div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            No products found. Adjust your filters and try again.
          </div>
        ) : (
          <Motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence>
              {results.map((product) => (
                <Motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <ProductCard product={product} />
                </Motion.div>
              ))}
            </AnimatePresence>
          </Motion.div>
        )}

        {hasMore && !loading && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
            >
              Load More
            </button>
          </div>
        )}

        {loading && results.length > 0 && (
          <div className="py-6 text-center text-neutral-500">Loading more products…</div>
        )}
      </div>
    </div>
  )
}
