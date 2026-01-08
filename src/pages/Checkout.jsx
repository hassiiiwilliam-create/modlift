import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { supabase } from '../supabaseClient'
import { useCart } from '../context/cartContext.jsx'
import { AppContext } from '../App'
import {
  CreditCard,
  Truck,
  ShieldCheck,
  User,
  MapPin,
  Phone,
  FileText,
  ArrowLeft,
  ArrowRight,
  Lock,
  Check,
  Package,
  AlertCircle,
  Loader2,
  Mail,
  LogIn,
  UserPlus,
  Home,
  Building2,
  Star,
  Sparkles,
  Gift,
  Clock,
  BadgeCheck,
} from 'lucide-react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null

const steps = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'review', label: 'Review', icon: FileText },
  { id: 'payment', label: 'Payment', icon: CreditCard },
]

// Payment form component that uses Stripe Elements
function PaymentForm({ clientSecret, orderId, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.')
        onError?.(error)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent)
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        setErrorMessage('Additional authentication required.')
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.')
      onError?.(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl bg-night-800/50 border border-night-700/50 p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'US',
                },
              },
            },
          }}
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            Complete Purchase
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-2">
        <Lock className="h-3 w-3" />
        Your payment is secured by Stripe
      </p>
    </form>
  )
}

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState('account')
  const [checkoutMode, setCheckoutMode] = useState(user ? 'signed-in' : null)
  const [guestEmail, setGuestEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  // Address book state
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [useNewAddress, setUseNewAddress] = useState(false)

  // Stripe state
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState('')
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false)
  const [serverTotals, setServerTotals] = useState(null)

  // Fetch addresses when user is signed in
  useEffect(() => {
    if (user && checkoutMode === 'signed-in') {
      fetchAddresses()
    }
  }, [user, checkoutMode])

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId && !useNewAddress) {
      const defaultAddr = addresses.find((a) => a.is_default)
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id)
        applyAddress(defaultAddr)
      }
    }
  }, [addresses])

  // If user is already logged in, set checkout mode
  useEffect(() => {
    if (user && !checkoutMode) {
      setCheckoutMode('signed-in')
    }
  }, [user])

  const fetchAddresses = async () => {
    if (!user) return

    setLoadingAddresses(true)
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setAddresses(data || [])

      if (!data || data.length === 0) {
        setUseNewAddress(true)
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
    } finally {
      setLoadingAddresses(false)
    }
  }

  const applyAddress = (address) => {
    setShippingInfo({
      name: address.full_name || '',
      phone: address.phone || '',
      address: address.address_line1 + (address.address_line2 ? `, ${address.address_line2}` : ''),
      city: address.city || '',
      state: address.state || '',
      zip: address.zip_code || '',
    })
  }

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id)
    setUseNewAddress(false)
    applyAddress(address)
  }

  const hasItems = cartItems.length > 0
  const shipping = totalPrice >= 500 ? 0 : 49.99

  // Use server totals if available (more accurate)
  const displayTotals = serverTotals || {
    subtotal: totalPrice,
    tax: totalPrice * 0.0825,
    shipping,
    total: totalPrice * 1.0825 + shipping,
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const isShippingValid = () => {
    return shippingInfo.name && shippingInfo.address && shippingInfo.city && shippingInfo.zip
  }

  const isStripeConfigured = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

  const getCheckoutEmail = () => {
    if (checkoutMode === 'signed-in' && user) {
      return user.email
    }
    return guestEmail
  }

  const createPaymentIntent = async () => {
    const email = getCheckoutEmail()

    if (!email) {
      toast.error('Please provide an email address.')
      setCurrentStep('account')
      return false
    }

    if (!isShippingValid()) {
      toast.error('Please complete your shipping details.')
      setCurrentStep('shipping')
      return false
    }

    setIsCreatingPaymentIntent(true)

    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity || 1,
          })),
          shipping_info: shippingInfo,
          user_id: user?.id || null,
          email: email,
          is_guest: checkoutMode === 'guest',
        },
      })

      if (error) {
        console.error('Payment intent error:', error)
        toast.error(error.message || 'Failed to initialize payment')
        return false
      }

      // Check for error in response data (Edge Function returned error response)
      if (data?.error) {
        console.error('Payment intent error:', data.error)
        toast.error(data.error || 'Failed to initialize payment')
        return false
      }

      if (!data?.clientSecret) {
        console.error('No client secret in response:', data)
        toast.error('Failed to initialize payment. Please try again.')
        return false
      }

      setClientSecret(data.clientSecret)
      setOrderId(data.orderId)
      setServerTotals(data.totals)
      return true
    } catch (err) {
      console.error('Payment intent error:', err)
      toast.error('Failed to initialize payment')
      return false
    } finally {
      setIsCreatingPaymentIntent(false)
    }
  }

  const handleContinueToPayment = async () => {
    const success = await createPaymentIntent()
    if (success) {
      setCurrentStep('payment')
    }
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    toast.success('Payment successful! Order placed.')
    clearCart()
    navigate('/orders')
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
  }

  const handleDemoSubmit = async (event) => {
    event.preventDefault()

    if (!hasItems) {
      toast.error('Your cart is empty.')
      return
    }

    const email = getCheckoutEmail()
    if (!email) {
      toast.error('Please provide an email address.')
      setCurrentStep('account')
      return
    }

    if (!isShippingValid()) {
      toast.error('Please complete your shipping details.')
      setCurrentStep('shipping')
      return
    }

    setIsCreatingPaymentIntent(true)

    try {
      const orderItems = cartItems.map((item) => {
        const { _addedAt, ...rest } = item
        return rest
      })

      const payload = {
        user_id: user?.id || null,
        email: email,
        items: orderItems,
        total_price: totalPrice * 1.0825 + shipping,
        shipping_info: shippingInfo,
        order_notes: notes,
        status: 'processing',
        stripe_payment_status: 'demo',
        submitted_at: new Date().toISOString(),
        is_guest: checkoutMode === 'guest',
      }

      const { error } = await supabase.from('orders').insert(payload)

      if (error) {
        console.error(error)
        toast.error('Failed to place order. Please try again.')
        return
      }

      clearCart()
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      console.error(err)
      toast.error('Failed to place order.')
    } finally {
      setIsCreatingPaymentIntent(false)
    }
  }

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 mx-auto rounded-2xl bg-night-900 border border-night-800 flex items-center justify-center">
            <Package className="h-12 w-12 text-slate-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
            <p className="text-slate-400">Add some products to checkout</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl"
          >
            Browse Products
            <ArrowRight className="h-5 w-5" />
          </Link>
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
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-lime-400 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
              <CreditCard className="h-7 w-7 text-night-950" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
              <p className="text-slate-400">Complete your order in a few steps</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep
              const isPast = steps.findIndex((s) => s.id === currentStep) > index
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isPast) setCurrentStep(step.id)
                    }}
                    disabled={!isPast && !isActive}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? 'bg-lime-500 text-night-950 shadow-lg shadow-lime-500/30'
                          : isPast
                          ? 'bg-lime-500/20 text-lime-400 cursor-pointer group-hover:bg-lime-500/30'
                          : 'bg-night-800 text-slate-500 border border-night-700'
                      }`}
                    >
                      {isPast ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      isActive ? 'text-lime-400' : isPast ? 'text-lime-400/70' : 'text-slate-500'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 mt-[-20px] ${
                      isPast ? 'bg-lime-500/50' : 'bg-night-800'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Account Step */}
            {currentStep === 'account' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {user ? (
                  <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-night-800/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
                          <BadgeCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Welcome back!</h2>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address Book */}
                    <div className="p-6">
                      {loadingAddresses ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
                        </div>
                      ) : addresses.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-lime-400" />
                            Select shipping address
                          </h3>
                          <div className="grid gap-3">
                            {addresses.map((address) => (
                              <button
                                key={address.id}
                                type="button"
                                onClick={() => handleSelectAddress(address)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                  selectedAddressId === address.id && !useNewAddress
                                    ? 'bg-lime-500/10 border-lime-500/50 shadow-lg shadow-lime-500/10'
                                    : 'bg-night-800/30 border-night-700/50 hover:border-night-600 hover:bg-night-800/50'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                      address.label === 'work'
                                        ? 'bg-blue-500/10 text-blue-400'
                                        : 'bg-lime-500/10 text-lime-400'
                                    }`}>
                                      {address.label === 'work' ? (
                                        <Building2 className="h-5 w-5" />
                                      ) : (
                                        <Home className="h-5 w-5" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-white capitalize">
                                          {address.label || 'Home'}
                                        </span>
                                        {address.is_default && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-500/10 text-lime-400 border border-lime-500/30">
                                            <Star className="h-3 w-3" />
                                            Default
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-400 mt-1">{address.full_name}</p>
                                    </div>
                                  </div>
                                  {selectedAddressId === address.id && !useNewAddress && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500 text-night-950">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="mt-3 text-sm text-slate-400 pl-13">
                                  <p>{address.address_line1}</p>
                                  {address.address_line2 && <p>{address.address_line2}</p>}
                                  <p>{address.city}, {address.state} {address.zip_code}</p>
                                </div>
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                setUseNewAddress(true)
                                setSelectedAddressId(null)
                                setShippingInfo({ name: '', phone: '', address: '', city: '', state: '', zip: '' })
                              }}
                              className={`w-full p-4 rounded-xl border-2 border-dashed transition-all flex items-center gap-3 ${
                                useNewAddress
                                  ? 'bg-lime-500/10 border-lime-500/50'
                                  : 'bg-night-800/20 border-night-700/50 hover:border-night-600'
                              }`}
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-night-700/50 text-slate-400">
                                <MapPin className="h-5 w-5" />
                              </div>
                              <span className="text-sm font-medium text-slate-300">Use a different address</span>
                              {useNewAddress && (
                                <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-lime-500 text-night-950">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                          <p className="text-slate-400">No saved addresses yet</p>
                          <p className="text-sm text-slate-500">You'll enter your shipping details next</p>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="p-6 bg-night-900/50 border-t border-night-800/50">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('shipping')}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40"
                      >
                        Continue to Shipping
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden">
                    <div className="p-6 border-b border-night-800/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">How would you like to checkout?</h2>
                          <p className="text-sm text-slate-400">Sign in or continue as guest</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => navigate('/login?redirect=/checkout')}
                          className="p-6 rounded-xl border-2 border-night-700/50 bg-night-800/30 hover:border-lime-500/50 hover:bg-night-800/50 transition-all text-left group"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400 mb-4 group-hover:bg-lime-500/20 transition-colors">
                            <LogIn className="h-7 w-7" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">Sign In</h3>
                          <p className="text-sm text-slate-400">Access saved addresses and order history</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCheckoutMode('guest')}
                          className={`p-6 rounded-xl border-2 transition-all text-left group ${
                            checkoutMode === 'guest'
                              ? 'border-cyan-500/50 bg-cyan-500/10'
                              : 'border-night-700/50 bg-night-800/30 hover:border-cyan-500/50 hover:bg-night-800/50'
                          }`}
                        >
                          <div className={`flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-colors ${
                            checkoutMode === 'guest' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20'
                          }`}>
                            <UserPlus className="h-7 w-7" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">Guest Checkout</h3>
                          <p className="text-sm text-slate-400">No account needed</p>
                        </button>
                      </div>

                      <AnimatePresence>
                        {checkoutMode === 'guest' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 space-y-4"
                          >
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                              <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all text-lg"
                                required
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              We'll send order confirmation and updates to this email
                            </p>

                            <button
                              type="button"
                              onClick={() => setCurrentStep('shipping')}
                              disabled={!guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)}
                              className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Continue as Guest
                              <ArrowRight className="h-5 w-5" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Shipping Information */}
            {currentStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
              >
                <div className="p-6 border-b border-night-800/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Shipping Information</h2>
                      <p className="text-sm text-slate-400">Where should we deliver your order?</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative sm:col-span-2">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="relative sm:col-span-2">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleChange}
                        placeholder="Phone Number (optional)"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="relative sm:col-span-2">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleChange}
                        placeholder="Street Address"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                        required
                      />
                    </div>

                    <input
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full px-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                      />
                      <input
                        name="zip"
                        value={shippingInfo.zip}
                        onChange={handleChange}
                        placeholder="ZIP Code"
                        className="w-full px-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-night-900/50 border-t border-night-800/50">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('review')}
                    disabled={!isShippingValid()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Review
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Shipping Summary */}
                <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
                        <Truck className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Shipping To</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="text-sm text-lime-400 hover:text-lime-300 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-night-800/30 border border-night-700/50">
                    <p className="font-semibold text-white">{shippingInfo.name}</p>
                    <p className="text-slate-400">{shippingInfo.address}</p>
                    <p className="text-slate-400">
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
                    </p>
                    {shippingInfo.phone && <p className="text-slate-400 mt-1">{shippingInfo.phone}</p>}
                  </div>
                </div>

                {/* Order Notes */}
                <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Order Notes (Optional)</h3>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions, delivery preferences..."
                    rows={3}
                    className="w-full px-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  disabled={isCreatingPaymentIntent}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingPaymentIntent ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Preparing Payment...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
              >
                <div className="p-6 border-b border-night-800/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Payment</h2>
                      <p className="text-sm text-slate-400">Secure checkout powered by Stripe</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {isStripeConfigured && clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'night',
                          variables: {
                            colorPrimary: '#84cc16',
                            colorBackground: '#0f172a',
                            colorText: '#f1f5f9',
                            colorDanger: '#ef4444',
                            fontFamily: 'system-ui, sans-serif',
                            borderRadius: '12px',
                          },
                        },
                      }}
                    >
                      <PaymentForm
                        clientSecret={clientSecret}
                        orderId={orderId}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </Elements>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-5 w-5 text-amber-400" />
                          <div>
                            <p className="text-sm font-medium text-amber-400">Demo Mode</p>
                            <p className="text-xs text-slate-400">
                              {!isStripeConfigured
                                ? 'Stripe not configured. This is a demo checkout.'
                                : 'No payment will be processed.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleDemoSubmit}>
                        <button
                          type="submit"
                          disabled={isCreatingPaymentIntent}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCreatingPaymentIntent ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="h-5 w-5" />
                              Place Order
                            </>
                          )}
                        </button>
                      </form>

                      <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                        <Lock className="h-3 w-3" />
                        Your information is secure and encrypted
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
              >
                <div className="p-6 border-b border-night-800/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Order Summary</h2>
                    <span className="px-2.5 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-semibold">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 space-y-4 max-h-72 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-night-800 border border-night-700/50 overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-600">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                        <p className="text-xs text-slate-500">Qty: {item.quantity ?? 1}</p>
                        <p className="text-sm font-semibold text-white mt-1">
                          {currency.format((item.price ?? 0) * (item.quantity ?? 1))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="p-6 bg-night-900/50 border-t border-night-800/50 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white font-medium">{currency.format(displayTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Shipping</span>
                    <span className={displayTotals.shipping === 0 ? 'text-lime-400 font-semibold' : 'text-white font-medium'}>
                      {displayTotals.shipping === 0 ? 'FREE' : currency.format(displayTotals.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax</span>
                    <span className="text-white font-medium">{currency.format(displayTotals.tax)}</span>
                  </div>
                  <div className="h-px bg-night-700/50 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-lime-400">{currency.format(displayTotals.total)}</span>
                  </div>
                </div>

                {/* User Info & Trust Badges */}
                <div className="p-6 border-t border-night-800/50 space-y-4">
                  {(user || guestEmail) && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{user?.email || guestEmail}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-night-800/30">
                      <Lock className="h-4 w-4 text-lime-400" />
                      <span className="text-[10px] text-slate-500 text-center">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-night-800/30">
                      <Truck className="h-4 w-4 text-cyan-400" />
                      <span className="text-[10px] text-slate-500 text-center">Fast Ship</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-night-800/30">
                      <Gift className="h-4 w-4 text-amber-400" />
                      <span className="text-[10px] text-slate-500 text-center">Returns</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
