import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'
import { supabase } from '../supabaseClient'
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    preferred_contact: 'email',
  })

  useEffect(() => {
    if (!user) {
      navigate('/account')
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, preferred_contact')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (data) {
          setProfile({
            full_name: data.full_name || '',
            phone: data.phone || '',
            preferred_contact: data.preferred_contact || 'email',
          })
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          preferred_contact: profile.preferred_contact,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
              <User className="h-8 w-8 text-night-950" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-slate-400">Update your personal information</p>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-lime-500 via-lime-400 to-lime-500" />

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-slate-400 cursor-not-allowed"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {user.email_confirmed_at ? (
                      <span className="inline-flex items-center gap-1 text-xs text-mint-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProfile((prev) => ({ ...prev, preferred_contact: 'email' }))}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      profile.preferred_contact === 'email'
                        ? 'bg-lime-500/10 border-lime-500/50 text-lime-400'
                        : 'bg-night-800/30 border-night-700/50 text-slate-400 hover:border-night-600'
                    }`}
                  >
                    <Mail className="h-5 w-5 mx-auto mb-1" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile((prev) => ({ ...prev, preferred_contact: 'phone' }))}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      profile.preferred_contact === 'phone'
                        ? 'bg-lime-500/10 border-lime-500/50 text-lime-400'
                        : 'bg-night-800/30 border-night-700/50 text-slate-400 hover:border-night-600'
                    }`}
                  >
                    <Phone className="h-5 w-5 mx-auto mb-1" />
                    Phone
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold transition-all hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
