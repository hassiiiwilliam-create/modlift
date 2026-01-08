import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/cartContext.jsx'
import { useMemo } from 'react'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Sparkles,
  Lock,
  Gift,
  Tag,
  Heart,
  Clock,
} from 'lucide-react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const benefits = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $500', color: 'lime' },
  { icon: ShieldCheck, label: 'Guaranteed Fit', desc: 'Or your money back', color: 'cyan' },
  { icon: Gift, label: 'Fast Delivery', desc: '2-5 business days', color: 'amber' },
]

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, cartCount } = useCart()
  const navigate = useNavigate()

  const hasItems = cartItems.length > 0

  const shipping = useMemo(() => totalPrice >= 500 ? 0 : 49.99, [totalPrice])
  const subtotalLabel = useMemo(() => currency.format(totalPrice), [totalPrice])
  const shippingLabel = useMemo(() => shipping === 0 ? 'FREE' : currency.format(shipping), [shipping])
  const estimatedTax = useMemo(() => totalPrice * 0.0825, [totalPrice])
  const estimatedTaxLabel = useMemo(() => currency.format(estimatedTax), [estimatedTax])
  const estimatedTotal = useMemo(() => currency.format(totalPrice + estimatedTax + shipping), [totalPrice, estimatedTax, shipping])
  const freeShippingProgress = useMemo(() => Math.min((totalPrice / 500) * 100, 100), [totalPrice])
  const amountToFreeShipping = useMemo(() => Math.max(500 - totalPrice, 0), [totalPrice])

  const handleQuantityChange = (id, nextQuantity) => {
    if (nextQuantity < 1) return
    updateQuantity(id, nextQuantity)
  }

  return (
    <div className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
              <ShoppingCart className="h-7 w-7 text-night-950" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Cart</h1>
              <p className="text-slate-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} ready to build your ride
              </p>
            </div>
          </div>
        </motion.div>

        {!hasItems ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-night-900 border border-night-800 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-slate-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
                <p className="text-slate-400">Add some products to get started</p>
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
          /* Cart Content */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping Progress */}
              {totalPrice < 500 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-lime-400" />
                      <span className="text-sm text-slate-300">
                        Add <span className="font-bold text-lime-400">{currency.format(amountToFreeShipping)}</span> more for free shipping!
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-night-800 px-2 py-1 rounded-full">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-night-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-lime-600 to-lime-400"
                    />
                  </div>
                </motion.div>
              )}

              {totalPrice >= 500 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-lime-500/10 border border-lime-500/30 p-4 flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/20 text-lime-400">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-lime-400">Free Shipping Unlocked!</p>
                    <p className="text-xs text-slate-400">Your order qualifies for free shipping</p>
                  </div>
                </motion.div>
              )}

              {/* Items List */}
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden transition-all hover:border-night-700"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Image */}
                        <Link
                          to={`/shop/${item.id}`}
                          className="relative h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-night-800 border border-night-700/50 group-hover:border-lime-500/30 transition-colors"
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-600">
                              <Package className="h-10 w-10" />
                            </div>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <Link
                                  to={`/shop/${item.id}`}
                                  className="text-lg font-bold text-white hover:text-lime-400 transition-colors line-clamp-2"
                                >
                                  {item.title}
                                </Link>
                                {item.category && (
                                  <span className="inline-flex items-center mt-2 px-2.5 py-1 rounded-lg bg-night-800/80 text-xs text-slate-400 capitalize border border-night-700/50">
                                    {item.category.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xl font-bold text-white">
                                  {currency.format(item.price ?? 0)}
                                </p>
                                <p className="text-xs text-slate-500">each</p>
                              </div>
                            </div>
                          </div>

                          {/* Quantity & Actions */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-night-800/50">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500 mr-2">Qty:</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, (item.quantity ?? 1) - 1)}
                                disabled={(item.quantity ?? 1) <= 1}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-night-700/50 bg-night-800/70 text-slate-400 transition-all hover:bg-night-700 hover:text-white hover:border-lime-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={item.quantity ?? 1}
                                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                className="w-14 h-9 rounded-lg border border-night-700/50 bg-night-800/70 text-center text-sm font-semibold text-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, (item.quantity ?? 1) + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-night-700/50 bg-night-800/70 text-slate-400 transition-all hover:bg-night-700 hover:text-white hover:border-lime-500/30"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Line Total & Remove */}
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-slate-500">Subtotal</p>
                                <p className="text-lg font-bold text-lime-400">
                                  {currency.format((item.price ?? 0) * (item.quantity ?? 1))}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                                aria-label={`Remove ${item.title} from cart`}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
                >
                  <div className="p-6 border-b border-night-800/50">
                    <h2 className="text-xl font-bold text-white">Order Summary</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal ({cartCount} items)</span>
                      <span className="text-white font-medium">{subtotalLabel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Estimated Tax</span>
                      <span className="text-white font-medium">{estimatedTaxLabel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Shipping</span>
                      <span className={`font-semibold ${shipping === 0 ? 'text-lime-400' : 'text-white'}`}>
                        {shippingLabel}
                      </span>
                    </div>

                    <div className="h-px bg-night-700/50 my-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Estimated Total</span>
                      <span className="text-2xl font-bold text-lime-400">{estimatedTotal}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-night-900/50 border-t border-night-800/50">
                    <button
                      type="button"
                      onClick={() => navigate('/checkout')}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5" />
                    </button>

                    <p className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                      <Lock className="h-3.5 w-3.5" />
                      Secure checkout powered by Stripe
                    </p>
                  </div>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-5 space-y-4"
                >
                  {benefits.map((benefit, index) => {
                    const colorClasses = {
                      lime: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
                      cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    }
                    return (
                      <motion.div
                        key={benefit.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colorClasses[benefit.color]}`}>
                          <benefit.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{benefit.label}</p>
                          <p className="text-xs text-slate-500">{benefit.desc}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>

                {/* Promo Code Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <p className="text-xs text-slate-500">
                    Have a promo code? Apply it at checkout.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
