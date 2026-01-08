import { useEffect, useState, useContext, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { AppContext } from '../App'
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Mail,
  MapPin,
  FileText,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ImageOff,
  ExternalLink,
  Copy,
} from 'lucide-react'
import OrderTimeline from '../components/OrderTimeline'

const statusConfig = {
  pending: {
    icon: Clock,
    class: 'order-status order-status-pending',
    label: 'Pending',
    description: 'Your order is being reviewed',
  },
  processing: {
    icon: Package,
    class: 'order-status order-status-processing',
    label: 'Processing',
    description: 'Your order is being prepared',
  },
  shipped: {
    icon: Truck,
    class: 'order-status order-status-shipped',
    label: 'Shipped',
    description: 'Your order is on its way',
  },
  delivered: {
    icon: CheckCircle2,
    class: 'order-status order-status-delivered',
    label: 'Delivered',
    description: 'Your order has been delivered',
  },
  cancelled: {
    icon: XCircle,
    class: 'order-status order-status-cancelled',
    label: 'Cancelled',
    description: 'This order was cancelled',
  },
  payment_failed: {
    icon: XCircle,
    class: 'order-status order-status-cancelled',
    label: 'Payment Failed',
    description: 'There was an issue processing your payment',
  },
  refunded: {
    icon: XCircle,
    class: 'order-status order-status-cancelled',
    label: 'Refunded',
    description: 'This order has been refunded',
  },
}

const carrierTrackingUrls = {
  usps: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
  ups: 'https://www.ups.com/track?tracknum=',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr=',
  dhl: 'https://www.dhl.com/us-en/home/tracking.html?tracking-id=',
}

export default function OrderDetail() {
  const { id } = useParams()
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const addressText = useMemo(() => {
    const value = order?.shipping_address
    if (!value) return null
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      const { name, line1, line2, city, state: stateCode, zip, country, phone } = value
      return { name, line1, line2, city, state: stateCode, zip, country, phone }
    }
    return String(value)
  }, [order])

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user?.id || !id) return

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      const { data: itemData, error: itemError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)

      if (orderError || itemError) {
        toast.error('Failed to load order details.')
        return
      }

      setOrder(orderData)
      setItems(itemData)
      setLoading(false)
    }

    fetchOrderDetails()
  }, [user, id])

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    setCancelling(true)
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) {
      toast.error('Cancel failed.')
      setCancelling(false)
    } else {
      toast.success('Order cancelled.')
      navigate('/orders')
    }
  }

  const handleDownloadReceipt = () => {
    const addressString = typeof addressText === 'object'
      ? [addressText.name, addressText.line1, addressText.line2, `${addressText.city}, ${addressText.state} ${addressText.zip}`, addressText.country].filter(Boolean).join('\n')
      : addressText || 'N/A'

    const lines = [
      '═══════════════════════════════════════',
      '           MODLIFT RECEIPT',
      '═══════════════════════════════════════',
      '',
      `Order ID: ${order.id}`,
      `Date: ${new Date(order.created_at).toLocaleDateString()}`,
      `Status: ${order.status.toUpperCase()}`,
      '',
      '───────────────────────────────────────',
      'ITEMS',
      '───────────────────────────────────────',
      ...items.map((item, i) =>
        `${i + 1}. ${item.title || 'Build'}\n   $${item.price?.toFixed(2)}`
      ),
      '',
      '───────────────────────────────────────',
      `TOTAL: $${order.total_price?.toFixed(2)}`,
      '───────────────────────────────────────',
      '',
      'SHIPPING ADDRESS:',
      addressString,
      '',
      order.order_notes ? `NOTES: ${order.order_notes}` : '',
      '',
      '═══════════════════════════════════════',
      '        Thank you for your order!',
      '═══════════════════════════════════════',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `modlift-receipt-${order.id.slice(0, 8)}.txt`
    link.click()
  }

  const handleSendEmail = async () => {
    try {
      if (!user?.email) {
        toast.error('No email associated with this account.')
        return
      }

      const response = await fetch('https://uoaaiyzycbufdnptrluc.functions.supabase.co/send-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          email: user.email,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Receipt emailed successfully!')
      } else {
        toast.error(result?.error || 'Failed to send receipt.')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred while sending the email.')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-10 w-10 text-flame-500 animate-spin mx-auto mb-4" />
          <p className="text-steel-400">Loading order details...</p>
        </motion.div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-redline-500/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-redline-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
          <p className="text-steel-400 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/orders" className="btn-primary">
            <ArrowLeft className="h-5 w-5" />
            Back to Orders
          </Link>
        </motion.div>
      </div>
    )
  }

  const status = statusConfig[order.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-steel-500 mb-8"
        >
          <Link to="/orders" className="hover:text-white transition-colors">Orders</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-steel-400">Order #{order.id.slice(0, 8)}...</span>
        </motion.nav>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-steel-900/60 border border-steel-800/50 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Order #{order.id.slice(0, 8)}...
                  </h1>
                  <p className="text-steel-400 text-sm">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <span className={status.class}>
                  <StatusIcon className="h-4 w-4" />
                  {status.label}
                </span>
              </div>

              {/* Order Timeline */}
              <OrderTimeline order={order} />

              {/* Tracking Info */}
              {order.tracking_number && (order.status === 'shipped' || order.status === 'delivered') && (
                <div className="mt-6 p-4 rounded-xl bg-volt-500/10 border border-volt-500/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-volt-500" />
                      <div>
                        <p className="font-medium text-white">
                          {order.carrier?.toUpperCase() || 'Carrier'} Tracking
                        </p>
                        <p className="text-sm text-volt-400 font-mono">{order.tracking_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.tracking_number)
                          toast.success('Tracking number copied!')
                        }}
                        className="p-2 rounded-lg bg-steel-800/50 hover:bg-steel-800 text-steel-400 hover:text-white transition-colors"
                        title="Copy tracking number"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {order.carrier && carrierTrackingUrls[order.carrier.toLowerCase()] && (
                        <a
                          href={`${carrierTrackingUrls[order.carrier.toLowerCase()]}${order.tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-volt-500/20 hover:bg-volt-500/30 text-volt-400 hover:text-volt-300 transition-colors"
                          title="Track package"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-steel-900/60 border border-steel-800/50 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-flame-500" />
                Items ({items.length})
              </h2>
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl bg-steel-800/30 border border-steel-700/30"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-steel-800 flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title || 'Build'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff className="h-8 w-8 text-steel-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {item.title || `Item ${i + 1}`}
                      </p>
                      <p className="text-sm text-steel-400 mt-1">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping & Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {/* Shipping Address */}
              <div className="rounded-2xl bg-steel-900/60 border border-steel-800/50 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-volt-500" />
                  Shipping Address
                </h2>
                {addressText ? (
                  typeof addressText === 'object' ? (
                    <div className="space-y-1 text-steel-300 text-sm">
                      {addressText.name && <p className="font-medium text-white">{addressText.name}</p>}
                      {addressText.line1 && <p>{addressText.line1}</p>}
                      {addressText.line2 && <p>{addressText.line2}</p>}
                      {(addressText.city || addressText.state || addressText.zip) && (
                        <p>{[addressText.city, addressText.state, addressText.zip].filter(Boolean).join(', ')}</p>
                      )}
                      {addressText.country && <p>{addressText.country}</p>}
                      {addressText.phone && <p className="text-steel-500 mt-2">{addressText.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-steel-300 text-sm">{addressText}</p>
                  )
                ) : (
                  <p className="text-steel-500 text-sm">No address provided</p>
                )}
              </div>

              {/* Order Notes */}
              <div className="rounded-2xl bg-steel-900/60 border border-steel-800/50 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-torque-500" />
                  Order Notes
                </h2>
                <p className="text-steel-300 text-sm">
                  {order.order_notes || 'No notes provided'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-steel-900/60 border border-steel-800/50 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-steel-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total_price)}</span>
                </div>
                <div className="flex justify-between text-steel-400">
                  <span>Shipping</span>
                  <span className="text-torque-400">Free</span>
                </div>
                <div className="h-px bg-steel-800 my-4" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total_price)}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-steel-900/60 border border-steel-800/50 p-6 space-y-3"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>

              <button
                onClick={handleDownloadReceipt}
                className="btn-secondary w-full"
              >
                <Download className="h-5 w-5" />
                Download Receipt
              </button>

              <button
                onClick={handleSendEmail}
                className="btn-secondary w-full"
              >
                <Mail className="h-5 w-5" />
                Email Receipt
              </button>

              {order.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="btn-danger w-full"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      Cancel Order
                    </>
                  )}
                </button>
              )}
            </motion.div>

            {/* Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl bg-steel-900/40 border border-steel-800/50 p-5"
            >
              <p className="text-sm text-steel-400 mb-3">
                Questions about this order?
              </p>
              <Link to="/support" className="text-flame-400 hover:text-flame-300 text-sm font-medium transition-colors">
                Contact Support →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
