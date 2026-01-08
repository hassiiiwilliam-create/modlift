import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAdminCheck } from '@/hooks/useAdminCheck'
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Mail,
  FileText,
  Image as ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react'

const statusConfig = {
  pending: {
    icon: Clock,
    class: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    label: 'Pending Review',
  },
  approved: {
    icon: CheckCircle,
    class: 'bg-lime-500/10 text-lime-400 border border-lime-500/30',
    label: 'Approved',
  },
  processing: {
    icon: Package,
    class: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    label: 'Processing',
  },
  completed: {
    icon: CheckCircle,
    class: 'bg-mint-500/10 text-mint-400 border border-mint-500/30',
    label: 'Completed',
  },
  rejected: {
    icon: XCircle,
    class: 'bg-coral-500/10 text-coral-400 border border-coral-500/30',
    label: 'Rejected',
  },
}

const reasonTypeLabels = {
  wrong_item: 'Received wrong item',
  damaged: 'Item arrived damaged',
  defective: 'Item is defective',
  not_as_described: 'Not as described',
  doesnt_fit: "Doesn't fit vehicle",
  changed_mind: 'Changed mind',
  other: 'Other',
}

function ImageModal({ images, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/90 backdrop-blur-sm p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-night-800 text-white hover:bg-night-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="rounded-2xl overflow-hidden bg-night-900">
          <img
            src={images[currentIndex]}
            alt={`Return photo ${currentIndex + 1}`}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-lime-500' : 'bg-night-700 hover:bg-night-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReturnCard({ item, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState(item.admin_notes || '')

  const status = statusConfig[item.status] || statusConfig.pending
  const StatusIcon = status.icon
  const hasPhotos = item.photo_urls && item.photo_urls.length > 0

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await onUpdateStatus(item.id, newStatus, adminNotes)
      toast.success(`Return ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-night-900/50 rounded-2xl border border-night-800/50 overflow-hidden"
      >
        {/* Header */}
        <div
          className="p-5 cursor-pointer hover:bg-night-800/30 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
                {hasPhotos && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-night-800 text-slate-400">
                    <ImageIcon className="h-3 w-3" />
                    {item.photo_urls.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <Mail className="h-4 w-4 text-slate-500" />
                {item.users?.email || 'Unknown user'}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {item.created_at ? formatDate(item.created_at) : 'Unknown date'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                {reasonTypeLabels[item.reason_type] || item.reason_type || 'Unknown reason'}
              </span>
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 border-t border-night-800/50 pt-4">
                {/* Order Info */}
                {item.order_id && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-lime-500" />
                    <span className="text-slate-400">Order:</span>
                    <span className="text-white font-mono">#{item.order_id.slice(0, 8)}...</span>
                  </div>
                )}

                {/* Reason */}
                <div className="p-4 rounded-xl bg-night-800/50">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <FileText className="h-4 w-4" />
                    Customer's Description
                  </div>
                  <p className="text-white">{item.reason || 'No description provided'}</p>
                  {item.notes && (
                    <p className="text-slate-400 text-sm mt-2">
                      <span className="font-medium">Additional notes:</span> {item.notes}
                    </p>
                  )}
                </div>

                {/* Photos */}
                {hasPhotos && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <ImageIcon className="h-4 w-4" />
                      Customer Photos ({item.photo_urls.length})
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {item.photo_urls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setShowImages(true)}
                          className="aspect-square rounded-lg overflow-hidden bg-night-800 hover:ring-2 hover:ring-lime-500 transition-all"
                        >
                          <img
                            src={url}
                            alt={`Return photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this return request..."
                    className="w-full h-20 rounded-xl bg-night-800/50 border border-night-700/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all resize-none text-sm"
                  />
                </div>

                {/* Actions */}
                {item.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={updating}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lime-500 text-night-950 font-semibold text-sm hover:bg-lime-400 transition-colors disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Approve Return
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={updating}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-coral-500/10 border border-coral-500/30 text-coral-400 font-semibold text-sm hover:bg-coral-500/20 transition-colors disabled:opacity-50"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Reject
                    </button>
                  </div>
                )}

                {item.status === 'approved' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleStatusUpdate('processing')}
                      disabled={updating}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold text-sm hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                    >
                      <Package className="h-4 w-4" />
                      Mark as Processing
                    </button>
                  </div>
                )}

                {item.status === 'processing' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={updating}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mint-500 text-night-950 font-semibold text-sm hover:bg-mint-400 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
      {showImages && hasPhotos && (
        <ImageModal images={item.photo_urls} onClose={() => setShowImages(false)} />
      )}
    </>
  )
}

export default function AdminReturnsPage() {
  const { loading: authLoading, isAdmin } = useAdminCheck()
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchReturns = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('returns')
      .select(
        `id, status, reason_type, reason, notes, photo_urls, admin_notes, order_id, created_at,
         users ( email )`
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load returns', error)
      setReturns([])
    } else {
      setReturns(data ?? [])
    }
    setLoading(false)
  }, [])

  const updateStatus = useCallback(
    async (id, status, adminNotes) => {
      const { error } = await supabase
        .from('returns')
        .update({ status, admin_notes: adminNotes })
        .eq('id', id)
      if (error) {
        console.error('Failed to update return status', error)
        throw error
      }
      fetchReturns()
    },
    [fetchReturns]
  )

  useEffect(() => {
    if (!isAdmin) return
    fetchReturns()
  }, [fetchReturns, isAdmin])

  // Filter returns
  const filteredReturns = returns.filter((item) => {
    const matchesFilter = filter === 'all' || item.status === filter
    const matchesSearch =
      !searchQuery ||
      item.users?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.order_id?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Stats
  const stats = {
    pending: returns.filter((r) => r.status === 'pending').length,
    approved: returns.filter((r) => r.status === 'approved').length,
    processing: returns.filter((r) => r.status === 'processing').length,
    completed: returns.filter((r) => r.status === 'completed').length,
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-coral-500/10 border border-coral-500/30 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-coral-400" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Returns</h1>
              <p className="text-slate-400">Review and process customer return requests</p>
            </div>
            <button
              onClick={fetchReturns}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-night-800 border border-night-700/50 text-white text-sm font-medium hover:bg-night-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-slate-400">Pending</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-lime-500/5 border border-lime-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10">
                <CheckCircle className="h-5 w-5 text-lime-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.approved}</p>
                <p className="text-sm text-slate-400">Approved</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Package className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.processing}</p>
                <p className="text-sm text-slate-400">Processing</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-mint-500/5 border border-mint-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-500/10">
                <CheckCircle className="h-5 w-5 text-mint-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
                <p className="text-sm text-slate-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by email, order ID, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white focus:border-lime-500 focus:outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Returns List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-night-800/50 border border-night-700/50 flex items-center justify-center">
              <RotateCcw className="h-8 w-8 text-slate-600" />
            </div>
            <p className="text-slate-400 mb-2">No return requests found</p>
            <p className="text-sm text-slate-500">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your filters'
                : 'Return requests will appear here when customers submit them'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReturns.map((item) => (
              <ReturnCard key={item.id} item={item} onUpdateStatus={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
