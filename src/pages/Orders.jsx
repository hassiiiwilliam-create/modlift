import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  ShoppingBag,
  Loader2,
  Receipt,
} from 'lucide-react'

const statusConfig = {
  pending: {
    icon: Clock,
    class: 'order-status order-status-pending',
    label: 'Pending',
  },
  processing: {
    icon: Package,
    class: 'order-status order-status-processing',
    label: 'Processing',
  },
  shipped: {
    icon: Truck,
    class: 'order-status order-status-shipped',
    label: 'Shipped',
  },
  delivered: {
    icon: CheckCircle2,
    class: 'order-status order-status-delivered',
    label: 'Delivered',
  },
  cancellation_requested: {
    icon: Clock,
    class: 'order-status order-status-pending',
    label: 'Cancellation Pending',
  },
  cancelled: {
    icon: XCircle,
    class: 'order-status order-status-cancelled',
    label: 'Cancelled',
  },
  payment_failed: {
    icon: XCircle,
    class: 'order-status order-status-cancelled',
    label: 'Payment Failed',
  },
  refunded: {
    icon: XCircle,
    class: 'order-status order-status-cancelled',
    label: 'Refunded',
  },
}

export default function Orders() {
  const { user } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, total_price, status, tracking_number, carrier, shipped_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to load orders.')
      } else {
        setOrders(data)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [user])

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
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-10 w-10 text-lime-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your orders...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/20">
              <Receipt className="h-7 w-7 text-night-950" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Orders</h1>
              <p className="text-slate-400 text-sm">
                {orders.length} order{orders.length !== 1 ? 's' : ''} placed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-night-800 border border-night-700 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              When you place orders, they'll appear here for easy tracking and management.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 transition-colors">
              Start Shopping
              <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/order/${order.id}`}
                    className="block p-5 rounded-2xl bg-night-900/80 border border-night-800 hover:border-lime-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-night-800 border border-night-700 group-hover:border-lime-500/30 transition-colors">
                          <Package className="h-6 w-6 text-slate-400 group-hover:text-lime-400 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white group-hover:text-lime-400 transition-colors truncate">
                            Order #{order.id.slice(0, 8)}...
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Status & Price */}
                      <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                        <span className={`hidden sm:inline-flex ${status.class}`}>
                          <StatusIcon className="h-4 w-4" />
                          {status.label}
                        </span>
                        <p className="font-bold text-white whitespace-nowrap">
                          {formatPrice(order.total_price)}
                        </p>
                        <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    {order.tracking_number && order.status === 'shipped' && (
                      <p className="text-xs text-lime-400 mt-3 flex items-center gap-1 pl-16">
                        <Truck className="h-3 w-3" />
                        {order.carrier || 'Tracking'}: {order.tracking_number}
                      </p>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Help Section */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 rounded-2xl bg-night-900/60 border border-night-800 p-6"
          >
            <h3 className="font-semibold text-white mb-2">Need help with an order?</h3>
            <p className="text-slate-400 text-sm mb-4">
              Our support team is ready to assist with any questions about your orders, shipping, or returns.
            </p>
            <Link to="/contact" className="text-lime-400 hover:text-lime-300 text-sm font-medium transition-colors">
              Contact Support →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
