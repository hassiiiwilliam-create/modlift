import { useState, useRef, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { AppContext } from '../App'
import {
  Camera,
  Upload,
  X,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Image as ImageIcon,
  Car,
  Plus,
} from 'lucide-react'

export default function VehiclePhotoUpload({ onUploadComplete }) {
  const { user } = useContext(AppContext)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [caption, setCaption] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehicleMake, setVehicleMake] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles = []
    const newPreviews = []

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        continue
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10MB`)
        continue
      }

      // Limit to 10 photos at a time
      if (selectedFiles.length + validFiles.length >= 10) {
        toast.error('Maximum 10 photos per upload')
        break
      }

      validFiles.push(file)
      newPreviews.push(URL.createObjectURL(file))
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles])
      setPreviews((prev) => [...prev, ...newPreviews])
    }

    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index])
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !user) return

    // Validate required fields
    if (!vehicleYear.trim() || !vehicleMake.trim() || !vehicleModel.trim()) {
      toast.error('Please enter your vehicle year, make, and model')
      return
    }

    setUploading(true)
    setUploadProgress({ current: 0, total: selectedFiles.length })

    let successCount = 0
    let failCount = 0

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setUploadProgress({ current: i + 1, total: selectedFiles.length })

        try {
          // Generate unique filename
          const fileExt = file.name.split('.').pop()
          const fileName = `${user.id}/${Date.now()}-${i}.${fileExt}`

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('vehicle-photos')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
            })

          if (uploadError) throw uploadError

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('vehicle-photos')
            .getPublicUrl(fileName)

          const imageUrl = urlData.publicUrl

          // Save to database
          const { error: dbError } = await supabase.from('user_vehicle_photos').insert({
            user_id: user.id,
            image_url: imageUrl,
            caption: caption.trim() || null,
            vehicle_year: vehicleYear.trim() || null,
            vehicle_make: vehicleMake.trim() || null,
            vehicle_model: vehicleModel.trim() || null,
            status: 'pending',
          })

          if (dbError) throw dbError
          successCount++
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err)
          failCount++
        }
      }

      if (successCount > 0) {
        const message =
          successCount === 1
            ? 'Photo uploaded! It will appear in the gallery once approved.'
            : `${successCount} photos uploaded! They will appear in the gallery once approved.`
        toast.success(message)
      }

      if (failCount > 0) {
        toast.error(`${failCount} photo${failCount > 1 ? 's' : ''} failed to upload`)
      }

      // Reset form
      previews.forEach((p) => URL.revokeObjectURL(p))
      setSelectedFiles([])
      setPreviews([])
      setCaption('')
      setVehicleYear('')
      setVehicleMake('')
      setVehicleModel('')

      if (onUploadComplete && successCount > 0) onUploadComplete()
    } catch (err) {
      console.error('Upload error:', err)
      toast.error(err.message || 'Failed to upload photos')
    } finally {
      setUploading(false)
      setUploadProgress({ current: 0, total: 0 })
    }
  }

  const handleCancel = () => {
    previews.forEach((p) => URL.revokeObjectURL(p))
    setSelectedFiles([])
    setPreviews([])
    setCaption('')
    setVehicleYear('')
    setVehicleMake('')
    setVehicleModel('')
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Please sign in to upload photos</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {previews.length === 0 ? (
          <motion.div
            key="upload-trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 rounded-2xl border-2 border-dashed border-night-700 hover:border-lime-500/50 bg-night-900/30 hover:bg-night-900/50 transition-all group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-lime-500/10 flex items-center justify-center group-hover:bg-lime-500/20 transition-colors">
                  <Camera className="h-8 w-8 text-lime-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-white">Upload Your Build</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Share photos of your vehicle with the community
                  </p>
                </div>
                <span className="text-xs text-slate-500">JPG, PNG up to 10MB · Up to 10 photos</span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-night-900/60 border border-night-800/50 overflow-hidden"
          >
            {/* Photo Previews Grid */}
            <div className="p-4 bg-night-800/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white">
                  {previews.length} photo{previews.length !== 1 ? 's' : ''} selected
                </p>
                {previews.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-night-700 border border-night-600 text-slate-300 text-xs font-medium hover:bg-night-600 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add More
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-night-950/80 backdrop-blur-sm border border-night-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/80 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previews.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-night-600 hover:border-lime-500/50 flex items-center justify-center text-slate-500 hover:text-lime-400 transition-colors"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              {/* Vehicle Info - Required */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Vehicle Info <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Year"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    maxLength={4}
                    className="px-3 py-2.5 rounded-lg bg-night-800 border border-night-700/50 text-white text-sm placeholder-slate-500 focus:border-lime-500/50 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Make"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-night-800 border border-night-700/50 text-white text-sm placeholder-slate-500 focus:border-lime-500/50 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-night-800 border border-night-700/50 text-white text-sm placeholder-slate-500 focus:border-lime-500/50 outline-none"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">e.g., 2022 Ford F-150</p>
              </div>

              {/* Build Description */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Build Description <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="What mods have you done? Lift kit, wheels, tires, etc..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2.5 rounded-lg bg-night-800 border border-night-700/50 text-white text-sm placeholder-slate-500 focus:border-lime-500/50 outline-none resize-none"
                />
                <p className="text-xs text-slate-500 mt-1.5">{caption.length}/500 characters</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-lime-500 text-night-950 font-semibold hover:bg-lime-400 disabled:opacity-50 transition-colors"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading {uploadProgress.current}/{uploadProgress.total}...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Submit {previews.length > 1 ? `${previews.length} Photos` : 'for Review'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploading}
                  className="px-4 py-3 rounded-xl bg-night-800 border border-night-700 text-slate-300 font-medium hover:bg-night-700 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Photos are reviewed before appearing in the public gallery
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Component to display user's uploaded photos with status
export function UserPhotoGallery() {
  const { user } = useContext(AppContext)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPhotos = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_vehicle_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (err) {
      console.error('Error fetching photos:', err)
    } finally {
      setLoading(false)
    }
  }

  useState(() => {
    fetchPhotos()
  }, [user])

  const handleDelete = async (photoId, imageUrl) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      // Delete from storage
      const filePath = imageUrl.split('/vehicle-photos/')[1]
      if (filePath) {
        await supabase.storage.from('vehicle-photos').remove([filePath])
      }

      // Delete from database
      const { error } = await supabase
        .from('user_vehicle_photos')
        .delete()
        .eq('id', photoId)

      if (error) throw error

      toast.success('Photo deleted')
      fetchPhotos()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete photo')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-lime-500/10 text-lime-400 border border-lime-500/30">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            Pending Review
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 text-lime-500 animate-spin" />
      </div>
    )
  }

  if (photos.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-lime-400" />
        Your Uploads
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-xl overflow-hidden bg-night-800 border border-night-700/50"
          >
            <div className="aspect-square">
              <img
                src={photo.image_url}
                alt={photo.caption || 'Vehicle photo'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id, photo.image_url)}
                  className="w-full px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="absolute top-2 left-2">
              {getStatusBadge(photo.status)}
            </div>
            {photo.vehicle_year && photo.vehicle_make && (
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 text-xs text-white bg-night-950/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <Car className="h-3 w-3" />
                  {[photo.vehicle_year, photo.vehicle_make, photo.vehicle_model].filter(Boolean).join(' ')}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
