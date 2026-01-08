// /src/components/GalleryPreview.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function GalleryPreview({ vehicle, wheel, tire }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  const fetchGallery = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .ilike('vehicle', `%${vehicle?.model || ''}%`)
        .ilike('wheel', `%${wheel || ''}%`)
        .ilike('tire', `%${tire || ''}%`)
        .limit(8)
      if (error) throw error
      setImages(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (vehicle?.model && wheel && tire) {
      fetchGallery()
    }
  }, [vehicle, wheel, tire])

  const handleSaveToBuild = async (image) => {
    const { data, error } = await supabase.from('build_images').insert([
      {
        build_id: vehicle.buildId,
        image_id: image.id,
      }
    ])
    if (error) {
      console.error('Error saving image to build:', error)
    } else {
      console.log('Image linked to build:', data)
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-white">Preview Gallery</h2>
      {loading && <p className="text-gray-400">Loading images...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && images.length === 0 && (
        <p className="text-gray-500">No previews available yet. Try selecting a different setup.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative rounded-xl overflow-hidden shadow-md bg-white">
            <img
              src={img.url}
              alt={img.caption || 'Build preview'}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => setFullscreenImage(img.url)}
            />
            <div className="p-2 text-sm text-center text-gray-700">
              {img.caption || `${img.vehicle} on ${img.wheel}`}
            </div>
            <button
              onClick={() => handleSaveToBuild(img)}
              className="absolute bottom-2 right-2 text-xs px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 transition"
            >
              Save to Build
            </button>
          </div>
        ))}
      </div>

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setFullscreenImage(null)}
        >
          <img src={fullscreenImage} alt="Full screen" className="max-h-[90vh] max-w-[90vw] rounded-xl" />
        </div>
      )}
    </div>
  )
}
