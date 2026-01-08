export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl bg-steel-900/80 border border-steel-800/50"
        >
          {/* Image Skeleton */}
          <div className="relative h-48 overflow-hidden bg-steel-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-steel-700/20 to-transparent animate-shimmer" />
          </div>

          {/* Content Skeleton */}
          <div className="p-5 space-y-4">
            {/* Category Badge */}
            <div className="h-5 w-20 rounded-md bg-steel-800 animate-pulse" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded-md bg-steel-800 animate-pulse" />
              <div className="h-5 w-1/2 rounded-md bg-steel-800/50 animate-pulse" />
            </div>

            {/* Price & Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 w-24 rounded-md bg-steel-800 animate-pulse" />
              <div className="h-10 w-10 rounded-lg bg-steel-800 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
