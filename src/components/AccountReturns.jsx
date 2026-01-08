import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/lib/useUser'
import { supabase } from '@/lib/supabase'
import {
  RefreshCw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RotateCcw,
  FileText,
} from 'lucide-react'

const statusConfig = {
  pending: {
    icon: Clock,
    class: 'bg-volt-500/10 text-volt-400 border border-volt-500/30',
    label: 'Pending',
  },
  approved: {
    icon: CheckCircle2,
    class: 'bg-torque-500/10 text-torque-400 border border-torque-500/30',
    label: 'Approved',
  },
  processing: {
    icon: Package,
    class: 'bg-flame-500/10 text-flame-400 border border-flame-500/30',
    label: 'Processing',
  },
  completed: {
    icon: CheckCircle2,
    class: 'bg-torque-500/10 text-torque-400 border border-torque-500/30',
    label: 'Completed',
  },
  rejected: {
    icon: XCircle,
    class: 'bg-redline-500/10 text-redline-400 border border-redline-500/30',
    label: 'Rejected',
  },
}

export default function AccountReturns() {
  const { user } = useUser()
  const userId = user?.id

  const {
    data: returns = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-returns', userId],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from('returns')
        .select('id, status, reason, notes, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (queryError) throw queryError
      return data ?? []
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  let content

  if (!userId) {
    content = (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-steel-800/50 border border-steel-700/50 flex items-center justify-center">
          <RefreshCw className="h-7 w-7 text-steel-600" />
        </div>
        <p className="text-steel-400 text-sm">Sign in to view your returns history.</p>
      </div>
    )
  } else if (isLoading) {
    content = (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-flame-500 animate-spin" />
      </div>
    )
  } else if (isError) {
    const message = error instanceof Error ? error.message : 'Unable to load returns.'
    content = (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-redline-500/10 border border-redline-500/30 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-redline-400" />
        </div>
        <p className="text-redline-400 text-sm mb-4">{message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="btn-secondary text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    )
  } else if (!returns || returns.length === 0) {
    content = (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-steel-800/50 border border-steel-700/50 flex items-center justify-center">
          <Package className="h-7 w-7 text-steel-600" />
        </div>
        <p className="text-steel-400 text-sm">No returns yet.</p>
      </div>
    )
  } else {
    content = (
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {returns.map((returnRequest, index) => {
            const status = statusConfig[returnRequest.status] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <motion.div
                key={returnRequest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-steel-800/30 border border-steel-700/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.class}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </div>

                    <p className="text-white text-sm font-medium mb-1">
                      {returnRequest.reason || 'Return Request'}
                    </p>

                    <p className="text-steel-500 text-xs">
                      Submitted on {returnRequest.created_at ? formatDate(returnRequest.created_at) : 'Unknown'}
                    </p>

                    {returnRequest.notes && (
                      <div className="mt-3 p-3 rounded-lg bg-steel-900/50 border border-steel-800/50">
                        <div className="flex items-center gap-2 text-steel-400 text-xs mb-1">
                          <FileText className="h-3.5 w-3.5" />
                          Notes
                        </div>
                        <p className="text-steel-300 text-sm">{returnRequest.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </AnimatePresence>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500/10 border border-flame-500/30">
          <RefreshCw className="h-5 w-5 text-flame-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Your Returns</h3>
          <p className="text-sm text-steel-500">Track the status of any return requests.</p>
        </div>
      </div>
      {content}
    </div>
  )
}
