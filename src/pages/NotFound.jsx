import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'
import { ModLiftIcon } from '../components/ModLiftLogo'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-auth-gradient">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-flame-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-volt-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-8"
        >
          {/* Large 404 Text */}
          <div className="relative">
            <span className="text-[12rem] md:text-[16rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-steel-700 to-steel-900 select-none">
              404
            </span>

            {/* Glowing Overlay */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 text-[12rem] md:text-[16rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-flame-500/30 to-transparent select-none"
            >
              404
            </motion.span>
          </div>

          {/* Floating Icon */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <ModLiftIcon size={96} />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Off the Beaten Path
          </h1>
          <p className="text-lg text-steel-400 max-w-md mx-auto">
            Looks like this trail doesn't exist. Let's get you back on track to find the perfect parts for your build.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/" className="btn-primary">
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link to="/shop" className="btn-secondary">
            <Search className="h-5 w-5" />
            Browse Shop
          </Link>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-steel-800/50"
        >
          <p className="text-sm text-steel-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/shop?category=lift_kits" className="text-steel-400 hover:text-flame-400 transition-colors">
              Lift Kits
            </Link>
            <span className="text-steel-700">•</span>
            <Link to="/shop?category=wheels" className="text-steel-400 hover:text-flame-400 transition-colors">
              Wheels
            </Link>
            <span className="text-steel-700">•</span>
            <Link to="/shop?category=tires" className="text-steel-400 hover:text-flame-400 transition-colors">
              Tires
            </Link>
            <span className="text-steel-700">•</span>
            <Link to="/build" className="text-steel-400 hover:text-flame-400 transition-colors">
              Build Tool
            </Link>
            <span className="text-steel-700">•</span>
            <Link to="/support" className="text-steel-400 hover:text-flame-400 transition-colors">
              Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
