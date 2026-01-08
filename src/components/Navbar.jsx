import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ShoppingCart, User, Warehouse, Store, Image, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/cartContext.jsx'
import { useWishlist } from '../context/wishlistContext'
import ModLiftLogo from './ModLiftLogo'

// Simplified navigation - only essential links
const primaryLinks = [
  { label: 'Shop', to: '/shop', icon: Store },
  { label: 'Gallery', to: '/gallery', icon: Image },
  { label: 'My Garage', to: '/account', icon: Warehouse },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-night-950/95 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-night-800/50'
            : 'bg-night-950/80 backdrop-blur-sm'
        }`}
      >
        {/* Top accent bar - lime gradient */}
        <div className="h-0.5 w-full bg-gradient-to-r from-lime-600 via-lime-500 to-lime-400" />

        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="group transition-opacity hover:opacity-80"
          >
            <ModLiftLogo size="default" />
          </Link>

          {/* Desktop Navigation - Clean and minimal */}
          <div className="hidden md:flex items-center gap-1">
            {primaryLinks.map((link) => {
              const isActive = location.pathname === link.to ||
                (link.to === '/account' && location.pathname.startsWith('/account')) ||
                (link.to === '/shop' && location.pathname.startsWith('/shop')) ||
                (link.to === '/gallery' && location.pathname.startsWith('/gallery'))
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-lime-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-lime-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-night-700/50 bg-night-800/50 text-slate-400 backdrop-blur-sm transition-all duration-200 hover:border-pink-500/50 hover:bg-night-800 hover:text-pink-400"
            >
              <Heart className="h-5 w-5" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-night-700/50 bg-night-800/50 text-slate-400 backdrop-blur-sm transition-all duration-200 hover:border-lime-500/50 hover:bg-night-800 hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime-500 text-[11px] font-bold text-night-950"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Account Button (Desktop) */}
            <Link
              to="/account"
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg border border-night-700/50 bg-night-800/50 text-slate-400 backdrop-blur-sm transition-all duration-200 hover:border-lime-500/50 hover:bg-night-800 hover:text-white"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-night-700/50 bg-night-800/50 text-slate-400 transition-all duration-200 hover:bg-night-800 hover:text-white"
            >
              {menuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-night-800/50 bg-night-950/98 backdrop-blur-xl md:hidden"
            >
              <div className="mx-auto max-w-7xl px-4 py-4 space-y-2">
                {/* Primary Links */}
                {primaryLinks.map((link, index) => {
                  const isActive = location.pathname === link.to
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30'
                            : 'text-slate-300 hover:bg-night-800/50 hover:text-white'
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Wishlist link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/wishlist"
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                      location.pathname === '/wishlist'
                        ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                        : 'text-slate-300 hover:bg-night-800/50 hover:text-white'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </motion.div>

                {/* Quick access to orders */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-slate-300 hover:bg-night-800/50 hover:text-white transition-all duration-200"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Orders
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[calc(2px+4rem)]" />

      {/* Back to Top Button */}
      {scrolled && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-lg bg-night-800/90 text-slate-400 shadow-lg backdrop-blur-sm border border-night-700/50 transition-all duration-300 hover:bg-lime-500 hover:text-night-950 hover:shadow-lime-500/30 hover:border-lime-500"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  )
}
