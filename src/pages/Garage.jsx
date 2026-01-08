import { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'
import { supabase } from '../supabaseClient'
import {
  Car,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  ArrowLeft,
  Calendar,
  Settings,
  ChevronRight,
  X,
  Check,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import FilterCombobox from '../components/FilterCombobox'
import {
  fetchYears,
  fetchMakes,
  fetchModels,
  fetchTrims,
} from '../services/wheelsizeService'

const toOptionList = (items = []) =>
  items
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const value = String(item)
        return { value, label: value }
      }
      if (!item) return null
      const candidate =
        item.name ??
        item.label ??
        item.title ??
        item.value ??
        item.slug ??
        item.model ??
        item.make ??
        item.trim ??
        item.year
      if (!candidate) return null
      const value = String(candidate)
      return { value, label: value }
    })
    .filter((option) => option?.value)

export default function Garage() {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    nickname: '',
  })

  // Options state
  const [years, setYears] = useState([])
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [trims, setTrims] = useState([])

  // Loading states
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingTrims, setLoadingTrims] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/account')
      return
    }
    fetchVehicles()
  }, [user, navigate])

  // Fetch years on mount
  useEffect(() => {
    let active = true
    setLoadingYears(true)
    fetchYears()
      .then((list) => {
        if (!active) return
        setYears(toOptionList(list))
      })
      .catch((error) => {
        console.warn('Failed to load years', error)
      })
      .finally(() => {
        if (active) setLoadingYears(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Fetch makes when year changes
  useEffect(() => {
    let cancelled = false
    if (!formData.year) {
      setMakes([])
      return
    }
    setLoadingMakes(true)
    fetchMakes(formData.year)
      .then((list) => {
        if (cancelled) return
        setMakes(toOptionList(list))
      })
      .catch((error) => {
        console.warn('Failed to load makes', error)
        if (!cancelled) setMakes([])
      })
      .finally(() => {
        if (!cancelled) setLoadingMakes(false)
      })
    return () => {
      cancelled = true
    }
  }, [formData.year])

  // Fetch models when year and make change
  useEffect(() => {
    let cancelled = false
    if (!formData.year || !formData.make) {
      setModels([])
      return
    }
    setLoadingModels(true)
    fetchModels(formData.year, formData.make)
      .then((list) => {
        if (cancelled) return
        setModels(toOptionList(list))
      })
      .catch((error) => {
        console.warn('Failed to load models', error)
        if (!cancelled) setModels([])
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false)
      })
    return () => {
      cancelled = true
    }
  }, [formData.year, formData.make])

  // Fetch trims when year, make, and model change
  useEffect(() => {
    let cancelled = false
    if (!formData.year || !formData.make || !formData.model) {
      setTrims([])
      return
    }
    setLoadingTrims(true)
    fetchTrims(formData.year, formData.make, formData.model)
      .then((list) => {
        if (cancelled) return
        setTrims(toOptionList(list))
      })
      .catch((error) => {
        console.warn('Failed to load trims', error)
        if (!cancelled) setTrims([])
      })
      .finally(() => {
        if (!cancelled) setLoadingTrims(false)
      })
    return () => {
      cancelled = true
    }
  }, [formData.year, formData.make, formData.model])

  const fetchVehicles = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVehicles(data || [])
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      // Clear dependent fields
      if (field === 'year') {
        next.make = ''
        next.model = ''
        next.trim = ''
      } else if (field === 'make') {
        next.model = ''
        next.trim = ''
      } else if (field === 'model') {
        next.trim = ''
      }
      return next
    })
  }

  const resetForm = () => {
    setFormData({
      year: '',
      make: '',
      model: '',
      trim: '',
      nickname: '',
    })
    setEditingVehicle(null)
    setShowAddModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    if (!formData.year || !formData.make || !formData.model) {
      toast.error('Please fill in year, make, and model')
      return
    }

    setSaving(true)
    try {
      if (editingVehicle) {
        const { error } = await supabase
          .from('user_vehicles')
          .update({
            year: parseInt(formData.year),
            make: formData.make,
            model: formData.model,
            trim: formData.trim || null,
            nickname: formData.nickname || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingVehicle.id)

        if (error) throw error
        toast.success('Vehicle updated')
      } else {
        const { error } = await supabase.from('user_vehicles').insert({
          user_id: user.id,
          year: parseInt(formData.year),
          make: formData.make,
          model: formData.model,
          trim: formData.trim || null,
          nickname: formData.nickname || null,
        })

        if (error) throw error
        toast.success('Vehicle added to garage')
      }

      resetForm()
      fetchVehicles()
    } catch (err) {
      console.error('Error saving vehicle:', err)
      toast.error(err?.message || 'Failed to save vehicle')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (vehicle) => {
    setFormData({
      year: vehicle.year?.toString() || '',
      make: vehicle.make || '',
      model: vehicle.model || '',
      trim: vehicle.trim || '',
      nickname: vehicle.nickname || '',
    })
    setEditingVehicle(vehicle)
    setShowAddModal(true)
  }

  const handleDelete = async (vehicleId) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return

    setDeleting(vehicleId)
    try {
      const { error } = await supabase.from('user_vehicles').delete().eq('id', vehicleId)

      if (error) throw error
      toast.success('Vehicle removed')
      fetchVehicles()
    } catch (err) {
      console.error('Error deleting vehicle:', err)
      toast.error('Failed to remove vehicle')
    } finally {
      setDeleting(null)
    }
  }

  const handleShopForVehicle = (vehicle) => {
    const params = new URLSearchParams()
    if (vehicle.year) params.set('vehicle_year', vehicle.year)
    if (vehicle.make) params.set('vehicle_make', vehicle.make)
    if (vehicle.model) params.set('vehicle_model', vehicle.model)
    if (vehicle.trim) params.set('vehicle_trim', vehicle.trim)
    navigate(`/shop?${params.toString()}`)
  }

  if (!user) {
    return null
  }

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
              <Car className="h-7 w-7 text-night-950" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Vehicle Garage</h1>
              <p className="text-slate-400 text-sm">Save your vehicles for quick shopping</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-lime-500 text-night-950 font-semibold transition-all hover:bg-lime-400"
          >
            <Plus className="h-5 w-5" />
            Add Vehicle
          </button>
        </motion.div>

        {/* Vehicles List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 text-lime-500 animate-spin" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-night-800/50 border border-night-700/50 flex items-center justify-center">
                <Car className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No vehicles yet</h3>
              <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                Add your vehicles to quickly find compatible parts when shopping.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold transition-all hover:bg-lime-400"
              >
                <Plus className="h-5 w-5" />
                Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50 overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-500/10 border border-lime-500/30">
                          <Car className="h-6 w-6 text-lime-400" />
                        </div>
                        <div>
                          {vehicle.nickname && (
                            <p className="text-sm text-lime-400 font-medium mb-0.5">
                              {vehicle.nickname}
                            </p>
                          )}
                          <h3 className="text-lg font-semibold text-white">
                            {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}
                          </h3>
                          {vehicle.trim && (
                            <p className="text-slate-400 text-sm mt-0.5">{vehicle.trim}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Added{' '}
                              {new Date(vehicle.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="p-2 rounded-lg bg-night-800/50 border border-night-700/50 text-slate-400 hover:text-white hover:border-night-600 transition-all"
                          title="Edit vehicle"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={deleting === vehicle.id}
                          className="p-2 rounded-lg bg-night-800/50 border border-night-700/50 text-slate-400 hover:text-coral-400 hover:border-coral-500/30 transition-all disabled:opacity-50"
                          title="Remove vehicle"
                        >
                          {deleting === vehicle.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Shop Button */}
                    <div className="mt-4 pt-4 border-t border-night-800/50">
                      <button
                        onClick={() => handleShopForVehicle(vehicle)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-night-800/50 border border-night-700/50 text-slate-300 font-medium hover:bg-night-800 hover:border-lime-500/30 hover:text-lime-400 transition-all group"
                      >
                        <Settings className="h-4 w-4" />
                        Shop Parts for This Vehicle
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => resetForm()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-night-900 to-night-950 border border-night-800/50"
              >
                <div className="flex items-center justify-between p-5 border-b border-night-800/50 sticky top-0 bg-night-900 z-10">
                  <h2 className="text-lg font-semibold text-white">
                    {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                  </h2>
                  <button
                    onClick={() => resetForm()}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-night-800 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  {/* Year */}
                  <FilterCombobox
                    label="Year"
                    options={years}
                    value={formData.year}
                    onChange={(val) => handleFieldChange('year', val)}
                    isLoading={loadingYears}
                    required
                  />

                  {/* Make */}
                  <FilterCombobox
                    label="Make"
                    options={makes}
                    value={formData.make}
                    onChange={(val) => handleFieldChange('make', val)}
                    isLoading={loadingMakes}
                    disabled={!formData.year}
                    required
                  />

                  {/* Model */}
                  <FilterCombobox
                    label="Model"
                    options={models}
                    value={formData.model}
                    onChange={(val) => handleFieldChange('model', val)}
                    isLoading={loadingModels}
                    disabled={!formData.year || !formData.make}
                    required
                  />

                  {/* Trim */}
                  <FilterCombobox
                    label="Trim"
                    options={trims}
                    value={formData.trim}
                    onChange={(val) => handleFieldChange('trim', val)}
                    isLoading={loadingTrims}
                    disabled={!formData.year || !formData.make || !formData.model}
                  />

                  {/* Nickname */}
                  <div className="space-y-2">
                    <label htmlFor="nickname" className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Nickname
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                      placeholder="e.g. Daily Driver, Track Car"
                      className="w-full px-3 py-2.5 rounded-lg bg-night-800/50 border border-night-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-lime-500/50 focus:ring-2 focus:ring-lime-500/20 transition-all"
                    />
                  </div>

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
                      {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
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
