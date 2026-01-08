import { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'
import { supabase } from '../supabaseClient'

const initialFormState = {
  orderId: '',
  reason: '',
  notes: '',
}

export default function ReturnRequestForm() {
  const { user } = useContext(AppContext)
  const [formState, setFormState] = useState(initialFormState)
  const [files, setFiles] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const hasOrders = orders.length > 0

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      setLoadingOrders(true)
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, status, created_at, total_price')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (error) throw error
        setOrders(data ?? [])
      } catch (err) {
        console.error(err)
        toast.error('Unable to load orders for returns.')
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const nextFiles = Array.from(event.target.files ?? [])
    setFiles(nextFiles)
  }

  const resetForm = () => {
    setFormState(initialFormState)
    setFiles([])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!hasOrders) {
      toast.error('No eligible orders found.')
      return
    }
    if (!formState.orderId || !formState.reason.trim()) {
      toast.error('Please select an order and share a reason for the return.')
      return
    }

    setSubmitLoading(true)
    try {
      // Placeholder for future API integration.
      console.info('Return request payload', {
        ...formState,
        files,
        userId: user?.id,
      })
      toast.success('Return request submitted. We\'ll be in touch soon.')
      resetForm()
    } catch (err) {
      console.error(err)
      toast.error('We could not submit your return. Try again later.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const orderOptions = useMemo(() => {
    return orders.map((order) => {
      const createdAt = order.created_at
        ? new Date(order.created_at).toLocaleDateString()
        : 'Unknown date'
      const total =
        typeof order.total_price === 'number'
          ? `$${order.total_price.toFixed(2)}`
          : '—'
      const status = order.status ? order.status.replace(/-/g, ' ') : 'Processing'
      return {
        value: order.id,
        label: `Order ${order.id.slice(0, 8)} • ${createdAt} • ${status} • ${total}`,
      }
    })
  }, [orders])

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border rounded-2xl shadow-sm p-6"
    >
      <div className="space-y-1">
        <label className="block text-sm font-medium text-neutral-700">
          Select an order
        </label>
        <select
          name="orderId"
          value={formState.orderId}
          onChange={handleChange}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-neutral-100"
          disabled={loadingOrders || !hasOrders}
        >
          <option value="" disabled>
            {loadingOrders
              ? 'Loading orders...'
              : hasOrders
              ? 'Choose an order to return'
              : 'No orders available'}
          </option>
          {orderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="reason" className="block text-sm font-medium text-neutral-700">
          Reason for return
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formState.reason}
          onChange={handleChange}
          className="w-full h-24 rounded-xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Tell us what went wrong with your order"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
          Additional notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formState.notes}
          onChange={handleChange}
          className="w-full h-24 rounded-xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Share any helpful context or preferences"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          Upload photos (optional)
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-white hover:file:opacity-90"
        />
        {files.length > 0 && (
          <p className="text-xs text-neutral-500">
            {files.length} {files.length === 1 ? 'file' : 'files'} attached
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center w-full rounded-xl bg-black px-5 py-3 text-white font-medium transition hover:opacity-90 disabled:opacity-60"
        disabled={submitLoading || (!hasOrders && !loadingOrders)}
      >
        {submitLoading ? 'Submitting…' : 'Submit Return'}
      </button>
    </form>
  )
}
