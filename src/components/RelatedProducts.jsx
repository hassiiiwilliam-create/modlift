import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'
import { useCart } from '../context/cartContext.jsx'
import { useWishlist } from '../context/wishlistContext'
import { AppContext } from '../App'
import {
  ShoppingCart,
  Heart,
  Package,
  Sparkles,
  ArrowRight,
  Loader2,
  Wrench,
  Star,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// Accessory categories that complement main products
const ACCESSORY_CATEGORIES = ['accessories', 'hardware', 'lug_nuts', 'mounting']

// Category relationships for smart suggestions
const CATEGORY_COMPANIONS = {
  wheels: ['tires', 'lug_nuts', 'accessories', 'hardware'],
  tires: ['wheels', 'accessories'],
  lift_kits: ['accessories', 'shocks', 'hardware'],
  accessories: ['wheels', 'tires', 'lift_kits'],
}

export default function RelatedProducts({ product, className = '' }) {
  const { addToCart } = useCart()
  const { wishlistItems } = useWishlist()
  const { user } = useContext(AppContext)

  const [relatedProducts, setRelatedProducts] = useState([])
  const [accessoryProducts, setAccessoryProducts] = useState([])
  const [wishlistSuggestions, setWishlistSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!product) return
    fetchRelatedProducts()
  }, [product?.id, product?.category])

  const fetchRelatedProducts = async () => {
    setLoading(true)
    try {
      const productCategory = product.category
      const productId = product.id

      // Get companion categories for this product type
      const companionCategories = CATEGORY_COMPANIONS[productCategory] || ['accessories']

      // Fetch related products from same category (excluding current product)
      const { data: sameCategory } = await supabase
        .from('products')
        .select('id, title, price, image_url, category, brand')
        .eq('category', productCategory)
        .neq('id', productId)
        .limit(4)

      // Fetch accessory/companion products
      const { data: accessories } = await supabase
        .from('products')
        .select('id, title, price, image_url, category, brand')
        .in('category', companionCategories)
        .limit(6)

      setRelatedProducts(sameCategory || [])
      setAccessoryProducts(accessories || [])

      // If user has wishlist items, suggest some they haven't purchased
      if (wishlistItems.length > 0) {
        // Filter wishlist items that are different from current product
        const suggestions = wishlistItems
          .filter(item => item.productId !== productId && item.id !== productId)
          .slice(0, 3)
        setWishlistSuggestions(suggestions)
      }
    } catch (err) {
      console.error('Error fetching related products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image_url: item.image_url,
      category: item.category,
      quantity: 1,
    })
    toast.success(`Added ${item.title} to cart`)
  }

  const hasContent = relatedProducts.length > 0 || accessoryProducts.length > 0 || wishlistSuggestions.length > 0

  if (loading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
        </div>
      </div>
    )
  }

  if (!hasContent) {
    return null
  }

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Frequently Bought Together / Accessories */}
      {accessoryProducts.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Complete Your Build</h3>
              <p className="text-sm text-slate-400">Popular accessories and add-ons</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {accessoryProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-xl bg-night-900/60 border border-night-800/50 overflow-hidden hover:border-amber-500/30 transition-all"
              >
                <Link to={`/shop/${item.id}`} className="block">
                  <div className="aspect-square bg-night-800 relative overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-slate-700" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/shop/${item.id}`}>
                    <h4 className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                      {item.title}
                    </h4>
                  </Link>
                  <p className="text-sm font-bold text-lime-400 mt-1">
                    {currency.format(item.price)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-night-800 border border-night-700/50 text-xs font-medium text-slate-300 hover:bg-lime-500 hover:text-night-950 hover:border-lime-500 transition-all"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* From Your Wishlist */}
      {wishlistSuggestions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">From Your Wishlist</h3>
                <p className="text-sm text-slate-400">Items you've been eyeing</p>
              </div>
            </div>
            <Link
              to="/wishlist"
              className="text-sm text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {wishlistSuggestions.map((item, index) => (
              <motion.div
                key={item.wishlistId || item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex gap-4 rounded-xl bg-night-900/60 border border-night-800/50 p-4 hover:border-pink-500/30 transition-all"
              >
                <Link
                  to={`/shop/${item.productId || item.id}`}
                  className="flex-shrink-0 w-20 h-20 rounded-lg bg-night-800 overflow-hidden"
                >
                  {(item.image_url || item.images?.[0]) ? (
                    <img
                      src={item.image_url || item.images?.[0]}
                      alt={item.name || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-slate-700" />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/shop/${item.productId || item.id}`}>
                    <h4 className="text-sm font-medium text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                      {item.name || item.title}
                    </h4>
                  </Link>
                  <p className="text-sm font-bold text-pink-400 mt-1">
                    {currency.format(item.price)}
                  </p>
                  <button
                    onClick={() => handleAddToCart({
                      id: item.productId || item.id,
                      title: item.name || item.title,
                      price: item.price,
                      image_url: item.image_url || item.images?.[0],
                      category: item.category,
                    })}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-xs font-medium text-pink-400 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Similar Products</h3>
                <p className="text-sm text-slate-400">You might also like</p>
              </div>
            </div>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-sm text-lime-400 hover:text-lime-300 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-xl bg-night-900/60 border border-night-800/50 overflow-hidden hover:border-lime-500/30 transition-all"
              >
                <Link to={`/shop/${item.id}`} className="block">
                  <div className="aspect-square bg-night-800 relative overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-10 w-10 text-slate-700" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/shop/${item.id}`}>
                    <h4 className="font-medium text-white group-hover:text-lime-400 transition-colors line-clamp-2 min-h-[3rem]">
                      {item.title}
                    </h4>
                  </Link>
                  {item.brand && (
                    <p className="text-xs text-slate-500 mt-1">{item.brand}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-lg font-bold text-lime-400">
                      {currency.format(item.price)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center justify-center h-9 w-9 rounded-lg bg-night-800 border border-night-700/50 text-slate-400 hover:bg-lime-500 hover:text-night-950 hover:border-lime-500 transition-all"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
