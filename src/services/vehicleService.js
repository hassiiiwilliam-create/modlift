const DEFAULT_BASE_URL = 'http://localhost:3001/api'
const API_BASE = (import.meta.env.VITE_WHEELSIZE_PROXY_URL || DEFAULT_BASE_URL).replace(/\/$/, '')

const buildUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`

const toJson = async (response, label) => {
  if (!response.ok) {
    const message = `Failed to fetch ${label} (${response.status})`
    throw new Error(message)
  }
  return response.json()
}

export async function fetchYears() {
  const response = await fetch(buildUrl('/years'))
  const data = await toJson(response, 'years')
  return data?.data ?? []
}

export async function fetchMakes(year) {
  if (!year) return []
  const response = await fetch(buildUrl(`/makes?year=${encodeURIComponent(year)}`))
  const data = await toJson(response, 'makes')
  return data?.data ?? []
}

export async function fetchModels(year, make) {
  if (!year || !make) return []
  const response = await fetch(
    buildUrl(`/models?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}`)
  )
  const data = await toJson(response, 'models')
  return data?.data ?? []
}

export async function fetchTrims(year, make, model) {
  if (!year || !make || !model) return []
  const response = await fetch(
    buildUrl(
      `/trims?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`
    )
  )
  const data = await toJson(response, 'trims')
  return data?.data ?? []
}

// Backwards-compatible aliases (legacy callers still use getX naming)
export const getYears = fetchYears
export const getMakes = fetchMakes
export const getModels = fetchModels
export const getTrims = fetchTrims
