import { useCart } from '../context/cartContext.jsx'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  ImageOff,
} from 'lucide-react'

export default function CartModal({ onClose }) {
  const { cartItems, updateQuantity, removeFromCart, subtotal, tax, total } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (onClose) onClose()
    navigate('/checkout')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-midnight-950/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-steel-900 border border-steel-800/50 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-steel-800/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500/10 border border-flame-500/30">
                <ShoppingCart className="h-5 w-5 text-flame-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                <p className="text-xs text-steel-500">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-steel-800/50 border border-steel-700/50 text-steel-400 hover:text-white hover:border-steel-600 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-[50vh] overflow-y-auto px-6 py-4 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-steel-800/50 border border-steel-700/50 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-steel-600" />
                  </div>
                  <p className="text-steel-400 mb-2">Your cart is empty</p>
                  <p className="text-steel-500 text-sm">Start adding some parts!</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-3 rounded-xl bg-steel-800/30 border border-steel-700/30"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-steel-800 flex-shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title || item.name || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="h-8 w-8 text-steel-600" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">
                          {item.title || item.name}
                        </p>
                        <p className="text-flame-400 font-semibold mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-steel-700/50 border border-steel-600/50 text-steel-400 hover:text-white hover:border-steel-500 transition-all"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">
                            {item.quantity ?? 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-steel-700/50 border border-steel-600/50 text-steel-400 hover:text-white hover:border-steel-500 transition-all"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-steel-500 hover:text-redline-400 hover:bg-redline-500/10 transition-all self-start"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-steel-800/50 px-6 py-4 space-y-4"
            >
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-steel-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-steel-400">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="h-px bg-steel-800 my-2" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-flame-400">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="btn-primary w-full py-4"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Continue Shopping */}
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-sm text-steel-400 hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
