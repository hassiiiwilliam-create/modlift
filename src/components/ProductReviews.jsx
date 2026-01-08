import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { AppContext } from '../App'
import {
  Star,
  User,
  CheckCircle,
  ChevronDown,
  MessageSquare,
  Loader2,
} from 'lucide-react'

export default function ProductReviews({ productId }) {
  const { user } = useContext(AppContext)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Form state
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)

  // Get user's display name from metadata
  const userDisplayName = user?.user_metadata?.display_name
    || (user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name.charAt(0)}.`
      : null)

  useEffect(() => {
    fetchReviews()
  }, [productId, sortBy])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'highest') {
        query = query.order('rating', { ascending: false })
      } else if (sortBy === 'lowest') {
        query = query.order('rating', { ascending: true })
      }

      const { data, error } = await query

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in to leave a review')
      return
    }

    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        product_id: productId,
        rating,
        reviewer_name: userDisplayName || 'Customer',
        title: title.trim(),
        content: content.trim(),
        status: 'approved', // Auto-approve for now
      })

      if (error) throw error

      toast.success('Review submitted successfully!')
      setShowForm(false)
      setRating(5)
      setTitle('')
      setContent('')
      fetchReviews() // Refresh reviews
    } catch (err) {
      console.error('Error submitting review:', err)
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
      : 0,
  }))

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
            {reviews.length > 0 && (
              <p className="text-sm text-slate-400">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl bg-night-800 border border-night-700 text-white font-medium hover:bg-night-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 rounded-2xl bg-night-900/60 border border-night-800/50 p-6">
          {/* Average Rating */}
          <div className="text-center md:border-r md:border-night-800/50">
            <div className="text-5xl font-bold text-white mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(parseFloat(averageRating))
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-night-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3 text-sm">
                <span className="text-slate-400 w-12">{stars} star</span>
                <div className="flex-1 h-2 bg-night-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-slate-500 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="rounded-2xl bg-night-900/60 border border-night-800/50 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Write Your Review</h3>
              {userDisplayName && (
                <span className="text-sm text-slate-400">Posting as <span className="text-lime-400">{userDisplayName}</span></span>
              )}
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-night-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Review Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your review"
                className="w-full px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder-slate-500 focus:border-lime-500/50 focus:ring-2 focus:ring-lime-500/20 outline-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Your Review</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder-slate-500 focus:border-lime-500/50 focus:ring-2 focus:ring-lime-500/20 outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl bg-night-800 border border-night-700 text-white font-medium hover:bg-night-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Sort & Reviews List */}
      {reviews.length > 0 && (
        <>
          <div className="flex justify-end">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 rounded-lg bg-night-800/50 border border-night-700/50 text-white text-sm focus:border-lime-500/50 outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl bg-night-900/40 border border-night-800/50 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-night-800 flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{review.reviewer_name || 'Customer'}</span>
                        {review.is_verified_purchase && (
                          <span className="flex items-center gap-1 text-xs text-lime-400">
                            <CheckCircle className="h-3 w-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-night-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-white mb-2">{review.title}</h4>
                )}
                {review.content && (
                  <p className="text-slate-300 text-sm leading-relaxed">{review.content}</p>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-night-900/40 border border-night-800/50">
          <MessageSquare className="h-12 w-12 text-night-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No reviews yet</h3>
          <p className="text-slate-400 mb-4">Be the first to review this product</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 transition-colors"
          >
            Write a Review
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
        </div>
      )}
    </div>
  )
}
