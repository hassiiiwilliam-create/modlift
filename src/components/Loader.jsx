import { motion } from 'framer-motion'
import { ModLiftIcon } from './ModLiftLogo'

export default function Loader({ text = 'Loading...', fullScreen = true }) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-night-950/95 backdrop-blur-sm'
    : 'flex items-center justify-center py-24'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-flex mb-6"
        >
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(132, 204, 22, 0.3), transparent)',
            }}
          />

          {/* Pulsing Glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-lime-500/20 blur-xl"
          />

          {/* Main Icon Container */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ModLiftIcon size={80} />
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <p className="text-sm font-medium text-slate-400">{text}</p>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-2 h-2 rounded-full bg-lime-500"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Inline Loader for smaller sections
export function InlineLoader({ size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} rounded-full border-2 border-night-700 border-t-lime-500`}
    />
  )
}

// Skeleton Loader
export function SkeletonLoader({ className = '' }) {
  return (
    <div className={`skeleton ${className}`} />
  )
}
