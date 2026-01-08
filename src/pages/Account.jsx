import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'
import { supabase } from '../supabaseClient'
import { useWishlist } from '../context/wishlistContext'
import AccountReturnsSection from '@/components/AccountReturns'
import {
  User,
  Mail,
  Lock,
  LogOut,
  Key,
  Wrench,
  Package,
  Car,
  MapPin,
  HeadphonesIcon,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Settings,
  Shield,
  Calendar,
  Heart,
  Truck,
  Clock,
} from 'lucide-react'
import ModLiftLogo from '../components/ModLiftLogo'

const statusConfig = {
  pending: { color: 'amber', label: 'Pending' },
  pending_payment: { color: 'amber', label: 'Awaiting Payment' },
  processing: { color: 'cyan', label: 'Processing' },
  shipped: { color: 'blue', label: 'Shipped' },
  delivered: { color: 'lime', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' },
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function Account() {
  const { user } = useContext(AppContext)
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [builds, setBuilds] = useState([])
  const [orders, setOrders] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState('')

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'
  const isVerified = Boolean(user?.email_confirmed_at)
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null

  useEffect(() => {
    setAuthError('')
    if (!user) {
      setBuilds([])
      setOrders([])
      setVehicles([])
      setDataLoading(false)
      return
    }

    // Load profile data from user metadata
    setFirstName(user.user_metadata?.first_name || '')
    setLastName(user.user_metadata?.last_name || '')

    const fetchData = async () => {
      setDataLoading(true)
      setDataError('')
      try {
        const [buildsResponse, ordersResponse, vehiclesResponse] = await Promise.all([
          supabase
            .from('builds')
            .select('id, year, make, model, trim, step, updated_at, created_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(5),
          supabase
            .from('orders')
            .select('id, status, total_price, created_at, submitted_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('user_vehicles')
            .select('id')
            .eq('user_id', user.id),
        ])

        if (buildsResponse.error) throw buildsResponse.error
        if (ordersResponse.error) throw ordersResponse.error
        // Don't throw on vehicles error - table might not exist

        setBuilds(buildsResponse.data ?? [])
        setOrders(ordersResponse.data ?? [])
        setVehicles(vehiclesResponse.data ?? [])
      } catch (err) {
        console.error(err)
        setDataError(err.message)
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [user])

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user])

  const handleAuth = async (event) => {
    event.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Welcome back!')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('Account created! Check your inbox to confirm your email.')
      }
      setPassword('')
    } catch (err) {
      console.error(err)
      setAuthError(err.message)
      toast.error(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    try {
      const redirectTo = `${window.location.origin}/account`
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
      if (error) throw error
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Signed out successfully')
      navigate('/')
    }
  }

  const handleResetPassword = async () => {
    if (!user?.email) return
    const redirectTo = `${window.location.origin}/account`
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset link sent to your email')
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    try {
      const displayName = firstName.trim() && lastName.trim()
        ? `${firstName.trim()} ${lastName.trim().charAt(0)}.`
        : null

      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          display_name: displayName,
        },
      })

      if (error) throw error

      toast.success('Profile updated successfully')
      setEditingProfile(false)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const userDisplayName = user?.user_metadata?.display_name
    || (user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name.charAt(0)}.`
      : null)

  // Guest view - Login/Signup
  if (!user) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center px-4 py-12">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-lime-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-lime-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <Link to="/" className="group transition-transform hover:scale-105">
              <ModLiftLogo size="lg" />
            </Link>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
          >
            <div className="p-6 border-b border-night-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    {mode === 'login' ? 'Sign in to access your account' : 'Join the ModLift community'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login')
                    setAuthError('')
                  }}
                  className="text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors"
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-4" onSubmit={handleAuth}>
                <AnimatePresence mode="wait">
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {authError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-4 text-night-950 font-bold text-lg shadow-lg shadow-lime-500/25 transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-night-800" />
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-night-800" />
              </div>

              {/* OAuth */}
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-night-800 border border-night-700/50 text-white font-medium transition-all hover:bg-night-700 hover:border-night-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-xs text-slate-500 mt-6">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-slate-400 hover:text-white underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-slate-400 hover:text-white underline">Privacy Policy</Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Authenticated user view
  return (
    <div className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
            <User className="h-7 w-7 text-night-950" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">My Garage</h1>
            <p className="text-slate-400">Manage your builds, orders, and preferences</p>
          </div>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {dataError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{dataError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-3xl font-bold text-night-950 shadow-lg shadow-lime-500/20">
                    {userInitial}
                  </div>
                  {isVerified && (
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-cyan-500 border-2 border-night-900 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-night-950" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Signed in as</p>
                  <p className="text-xl font-semibold text-white">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      isVerified
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isVerified ? 'Verified' : 'Awaiting verification'}
                    </span>
                    {joinedDate && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        Member since {joinedDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-night-800 border border-night-700/50 text-slate-200 text-sm font-medium transition-all hover:bg-night-700 hover:border-night-600"
                >
                  <Key className="h-4 w-4" />
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium transition-all hover:bg-red-500/20 hover:border-red-500/50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Profile Name Section */}
          <div className="px-6 pb-6 pt-2">
            <div className="rounded-xl bg-night-800/30 border border-night-700/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Display Name</span>
                </div>
                {!editingProfile && (
                  <button
                    type="button"
                    onClick={() => setEditingProfile(true)}
                    className="text-xs text-lime-400 hover:text-lime-300 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingProfile ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-night-800 border border-night-700/50 text-white text-sm placeholder-slate-500 focus:border-lime-500/50 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-night-800 border border-night-700/50 text-white text-sm placeholder-slate-500 focus:border-lime-500/50 outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Will be displayed as "{firstName.trim()} {lastName.trim().charAt(0)}." on reviews
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="px-4 py-2 rounded-lg bg-lime-500 text-night-950 text-sm font-medium hover:bg-lime-400 disabled:opacity-50 transition-colors"
                    >
                      {savingProfile ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(false)
                        setFirstName(user.user_metadata?.first_name || '')
                        setLastName(user.user_metadata?.last_name || '')
                      }}
                      className="px-4 py-2 rounded-lg bg-night-800 border border-night-700/50 text-slate-300 text-sm font-medium hover:bg-night-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white">
                  {userDisplayName || <span className="text-slate-500 italic">Not set - click Edit to add your name</span>}
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <Link
            to="/orders"
            className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-5 group hover:border-lime-500/30 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400 mb-3 group-hover:bg-lime-500/20 transition-colors">
              <Package className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-white">{orders.length}</p>
            <p className="text-sm text-slate-400">Orders</p>
          </Link>

          <Link
            to="/build"
            className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-5 group hover:border-lime-500/30 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 group-hover:bg-cyan-500/20 transition-colors">
              <Wrench className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-white">{builds.length}</p>
            <p className="text-sm text-slate-400">Builds</p>
          </Link>

          <Link
            to="/wishlist"
            className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-5 group hover:border-pink-500/30 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 mb-3 group-hover:bg-pink-500/20 transition-colors">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-white">{wishlistCount}</p>
            <p className="text-sm text-slate-400">Wishlist</p>
          </Link>

          <Link
            to="/account/garage"
            className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-5 group hover:border-amber-500/30 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-3 group-hover:bg-amber-500/20 transition-colors">
              <Car className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-white">{vehicles.length}</p>
            <p className="text-sm text-slate-400">Vehicles</p>
          </Link>
        </motion.div>

        {/* Builds & Orders Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Builds */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-night-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Wrench className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">Your Builds</h2>
              </div>
              <Link to="/build" className="text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors flex items-center gap-1">
                New Build
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-5">
              {dataLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
                </div>
              ) : builds.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-night-800/50 border border-night-700/50 flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm mb-4">No builds yet</p>
                  <Link
                    to="/build"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-night-800 border border-night-700/50 text-sm font-medium text-white hover:bg-night-700 transition-colors"
                  >
                    Start Building
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {builds.map((build) => (
                    <Link
                      key={build.id}
                      to={`/build/${build.id}`}
                      className="block p-4 rounded-xl bg-night-800/30 border border-night-700/30 hover:border-cyan-500/30 hover:bg-night-800/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {[build.year, build.make, build.model, build.trim]
                              .filter(Boolean)
                              .join(' ') || 'Untitled Build'}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {build.step ? build.step.replace(/-/g, ' ') : 'In progress'}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* Orders */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-night-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              </div>
              <Link to="/orders" className="text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors flex items-center gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-5">
              {dataLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-night-800/50 border border-night-700/50 flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-sm mb-4">No orders yet</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-night-800 border border-night-700/50 text-sm font-medium text-white hover:bg-night-700 transition-colors"
                  >
                    Browse Shop
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig.pending
                    const colorClasses = {
                      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                      cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
                      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                      lime: 'bg-lime-500/10 text-lime-400 border-lime-500/30',
                      red: 'bg-red-500/10 text-red-400 border-red-500/30',
                    }

                    return (
                      <Link
                        key={order.id}
                        to={`/order/${order.id}`}
                        className="block p-4 rounded-xl bg-night-800/30 border border-night-700/30 hover:border-lime-500/30 hover:bg-night-800/50 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white group-hover:text-lime-400 transition-colors">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString()
                                : order.submitted_at
                                ? new Date(order.submitted_at).toLocaleDateString()
                                : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses[status.color]}`}>
                              {status.label}
                            </span>
                            <p className="text-sm font-semibold text-white mt-1">
                              {currency.format(order.total_price)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Account Tools */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
        >
          <div className="flex items-center gap-3 p-5 border-b border-night-800/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400">
              <Settings className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">Account Tools</h2>
          </div>

          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/account/addresses"
                className="block p-4 rounded-xl bg-night-800/30 border border-night-700/30 hover:border-lime-500/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-700/50 group-hover:bg-lime-500/20 transition-colors">
                    <MapPin className="h-5 w-5 text-slate-400 group-hover:text-lime-400 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-lime-400 transition-colors">Address Book</p>
                    <p className="text-sm text-slate-500 mt-0.5">Manage shipping addresses</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/account/garage"
                className="block p-4 rounded-xl bg-night-800/30 border border-night-700/30 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                    <Car className="h-5 w-5 text-amber-400 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-amber-400 transition-colors">Vehicle Garage</p>
                    <p className="text-sm text-slate-500 mt-0.5">Save vehicles for quick access</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/account/returns"
                className="block p-4 rounded-xl bg-night-800/30 border border-night-700/30 hover:border-lime-500/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-700/50 group-hover:bg-lime-500/20 transition-colors">
                    <RefreshCw className="h-5 w-5 text-slate-400 group-hover:text-lime-400 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-lime-400 transition-colors">Returns & Exchanges</p>
                    <p className="text-sm text-slate-500 mt-0.5">Submit or manage a return</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/contact"
                className="block p-4 rounded-xl bg-night-800/30 border border-night-700/30 hover:border-lime-500/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-700/50 group-hover:bg-lime-500/20 transition-colors">
                    <HeadphonesIcon className="h-5 w-5 text-slate-400 group-hover:text-lime-400 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-lime-400 transition-colors">Support</p>
                    <p className="text-sm text-slate-500 mt-0.5">Get help from our team</p>
                  </div>
                </div>
              </Link>

              <div className="p-4 rounded-xl bg-night-800/30 border border-night-700/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                    <Shield className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Security</p>
                    <p className="text-sm text-slate-500 mt-0.5">Your data is encrypted</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-night-800/30 border border-night-700/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10">
                    <Truck className="h-5 w-5 text-lime-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Free Shipping</p>
                    <p className="text-sm text-slate-500 mt-0.5">On orders over $500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Returns Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 p-6"
        >
          <AccountReturnsSection />
        </motion.section>
      </div>
    </div>
  )
}
