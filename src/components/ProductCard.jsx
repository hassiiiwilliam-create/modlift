import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, Check, Sparkles, Star, Clock, AlertTriangle } from 'lucide-react'
import { useCart } from '../context/cartContext.jsx'
import { toast } from 'react-hot-toast'
import FitsYourVehicleBadge from './FitsYourVehicleBadge.jsx'

// Generate consistent "random" review data based on product id
function generateReviewData(productId) {
  // Use product id to generate consistent pseudo-random values
  const seed = typeof productId === 'string'
    ? productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : productId

  // Rating between 4.2 and 5.0
  const rating = 4.2 + ((seed % 8) / 10)
  // Review count between 12 and 248
  const reviewCount = 12 + (seed % 237)

  return { rating: Math.round(rating * 10) / 10, reviewCount }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function ProductCard({ product, showFitmentBadge = false }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const {
    id,
    title,
    price,
    description,
    fitment,
    image_url: imageUrl,
    badge,
    slug,
    category,
    vehicle_compatibility: vehicleCompatibility = [],
    stock_quantity: stockQuantity,
  } = product

  const formattedPrice = typeof price === 'number' ? currencyFormatter.format(price) : price
  const detailsHref = slug ? `/product/${slug}` : `/product/${id}`

  // Generate review data based on product id
  const { rating, reviewCount } = useMemo(() => generateReviewData(id), [id])

  // Determine stock status for urgency
  const isLowStock = stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 5
  const showUrgency = isLowStock || badge === 'Popular' || badge === 'Best Seller'

  const handleAddToCart = async () => {
    setAdding(true)
    addToCart({ id, title, price, image_url: imageUrl, category })

    // Show success state
    setTimeout(() => {
      setAdding(false)
      setAdded(true)
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Added to cart</span>
        </div>,
        {
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }
      )

      // Reset after animation
      setTimeout(() => setAdded(false), 2000)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-night-900/80 backdrop-blur-sm border border-night-800/50 transition-all duration-400 hover:border-night-700/50 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-night-800">
        {/* Skeleton Loader */}
        {!imageLoaded && imageUrl && (
          <div className="absolute inset-0 skeleton" />
        )}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-night-700/50 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-slate-500" />
              </div>
              <span className="text-slate-500 text-sm">Image coming soon</span>
            </div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-night-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quick View Button */}
        <Link
          to={detailsHref}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          <span className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white border border-white/20 transition-all hover:bg-white/20">
            <Eye className="h-4 w-4" />
            Quick View
          </span>
        </Link>

        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 rounded-lg bg-lime-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-night-950 shadow-lg shadow-lime-500/30">
            {badge}
          </span>
        )}

        {/* Category Tag */}
        {category && (
          <span className="absolute top-4 right-4 rounded-lg bg-night-900/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-slate-300 border border-night-700/50">
            {category.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        {/* Title & Fitment */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2 group-hover:text-lime-400 transition-colors">
            {title}
          </h3>

          {/* Review Stars */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating)
                      ? 'text-lime-400 fill-lime-400'
                      : i < rating
                        ? 'text-lime-400 fill-lime-400/50'
                        : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">
              {rating} ({reviewCount})
            </span>
          </div>

          {fitment && (
            <p className="text-sm text-slate-500">{fitment}</p>
          )}
          {showFitmentBadge ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">Verify Fitment</span>
            </div>
          ) : (
            <FitsYourVehicleBadge fitments={vehicleCompatibility} />
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-400 line-clamp-2 flex-1">
            {description}
          </p>
        )}

        {/* Price & Actions */}
        <div className="space-y-3 pt-2">
          {/* Price & Urgency */}
          <div className="flex items-center justify-between">
            {formattedPrice && (
              <span className="text-2xl font-bold text-white">{formattedPrice}</span>
            )}
            {isLowStock && (
              <span className="flex items-center gap-1 text-xs text-coral-400 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Only {stockQuantity} left
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className={`relative flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                added
                  ? 'bg-mint-500 text-night-950'
                  : 'bg-lime-500 text-night-950 shadow-lg shadow-lime-500/25 hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40 hover:scale-[1.02]'
              } disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {adding ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-night-950/30 border-t-night-950 rounded-full"
                />
              ) : added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </button>

            <Link
              to={detailsHref}
              className="flex items-center justify-center rounded-xl border border-night-700/50 bg-night-800/50 px-4 py-3 text-slate-300 transition-all duration-200 hover:border-night-600 hover:bg-night-800 hover:text-white"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-lime-500/20 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}
