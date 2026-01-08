import { useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'
import { supabase } from '../supabaseClient'
import {
  RotateCcw,
  Package,
  X,
  Image as ImageIcon,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Camera,
  FileText,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react'

const returnReasons = [
  { value: '', label: 'Select a reason' },
  { value: 'wrong_item', label: 'Received wrong item' },
  { value: 'damaged', label: 'Item arrived damaged' },
  { value: 'defective', label: 'Item is defective' },
  { value: 'not_as_described', label: 'Not as described' },
  { value: 'doesnt_fit', label: "Doesn't fit my vehicle" },
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'other', label: 'Other' },
]

const initialFormState = {
  orderId: '',
  reasonType: '',
  reason: '',
  notes: '',
}

export default function AccountReturnsPage() {
  const { user } = useContext(AppContext)
  const [formState, setFormState] = useState(initialFormState)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Select Order, 2: Reason & Photos, 3: Review
  const [selectedOrder, setSelectedOrder] = useState(null)

  const hasOrders = orders.length > 0
  const photosRequired = true // Photos are now required
  const hasPhotos = files.length > 0
  const minPhotosRequired = 1

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      setLoadingOrders(true)
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, status, created_at, total_price, items')
          .eq('user_id', user.id)
          .in('status', ['delivered', 'shipped', 'processing']) // Only returnable orders
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

  // Create previews when files change
  useEffect(() => {
    if (files.length === 0) {
      setPreviews([])
      return
    }

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)

    // Cleanup
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [files])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files ?? [])
    if (newFiles.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed')
      return
    }
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setFormState(initialFormState)
    setFiles([])
    setPreviews([])
    setStep(1)
    setSelectedOrder(null)
  }

  const selectOrder = (order) => {
    setSelectedOrder(order)
    setFormState(prev => ({ ...prev, orderId: order.id }))
    setStep(2)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formState.orderId) {
      toast.error('Please select an order')
      return
    }
    if (!formState.reasonType) {
      toast.error('Please select a reason for your return')
      return
    }
    if (!formState.reason.trim()) {
      toast.error('Please describe the issue in detail')
      return
    }
    if (photosRequired && files.length < minPhotosRequired) {
      toast.error(`Please upload at least ${minPhotosRequired} photo of the item`)
      return
    }

    setSubmitLoading(true)
    try {
      // Upload photos to storage
      const photoUrls = []
      for (const file of files) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('return-photos')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          // Continue even if upload fails, we'll store what we can
        } else if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('return-photos')
            .getPublicUrl(uploadData.path)
          if (urlData?.publicUrl) {
            photoUrls.push(urlData.publicUrl)
          }
        }
      }

      // Insert return request
      const { error: insertError } = await supabase
        .from('returns')
        .insert({
          user_id: user.id,
          order_id: formState.orderId,
          reason_type: formState.reasonType,
          reason: formState.reason.trim(),
          notes: formState.notes.trim() || null,
          photo_urls: photoUrls,
          status: 'pending',
        })

      if (insertError) throw insertError

      toast.success('Return request submitted successfully!')
      resetForm()
    } catch (err) {
      console.error(err)
      toast.error('We could not submit your return. Please try again.')
    } finally {
      setSubmitLoading(false)
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
      month: 'short',
      day: 'numeric',
    })
  }

  // Guest view
  if (!user) {
    return (
      <div className="min-h-screen bg-night-950 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
                <RotateCcw className="h-8 w-8 text-night-950" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Returns & Exchanges</h1>
            <p className="text-slate-400">Sign in to submit and track your return requests.</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-8 text-center">
            <p className="text-slate-400 mb-6">
              Already purchased with ModLift? Access your account to get started.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-bold transition-all hover:bg-lime-400"
            >
              Sign in to continue
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/account"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-lime-400 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
            <RotateCcw className="h-7 w-7 text-night-950" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Returns & Exchanges</h1>
            <p className="text-slate-400 text-sm">Submit a return request for your order</p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50">
          {[
            { num: 1, label: 'Select Order' },
            { num: 2, label: 'Details & Photos' },
            { num: 3, label: 'Review' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-3 ${step >= s.num ? 'text-lime-400' : 'text-slate-500'}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                  step > s.num
                    ? 'bg-lime-500 text-night-950'
                    : step === s.num
                    ? 'bg-lime-500/20 text-lime-400 border-2 border-lime-500'
                    : 'bg-night-800 text-slate-500'
                }`}>
                  {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
                </div>
                <span className="hidden sm:block font-medium">{s.label}</span>
              </div>
              {i < 2 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-4 ${step > s.num ? 'bg-lime-500' : 'bg-night-800'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Select Order */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-lime-500 via-lime-400 to-lime-500" />
                  <div className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Select an Order to Return</h2>

                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
                    </div>
                  ) : !hasOrders ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-night-800/50 border border-night-700/50 flex items-center justify-center">
                        <Package className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="text-slate-400 mb-2">No eligible orders found</p>
                      <p className="text-sm text-slate-500">
                        Only delivered or shipped orders can be returned.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <button
                          key={order.id}
                          type="button"
                          onClick={() => selectOrder(order)}
                          className="w-full p-4 rounded-xl bg-night-800/30 border border-night-700/30 hover:border-lime-500/30 hover:bg-night-800/50 transition-all text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white group-hover:text-lime-400 transition-colors">
                                Order #{order.id.slice(0, 8)}...
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {formatDate(order.created_at)} • {order.status}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-semibold">{formatPrice(order.total_price)}</span>
                              <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-lime-400 transition-colors" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Reason & Photos */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Selected Order Summary */}
                {selectedOrder && (
                  <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10">
                          <Package className="h-5 w-5 text-lime-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Order #{selectedOrder.id.slice(0, 8)}...</p>
                          <p className="text-sm text-slate-500">{formatDate(selectedOrder.created_at)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-lime-400 hover:text-lime-300 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* Reason Selection */}
                <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Reason for Return <span className="text-coral-400">*</span>
                    </label>
                    <select
                      name="reasonType"
                      value={formState.reasonType}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-night-800/50 border border-night-700/50 px-4 py-3 text-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                      required
                    >
                      {returnReasons.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Describe the Issue <span className="text-coral-400">*</span>
                    </label>
                    <textarea
                      name="reason"
                      value={formState.reason}
                      onChange={handleChange}
                      className="w-full h-28 rounded-xl bg-night-800/50 border border-night-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all resize-none"
                      placeholder="Please provide details about why you're returning this item..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formState.notes}
                      onChange={handleChange}
                      className="w-full h-20 rounded-xl bg-night-800/50 border border-night-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all resize-none"
                      placeholder="Any preferences for exchange, refund method, etc."
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Upload Photos <span className="text-coral-400">*</span>
                      </label>
                      <p className="text-sm text-slate-500">
                        At least {minPhotosRequired} photo required. Show the issue clearly.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Max 5 photos
                    </div>
                  </div>

                  {/* Photo Previews */}
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-night-800 group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-night-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-coral-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  {files.length < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-night-700 hover:border-lime-500/50 bg-night-800/30 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 mb-3">
                          <Camera className="h-6 w-6 text-lime-500" />
                        </div>
                        <p className="text-sm text-slate-400">
                          <span className="text-lime-400 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Photo Requirement Warning */}
                  {!hasPhotos && (
                    <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-coral-500/10 border border-coral-500/20">
                      <AlertCircle className="h-4 w-4 text-coral-400 flex-shrink-0" />
                      <p className="text-sm text-coral-300">
                        Photos are required to process your return request.
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 rounded-xl bg-night-800 border border-night-700/50 text-white font-medium hover:bg-night-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formState.reasonType) {
                        toast.error('Please select a reason for your return')
                        return
                      }
                      if (!formState.reason.trim()) {
                        toast.error('Please describe the issue')
                        return
                      }
                      if (!hasPhotos) {
                        toast.error('Please upload at least one photo')
                        return
                      }
                      setStep(3)
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-bold hover:bg-lime-400 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-lime-500 via-lime-400 to-lime-500" />
                  <div className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-6">Review Your Return Request</h2>

                  <div className="space-y-6">
                    {/* Order */}
                    <div className="flex items-start gap-4 pb-4 border-b border-night-800/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 flex-shrink-0">
                        <Package className="h-5 w-5 text-lime-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Order</p>
                        <p className="font-medium text-white">#{selectedOrder?.id.slice(0, 8)}...</p>
                        <p className="text-sm text-slate-500">{selectedOrder && formatDate(selectedOrder.created_at)}</p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="flex items-start gap-4 pb-4 border-b border-night-800/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 flex-shrink-0">
                        <FileText className="h-5 w-5 text-lime-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Reason</p>
                        <p className="font-medium text-white">
                          {returnReasons.find(r => r.value === formState.reasonType)?.label}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">{formState.reason}</p>
                        {formState.notes && (
                          <p className="text-sm text-slate-500 mt-2">Notes: {formState.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Photos */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="h-5 w-5 text-lime-500" />
                        <p className="text-sm text-slate-400">{files.length} photo{files.length !== 1 ? 's' : ''} attached</p>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {previews.map((preview, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden bg-night-800">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-lime-500/20 p-6">
                  <h3 className="font-semibold text-white mb-3">What happens next?</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-lime-500 mt-0.5 flex-shrink-0" />
                      Our team will review your request within 1-2 business days
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-lime-500 mt-0.5 flex-shrink-0" />
                      Once approved, you'll receive a prepaid shipping label via email
                    </li>
                    <li className="flex items-start gap-2">
                      <RotateCcw className="h-4 w-4 text-lime-500 mt-0.5 flex-shrink-0" />
                      Refunds are processed within 3-5 business days after we receive the item
                    </li>
                  </ul>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 rounded-xl bg-night-800 border border-night-700/50 text-white font-medium hover:bg-night-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-bold hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Return Request
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Help Section */}
        <div className="mt-8 text-center p-4 rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50">
          <p className="text-sm text-slate-400">
            Need help or have an urgent issue?{' '}
            <Link to="/contact" className="text-lime-400 hover:text-lime-300 transition-colors font-medium">
              Contact Support
            </Link>{' '}
            or email{' '}
            <a href="mailto:support@modlift.us" className="text-lime-400 hover:text-lime-300 transition-colors font-medium">
              support@modlift.us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
