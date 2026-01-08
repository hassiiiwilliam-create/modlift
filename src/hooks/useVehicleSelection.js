import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useVehicle } from '../context/VehicleContext.jsx'

const serializeVehicle = (vehicle) => {
  if (!vehicle) return null
  const { year = '', make = '', model = '', trim = '' } = vehicle
  return `${year}-${make}-${model}-${trim}`
}

const deserializeVehicle = (value) => {
  if (!value) return null
  const [year = '', make = '', model = '', trim = ''] = value.split('-')
  if (!year || !make || !model || !trim) return null
  return { year, make, model, trim }
}

export function useVehicleSelection() {
  const { selection, updateSelection, clearSelection, loading } = useVehicle()
  const [searchParams, setSearchParams] = useSearchParams()
  const hydratedFromUrlRef = useRef(false)

  useEffect(() => {
    if (hydratedFromUrlRef.current) return

    const fromUrl = deserializeVehicle(searchParams.get('vehicle'))
    if (!selection && fromUrl) {
      updateSelection(fromUrl)
    }

    hydratedFromUrlRef.current = true
  }, [selection, searchParams, updateSelection])

  useEffect(() => {
    if (!hydratedFromUrlRef.current) return

    const currentParam = searchParams.get('vehicle')
    const nextParam = serializeVehicle(selection)

    if (currentParam === nextParam) return

    const next = new URLSearchParams(searchParams)
    if (nextParam) {
      next.set('vehicle', nextParam)
    } else {
      next.delete('vehicle')
    }

    setSearchParams(next, { replace: true })
  }, [selection, searchParams, setSearchParams])

  const vehicleParam = useMemo(() => serializeVehicle(selection), [selection])

  return {
    selection,
    updateSelection,
    clearSelection,
    vehicleParam,
    loading,
  }
}
