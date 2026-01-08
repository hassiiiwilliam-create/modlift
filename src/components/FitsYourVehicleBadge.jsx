import { useEffect, useState } from 'react'

const VEHICLE_STORAGE_KEY = 'modlift_vehicle'

const normalize = (value) => String(value ?? '').trim().toLowerCase()

const extractField = (source, keys) => {
  if (!source) return ''
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key]) {
      return source[key]
    }
  }
  return ''
}

export default function FitsYourVehicleBadge({ fitments = [], className = '' }) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const computeMatch = (selectionOverride) => {
      if (selectionOverride === null) {
        setMatches(false)
        return
      }

      let selection = selectionOverride
      if (!selection) {
        const stored = window.localStorage.getItem(VEHICLE_STORAGE_KEY)
        if (!stored) {
          setMatches(false)
          return
        }

        try {
          selection = JSON.parse(stored)
        } catch (error) {
          console.warn('Failed to parse stored vehicle selection', error)
          setMatches(false)
          return
        }
      }

      if (!selection || typeof selection !== 'object') {
        setMatches(false)
        return
      }

      const selectedYear = normalize(selection.year)
      const selectedMake = normalize(selection.make)
      const selectedModel = normalize(selection.model)
      const selectedTrim = normalize(selection.trim)

      if (!selectedYear || !selectedMake || !selectedModel || !selectedTrim) {
        setMatches(false)
        return
      }

      const hasMatch = Array.isArray(fitments) && fitments.some((fitment) => {
        if (!fitment || typeof fitment !== 'object') return false
        const year = normalize(extractField(fitment, ['year', 'vehicle_year']))
        const make = normalize(extractField(fitment, ['make', 'vehicle_make']))
        const model = normalize(extractField(fitment, ['model', 'vehicle_model']))
        const trim = normalize(extractField(fitment, ['trim', 'vehicle_trim']))
        return year === selectedYear && make === selectedMake && model === selectedModel && trim === selectedTrim
      })

      setMatches(hasMatch)
    }

    computeMatch()

    const handleStorage = (event) => {
      if (event.key === VEHICLE_STORAGE_KEY) {
        computeMatch()
      }
    }

    const handleVehicleSelected = (event) => {
      computeMatch(event.detail)
    }

    const handleVehicleCleared = () => {
      computeMatch(null)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('modlift:vehicle-selected', handleVehicleSelected)
    window.addEventListener('modlift:vehicle-cleared', handleVehicleCleared)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('modlift:vehicle-selected', handleVehicleSelected)
      window.removeEventListener('modlift:vehicle-cleared', handleVehicleCleared)
    }
  }, [fitments])

  if (!matches) return null

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 ${className}`}>
      <span aria-hidden>✅</span>
      Fits Your Vehicle
    </span>
  )
}
