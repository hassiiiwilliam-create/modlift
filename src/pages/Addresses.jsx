import { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'
import { supabase } from '../supabaseClient'
import {
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  ArrowLeft,
  Star,
  X,
  Check,
  Home,
  Building2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Addresses() {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [settingDefault, setSettingDefault] = useState(null)

  const [formData, setFormData] = useState({
    label: 'home',
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    phone: '',
    is_default: false,
  })

  useEffect(() => {
    if (!user) {
      navigate('/account')
      return
    }

    fetchAddresses()
  }, [user, navigate])

  const fetchAddresses = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (err) {
      console.error('Error fetching addresses:', err)
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      label: 'home',
      full_name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'United States',
      phone: '',
      is_default: false,
    })
    setEditingAddress(null)
    setShowAddModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    if (!formData.full_name || !formData.address_line1 || !formData.city || !formData.state || !formData.zip_code) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      // If setting as default, unset other defaults first
      if (formData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
      }

      if (editingAddress) {
        const { error } = await supabase
          .from('addresses')
          .update({
            label: formData.label,
            full_name: formData.full_name,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2 || null,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            country: formData.country,
            phone: formData.phone || null,
            is_default: formData.is_default,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAddress.id)

        if (error) throw error
        toast.success('Address updated')
      } else {
        const { error } = await supabase.from('addresses').insert({
          user_id: user.id,
          label: formData.label,
          full_name: formData.full_name,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2 || null,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
          phone: formData.phone || null,
          is_default: formData.is_default || addresses.length === 0,
        })

        if (error) throw error
        toast.success('Address added')
      }

      resetForm()
      fetchAddresses()
    } catch (err) {
      console.error('Error saving address:', err)
      toast.error('Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (address) => {
    setFormData({
      label: address.label || 'home',
      full_name: address.full_name || '',
      address_line1: address.address_line1 || '',
      address_line2: address.address_line2 || '',
      city: address.city || '',
      state: address.state || '',
      zip_code: address.zip_code || '',
      country: address.country || 'United States',
      phone: address.phone || '',
      is_default: address.is_default || false,
    })
    setEditingAddress(address)
    setShowAddModal(true)
  }

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    setDeleting(addressId)
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', addressId)

      if (error) throw error
      toast.success('Address deleted')
      fetchAddresses()
    } catch (err) {
      console.error('Error deleting address:', err)
      toast.error('Failed to delete address')
    } finally {
      setDeleting(null)
    }
  }

  const handleSetDefault = async (addressId) => {
    setSettingDefault(addressId)
    try {
      // Unset all defaults
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)

      // Set new default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)

      if (error) throw error
      toast.success('Default address updated')
      fetchAddresses()
    } catch (err) {
      console.error('Error setting default:', err)
      toast.error('Failed to update default address')
    } finally {
      setSettingDefault(null)
    }
  }

  if (!user) {
    return null
  }

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="min-h-screen bg-night-950 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
              <MapPin className="h-7 w-7 text-night-950" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Address Book</h1>
              <p className="text-slate-400 text-sm">Manage your shipping addresses</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 text-night-950 font-semibold transition-all hover:bg-lime-400"
          >
            <Plus className="h-5 w-5" />
            Add Address
          </button>
        </motion.div>

        {/* Addresses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-night-800/50 border border-night-700/50 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No addresses yet</h3>
              <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                Add your shipping addresses for faster checkout.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold transition-all hover:bg-lime-400"
              >
                <Plus className="h-5 w-5" />
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border overflow-hidden ${
                    address.is_default ? 'border-lime-500/50' : 'border-night-800/50'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          address.label === 'work'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-lime-500/10 text-lime-400'
                        }`}>
                          {address.label === 'work' ? (
                            <Building2 className="h-4 w-4" />
                          ) : (
                            <Home className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-slate-300 capitalize">
                          {address.label || 'Home'}
                        </span>
                        {address.is_default && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-lime-500/10 text-lime-400 border border-lime-500/30">
                            <Star className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-night-800 transition-all"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          disabled={deleting === address.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-coral-400 hover:bg-night-800 transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === address.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-white font-medium">{address.full_name}</p>
                      <p className="text-slate-400">{address.address_line1}</p>
                      {address.address_line2 && (
                        <p className="text-slate-400">{address.address_line2}</p>
                      )}
                      <p className="text-slate-400">
                        {address.city}, {address.state} {address.zip_code}
                      </p>
                      {address.phone && (
                        <p className="text-slate-500 text-xs mt-2">{address.phone}</p>
                      )}
                    </div>

                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={settingDefault === address.id}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-night-800/50 border border-night-700/50 text-slate-400 text-sm font-medium hover:text-lime-400 hover:border-lime-500/30 transition-all disabled:opacity-50"
                      >
                        {settingDefault === address.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                        Set as Default
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => resetForm()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg my-8 rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden"
              >
                <div className="flex items-center justify-between p-5 border-b border-night-800/50">
                  <h2 className="text-lg font-semibold text-white">
                    {editingAddress ? 'Edit Address' : 'Add Address'}
                  </h2>
                  <button
                    onClick={() => resetForm()}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-night-800 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Label */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Address Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, label: 'home' }))}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          formData.label === 'home'
                            ? 'bg-lime-500/10 border-lime-500/50 text-lime-400'
                            : 'bg-night-800/30 border-night-700/50 text-slate-400 hover:border-night-600'
                        }`}
                      >
                        <Home className="h-4 w-4" />
                        Home
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, label: 'work' }))}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          formData.label === 'work'
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                            : 'bg-night-800/30 border-night-700/50 text-slate-400 hover:border-night-600'
                        }`}
                      >
                        <Building2 className="h-4 w-4" />
                        Work
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="full_name" className="block text-sm font-medium text-slate-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                    />
                  </div>

                  {/* Address Line 1 */}
                  <div className="space-y-2">
                    <label htmlFor="address_line1" className="block text-sm font-medium text-slate-300">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address_line1"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="space-y-2">
                    <label htmlFor="address_line2" className="block text-sm font-medium text-slate-300">
                      Apt, Suite, Unit (Optional)
                    </label>
                    <input
                      type="text"
                      id="address_line2"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleChange}
                      placeholder="Apt 4B"
                      className="w-full px-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                    />
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-3 space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium text-slate-300">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Los Angeles"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                      />
                    </div>
                    <div className="col-span-1 space-y-2">
                      <label htmlFor="state" className="block text-sm font-medium text-slate-300">
                        State *
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                      >
                        <option value="">--</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label htmlFor="zip_code" className="block text-sm font-medium text-slate-300">
                        ZIP *
                      </label>
                      <input
                        type="text"
                        id="zip_code"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        placeholder="90001"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl bg-night-800/30 border border-night-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all"
                    />
                  </div>

                  {/* Default Checkbox */}
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-night-800/30 border border-night-700/50 cursor-pointer hover:border-night-600 transition-all">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-night-600 bg-night-800 text-lime-500 focus:ring-lime-500/50"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">Set as default address</p>
                      <p className="text-xs text-slate-500">Use this address for shipping by default</p>
                    </div>
                  </label>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => resetForm()}
                      className="flex-1 px-4 py-3 rounded-xl bg-night-800 border border-night-700/50 text-slate-300 font-medium hover:bg-night-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 disabled:opacity-50 transition-all"
                    >
                      {saving ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                      {editingAddress ? 'Save Changes' : 'Add Address'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
