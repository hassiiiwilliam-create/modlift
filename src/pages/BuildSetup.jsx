import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VehicleSelector from '../components/VehicleSelector'

export default function BuildSetup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000) // simulate initial loading screen
    return () => clearTimeout(timer)
  }, [])

  const handleComplete = () => {
    // Save progress locally (can later extend to Supabase or backend)
    localStorage.setItem('modlift_progress', JSON.stringify({ step: 1, vehicleSelected: true }))
    navigate('/build')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-600 text-lg">Loading ModLift Build Assistant...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mb-8 w-full max-w-xl mx-auto">
        <div className="w-full bg-gray-300 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: '33%' }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 mt-2 text-center">Step 1 of 3</div>
      </div>
      <div className="w-full max-w-xl mx-auto transition-opacity duration-500 ease-out">
        <VehicleSelector onComplete={handleComplete} />
      </div>
    </div>
  )
}
