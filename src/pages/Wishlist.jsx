import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'
import { useWishlist } from '../context/wishlistContext'
import { useCart } from '../context/cartContext'
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Package,
  Loader2,
  HeartOff,
  LogIn,
  Sparkles,
} from 'lucide-react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function Wishlist() {
  const { user } = useContext(AppContext)
  const { wishlistItems, loading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleRemove = async (productId, productName) => {
    const result = await removeFromWishlist(productId)
    if (result.success) {
      toast.success(`Removed ${productName} from wishlist`)
    } else {
      toast.error(result.error || 'Failed to remove item')
    }
  }

  const handleAddToCart = (item) => {
    addToCart({
      id: item.productId || item.id,
      title: item.name || item.title,
      name: item.name || item.title,
      price: item.price,
      image_url: item.images?.[0] || item.image_url || null,
      quantity: 1,
    })
    toast.success(`Added ${item.name || item.title} to cart`)
  }

  const handleMoveToCart = async (item) => {
    handleAddToCart(item)
    await removeFromWishlist(item.productId || item.id)
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-night-900 border border-night-800 flex items-center justify-center">
            <Heart className="h-12 w-12 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to view your wishlist</h1>
          <p className="text-slate-400 mb-6">
            Save your favorite products and access them from any device.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-10 w-10 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your wishlist...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-lime-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Continue shopping
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500 shadow-lg shadow-pink-500/30">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Wishlist</h1>
              <p className="text-slate-400">
                {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-night-900 border border-night-800 flex items-center justify-center">
                <HeartOff className="h-12 w-12 text-slate-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Your wishlist is empty</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Start adding products you love by clicking the heart icon on any product.
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl"
              >
                Browse Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Wishlist Items Grid */}
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.wishlistId || item.productId || item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden transition-all hover:border-pink-500/30"
                  >
                    {/* Image */}
                    <Link
                      to={`/shop/${item.productId || item.id}`}
                      className="block aspect-square bg-night-800 relative overflow-hidden"
                    >
                      {(item.images?.[0] || item.image_url) ? (
                        <img
                          src={item.images?.[0] || item.image_url}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-slate-700" />
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {/* Content */}
                    <div className="p-4">
                      <Link to={`/shop/${item.productId || item.id}`}>
                        <h3 className="font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2 min-h-[3rem]">
                          {item.name || item.title}
                        </h3>
                      </Link>
                      {item.category && (
                        <span className="inline-flex items-center mt-2 px-2.5 py-1 rounded-lg bg-night-800/80 text-xs text-slate-400 capitalize border border-night-700/50">
                          {item.category.replace('_', ' ')}
                        </span>
                      )}
                      <p className="text-xl font-bold text-pink-400 mt-3">
                        {currency.format(item.price || 0)}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-lime-500 text-night-950 text-sm font-semibold shadow-lg shadow-lime-500/20 transition-all hover:bg-lime-400 hover:shadow-xl"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleRemove(item.productId || item.id, item.name || item.title)}
                          className="flex items-center justify-center p-2.5 rounded-xl bg-night-800/50 border border-night-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {/* Add All to Cart */}
            {wishlistItems.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={() => {
                    wishlistItems.forEach((item) => handleAddToCart(item))
                    toast.success(`Added ${wishlistItems.length} items to cart`)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-night-800 border border-night-700/50 text-white font-medium transition-all hover:bg-night-700 hover:border-night-600"
                >
                  <Sparkles className="h-5 w-5 text-lime-400" />
                  Add All to Cart
                </button>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-lime-400 font-medium transition-colors"
                >
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
