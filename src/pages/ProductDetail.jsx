import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { useCart } from '../context/cartContext.jsx'
import { useWishlist } from '../context/wishlistContext'
import FitsYourVehicleBadge from '../components/FitsYourVehicleBadge.jsx'
import ProductReviews from '../components/ProductReviews.jsx'
import RelatedProducts from '../components/RelatedProducts.jsx'
import {
  ShoppingCart,
  Check,
  Package,
  Truck,
  Shield,
  HelpCircle,
  ChevronRight,
  Car,
  Loader2,
  AlertCircle,
  ImageOff,
  Heart,
  Star,
  Zap,
  Award,
  Ruler,
  CircleDot,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
} from 'lucide-react'

// Generate consistent "random" review data based on product id
function generateReviewData(productId) {
  const seed = typeof productId === 'string'
    ? productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : productId
  const rating = 4.2 + ((seed % 8) / 10)
  const reviewCount = 12 + (seed % 237)
  return { rating: Math.round(rating * 10) / 10, reviewCount }
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      setLoading(true)
      setError('')

      const query = supabase.from('products').select('*')
      const isUuid = /^[0-9a-fA-F-]{36}$/.test(id)
      const isNumeric = /^[0-9]+$/.test(id)
      if (isUuid || isNumeric) {
        query.eq('id', id)
      } else {
        query.eq('slug', id)
      }

      const { data, error: fetchError } = await query.single()
      if (!isMounted) return

      if (fetchError) {
        console.error(fetchError)
        setError('We could not find that product.')
        setProduct(null)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  const formattedPrice = useMemo(() => {
    if (!product?.price && product?.price !== 0) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(product.price)
  }, [product])

  const vehicleFitments = useMemo(
    () => (Array.isArray(product?.vehicle_compatibility) ? product.vehicle_compatibility : []),
    [product?.vehicle_compatibility]
  )

  const allImages = useMemo(() => {
    const images = []
    if (product?.image_url) images.push(product.image_url)
    if (product?.gallery_urls?.length > 0) images.push(...product.gallery_urls)
    return images
  }, [product])

  // Generate review data
  const { rating, reviewCount } = useMemo(
    () => product ? generateReviewData(product.id) : { rating: 0, reviewCount: 0 },
    [product]
  )

  // Build specs from product data
  const specs = useMemo(() => {
    if (!product) return []
    const s = []
    if (product.brand) s.push({ label: 'Brand', value: product.brand, icon: Award })
    if (product.sku) s.push({ label: 'SKU', value: product.sku, icon: CircleDot })
    if (product.wheel_diameter) s.push({ label: 'Diameter', value: `${product.wheel_diameter}"`, icon: Ruler })
    if (product.wheel_width) s.push({ label: 'Width', value: `${product.wheel_width}"`, icon: Ruler })
    if (product.bolt_pattern) s.push({ label: 'Bolt Pattern', value: product.bolt_pattern, icon: CircleDot })
    const wheelOffset = product.offset ?? product.wheel_offset
    if (wheelOffset !== undefined && wheelOffset !== null) s.push({ label: 'Wheel Offset', value: `${wheelOffset}mm`, icon: Ruler })
    if (product.lift_height) s.push({ label: 'Lift Height', value: `${product.lift_height}"`, icon: Zap })
    if (product.tire_size) s.push({ label: 'Tire Size', value: product.tire_size, icon: CircleDot })
    if (product.material) s.push({ label: 'Material', value: product.material, icon: Award })
    if (product.weight) s.push({ label: 'Weight', value: `${product.weight} lbs`, icon: Ruler })
    return s
  }, [product])

  const describeFitment = (fitment) => {
    if (!fitment || typeof fitment !== 'object') return null
    const parts = [
      fitment.year ?? fitment.vehicle_year,
      fitment.make ?? fitment.vehicle_make,
      fitment.model ?? fitment.vehicle_model,
      fitment.trim ?? fitment.vehicle_trim,
    ].filter(Boolean)
    return parts.length ? parts.join(' ') : null
  }

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
      })
    }
    setAddedToCart(true)
    toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    setWishlistLoading(true)
    const result = await toggleWishlist({
      id: product.id,
      name: product.title,
      price: product.price,
      images: product.image_url ? [product.image_url] : [],
      category: product.category,
    })
    setWishlistLoading(false)
    if (result.success) {
      toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist')
    } else {
      toast.error(result.error || 'Failed to update wishlist')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const inWishlist = product ? isInWishlist(product.id) : false

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 text-lime-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading product...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-night-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
          <p className="text-slate-400 mb-6">{error || 'The product you\'re looking for doesn\'t exist or has been removed.'}</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 transition-colors">
            <ChevronLeft className="h-5 w-5" />
            Back to Shop
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-8"
        >
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category}`} className="hover:text-white transition-colors capitalize">
                {product.category.replace('_', ' ')}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-slate-400 truncate max-w-[200px]">{product.title}</span>
        </motion.nav>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-night-900 border border-night-800">
              <AnimatePresence mode="wait">
                {allImages[selectedImage] ? (
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    src={allImages[selectedImage]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <ImageOff className="h-20 w-20 text-night-700 mx-auto mb-4" />
                      <p className="text-slate-500">Image coming soon</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-lime-500 text-night-950 text-xs font-bold uppercase tracking-wide">
                  {product.badge}
                </span>
              )}

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-night-950/80 backdrop-blur-sm border border-night-700 flex items-center justify-center text-white hover:bg-night-800 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-night-950/80 backdrop-blur-sm border border-night-700 flex items-center justify-center text-white hover:bg-night-800 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-lime-500 ring-2 ring-lime-500/30'
                        : 'border-night-700 hover:border-night-600'
                    }`}
                  >
                    <img src={url} alt={`View ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {product.category && (
                  <span className="px-3 py-1 rounded-lg bg-night-800 border border-night-700 text-slate-400 text-xs font-medium capitalize">
                    {product.category.replace('_', ' ')}
                  </span>
                )}
                {product.brand && (
                  <span className="px-3 py-1 rounded-lg bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-medium">
                    {product.brand}
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                {product.title}
              </h1>

              {/* Rating - clickable to scroll to reviews */}
              <button
                type="button"
                onClick={() => {
                  document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating)
                          ? 'text-amber-400 fill-amber-400'
                          : i < rating
                            ? 'text-amber-400 fill-amber-400/50'
                            : 'text-night-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-400 group-hover:text-lime-400 transition-colors underline-offset-2 group-hover:underline">
                  {rating} ({reviewCount} reviews)
                </span>
              </button>

              <FitsYourVehicleBadge fitments={vehicleFitments} />
            </div>

            {/* Price */}
            {formattedPrice && (
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-4xl font-bold text-white">{formattedPrice}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-slate-500 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
            )}

            {/* Quick Specs */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 p-3 rounded-xl bg-night-900/80 border border-night-800">
                    <spec.icon className="h-4 w-4 text-lime-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">{spec.label}</p>
                      <p className="text-sm font-medium text-white">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-night-800 border border-night-700 flex items-center justify-center text-white hover:bg-night-700 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-night-800 border border-night-700 flex items-center justify-center text-white hover:bg-night-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-base transition-all ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-lime-500 text-night-950 hover:bg-lime-400 shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                    inWishlist
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : 'bg-transparent border-night-700 text-slate-400 hover:border-pink-500 hover:text-pink-500'
                  }`}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`h-6 w-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-14 h-14 rounded-xl border-2 border-night-700 flex items-center justify-center text-slate-400 hover:border-lime-500 hover:text-lime-500 transition-all"
                  title="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <Link
                to="/cart"
                className="block w-full text-center py-3 px-6 rounded-xl bg-night-800 border border-night-700 text-white font-medium hover:bg-night-700 transition-colors"
              >
                View Cart
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-night-800">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-night-800 border border-night-700 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-lime-500" />
                </div>
                <p className="text-xs text-slate-400">Free Shipping<br />Over $500</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-night-800 border border-night-700 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-xs text-slate-400">Guaranteed<br />Fitment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-night-800 border border-night-700 flex items-center justify-center">
                  <Package className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-xs text-slate-400">Easy<br />Returns</p>
              </div>
            </div>

            {/* Support Link */}
            <div className="rounded-2xl bg-night-900/60 border border-night-800 p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-300 mb-2">
                    Need help choosing? Contact our build specialists for tailored fitment advice.
                  </p>
                  <Link to="/contact" className="text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors">
                    Talk with support →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          {/* Tab Headers */}
          <div className="flex gap-1 border-b border-night-800 mb-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Specifications' },
              { id: 'fitment', label: 'Vehicle Fitment' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-lime-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {product.description ? (
                  <div className="prose prose-invert max-w-none">
                    {product.description.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-slate-300 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No description available.</p>
                )}

                {product.features?.length > 0 && (
                  <div className="rounded-2xl bg-night-900/60 border border-night-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-lime-500" />
                      Key Features
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                          <Check className="h-5 w-5 text-lime-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {specs.length > 0 ? (
                  <div className="rounded-2xl bg-night-900/60 border border-night-800 overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {specs.map((spec, idx) => (
                          <tr key={spec.label} className={idx % 2 === 0 ? 'bg-night-800/30' : ''}>
                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">{spec.label}</td>
                            <td className="px-6 py-4 text-sm text-white">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500">No specifications available.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'fitment' && (
              <motion.div
                key="fitment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {vehicleFitments.length > 0 ? (
                  <div className="rounded-2xl bg-night-900/60 border border-night-800 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="h-5 w-5 text-lime-500" />
                      <h3 className="text-lg font-semibold text-white">Compatible Vehicles</h3>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {vehicleFitments.map((fitment, index) => {
                        const label = describeFitment(fitment)
                        return (
                          <li key={index} className="flex items-center gap-2 text-sm text-slate-300 p-3 rounded-lg bg-night-800/50">
                            <Check className="h-4 w-4 text-lime-500 flex-shrink-0" />
                            {label || 'Compatible vehicle'}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Car className="h-12 w-12 text-night-700 mx-auto mb-4" />
                    <p className="text-slate-500">No specific fitment data available.</p>
                    <p className="text-sm text-slate-600 mt-2">Contact support to verify compatibility.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Related Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-12 border-t border-night-800"
        >
          <RelatedProducts product={product} />
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          id="product-reviews"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-12 border-t border-night-800 scroll-mt-8"
        >
          <ProductReviews productId={product.id} />
        </motion.div>
      </div>
    </div>
  )
}
