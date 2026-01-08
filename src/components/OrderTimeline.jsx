import { motion } from 'framer-motion'
import {
  Clock,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

const timelineSteps = [
  { key: 'pending', icon: Clock, label: 'Order Placed' },
  { key: 'processing', icon: Package, label: 'Processing' },
  { key: 'shipped', icon: Truck, label: 'Shipped' },
  { key: 'delivered', icon: CheckCircle2, label: 'Delivered' },
]

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

export default function OrderTimeline({ order }) {
  if (!order) return null

  // Handle cancelled/refunded orders differently
  if (order.status === 'cancelled' || order.status === 'refunded') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-redline-500/10 border border-redline-500/30">
        <XCircle className="h-6 w-6 text-redline-500" />
        <div>
          <p className="font-medium text-redline-400">
            Order {order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}
          </p>
          <p className="text-sm text-steel-400">
            {order.status === 'cancelled'
              ? 'This order has been cancelled'
              : 'This order has been refunded'}
          </p>
        </div>
      </div>
    )
  }

  // Handle payment failed
  if (order.status === 'payment_failed') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-redline-500/10 border border-redline-500/30">
        <CreditCard className="h-6 w-6 text-redline-500" />
        <div>
          <p className="font-medium text-redline-400">Payment Failed</p>
          <p className="text-sm text-steel-400">
            There was an issue processing your payment
          </p>
        </div>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(order.status)

  const formatDateTime = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get timestamps for each step
  const getStepTime = (stepKey) => {
    switch (stepKey) {
      case 'pending':
        return formatDateTime(order.created_at)
      case 'processing':
        return formatDateTime(order.paid_at)
      case 'shipped':
        return formatDateTime(order.shipped_at)
      case 'delivered':
        return formatDateTime(order.delivered_at)
      default:
        return null
    }
  }

  return (
    <div className="space-y-0">
      {timelineSteps.map((step, index) => {
        const StepIcon = step.icon
        const stepIndex = statusOrder.indexOf(step.key)
        const isCompleted = stepIndex < currentStatusIndex
        const isCurrent = stepIndex === currentStatusIndex
        const isPending = stepIndex > currentStatusIndex
        const isLast = index === timelineSteps.length - 1
        const timestamp = getStepTime(step.key)

        return (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            {/* Timeline line */}
            {!isLast && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 ${
                  isCompleted ? 'bg-volt-500' : 'bg-steel-700'
                }`}
              />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isCompleted
                  ? 'border-volt-500 bg-volt-500 text-white'
                  : isCurrent
                  ? 'border-flame-500 bg-flame-500 text-white animate-pulse'
                  : 'border-steel-700 bg-steel-900 text-steel-600'
              }`}
            >
              <StepIcon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`font-medium ${
                  isCompleted || isCurrent ? 'text-white' : 'text-steel-500'
                }`}
              >
                {step.label}
              </p>
              {timestamp && (isCompleted || isCurrent) && (
                <p className="text-sm text-steel-400 mt-0.5">{timestamp}</p>
              )}
              {isCurrent && !timestamp && (
                <p className="text-sm text-flame-400 mt-0.5">In progress...</p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
