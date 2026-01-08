// /src/pages/BuildPage.jsx
import { useState, useContext, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VehicleSelectorAdvanced from '../components/VehicleSelectorAdvanced.jsx'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App.jsx'
import { supabase } from '../supabaseClient.js'

export default function BuildPage() {
  const [selectedVehicle, setSelectedVehicle] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useContext(AppContext)
  const navigate = useNavigate()

  const [userBuilds, setUserBuilds] = useState([])

  useEffect(() => {
    const fetchBuilds = async () => {
      if (!user?.id) return
      const { data, error } = await supabase
        .from('builds')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) setUserBuilds(data)
    }
    fetchBuilds()
  }, [user])

  const handleSelectionChange = useCallback((selection) => {
    if (
      selection.year !== selectedVehicle.year ||
      selection.make !== selectedVehicle.make ||
      selection.model !== selectedVehicle.model ||
      selection.trim !== selectedVehicle.trim
    ) {
      setSelectedVehicle(selection)
      console.log('Selected vehicle:', selection)
    }
  }, [selectedVehicle])

  if (userBuilds.some(b => b.step !== 'completed')) {
    return (
      <main className="min-h-screen bg-white text-black px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">You already have a build in progress.</h1>
          <p className="mb-8 text-neutral-600">Complete it or delete it from your dashboard before starting a new one.</p>
          <Link to="/dashboard" className="bg-black text-white px-5 py-2 rounded hover:bg-gray-900">Go to Dashboard</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {userBuilds.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Your Builds</h2>
            <ul className="space-y-3">
              {userBuilds.map((build) => (
                <li key={build.id} className="border border-gray-200 p-4 rounded-md shadow-sm">
                  <div className="font-semibold">{build.year} {build.make} {build.model}</div>
                  <div className="text-sm text-gray-600">Step: {build.step}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Choose your vehicle
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Enter the details below to find compatible wheels, tires, and lift kits.
        </p>

        <VehicleSelectorAdvanced onSelectionChange={handleSelectionChange} />

        {selectedVehicle.year && selectedVehicle.make && selectedVehicle.model && (
          <div className="mt-12 border rounded-xl p-6 bg-neutral-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Your Selection</h2>
            <ul className="text-gray-700">
              <li><strong>Year:</strong> {selectedVehicle.year}</li>
              <li><strong>Make:</strong> {selectedVehicle.make}</li>
              <li><strong>Model:</strong> {selectedVehicle.model}</li>
              {selectedVehicle.trim && <li><strong>Trim:</strong> {selectedVehicle.trim}</li>}
            </ul>
          </div>
        )}

        {selectedVehicle.year && selectedVehicle.make && selectedVehicle.model && selectedVehicle.trim && (
          <div className="mt-8 text-center">
            <button type="button"
              disabled={isSubmitting}
              onClick={async () => {
                setIsSubmitting(true)
                const { error } = await supabase.from('builds').insert({
                  user_id: user?.id || null,
                  year: selectedVehicle.year,
                  make: selectedVehicle.make,
                  model: selectedVehicle.model,
                  trim: selectedVehicle.trim,
                  step: 'vehicle-selected',
                })

                if (error) {
                  toast.error('Failed to save your build. Please try again.')
                  setIsSubmitting(false)
                } else {
                  toast.success('Build saved! Loading setup...')
                  setTimeout(() => {
                    navigate('/build')
                  }, 800)
                }
              }}
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
