// wheelsizeService.js

// Use the Supabase Edge Function as the proxy (works in both dev and production)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uoaaiyzycbufdnptrluc.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYWFpeXp5Y2J1ZmRucHRybHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjA0MjMsImV4cCI6MjA3MjU5NjQyM30.4jpb-1WgEF0mfQDGz0It8u8RER6evSSHr17TiIxmPR8'
const API_BASE = `${SUPABASE_URL}/functions/v1/wheelsize-proxy`

const buildUrl = (endpoint, params = {}) => {
  // Remove leading slashes from endpoint
  const cleanEndpoint = endpoint.replace(/^\/+/, '').replace(/\/+$/, '')
  // Build full URL: https://xxx.supabase.co/functions/v1/wheelsize-proxy/years
  const url = new URL(`${API_BASE}/${cleanEndpoint}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}

const extractArray = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data

  if (typeof payload === 'object') {
    const candidate = Object.values(payload).find((value) => Array.isArray(value))
    if (Array.isArray(candidate)) return candidate
  }

  return []
}

const requestArray = async (endpoint, params = {}) => {
  const url = buildUrl(endpoint, params)
  try {
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Wheel-Size request failed (${response.status}) — ${url}`)
    }
    const json = await response.json()
    console.log(`[✅ ${endpoint}]`, json)
    return extractArray(json)
  } catch (error) {
    console.error(`[❌ ${endpoint}]`, error?.message ?? error)
    return []
  }
}

// === Exported Data Fetchers ===

export const fetchYears = () => requestArray('years')

export const fetchMakes = (year) => {
  if (!year) return Promise.resolve([])
  return requestArray('makes', { year })
}

export const fetchModels = (year, make) => {
  if (!year || !make) return Promise.resolve([])
  return requestArray('models', { year, make })
}

export const fetchTrims = async (year, make, model) => {
  if (!year || !make || !model) return []

  // Try the Wheel-Size API first
  const trims = await requestArray('trims', { year, make, model })

  // If API returns data, use it
  if (trims && trims.length > 0) {
    return trims
  }

  // Fallback: Return common trim options for trucks/SUVs
  // This provides a better UX when the API doesn't have data
  console.log(`[ℹ️ trims] No API data for ${year} ${make} ${model}, using fallback trims`)

  const fallbackTrims = generateFallbackTrims(make, model)
  return fallbackTrims
}

// Generate common trim levels based on make
const generateFallbackTrims = (make, model) => {
  const makeLower = (make || '').toLowerCase()
  const modelLower = (model || '').toLowerCase()

  // Chevrolet Silverado trims
  if (makeLower === 'chevrolet' && modelLower.includes('silverado')) {
    return [
      { name: 'Work Truck (WT)', slug: 'wt' },
      { name: 'Custom', slug: 'custom' },
      { name: 'Custom Trail Boss', slug: 'custom-trail-boss' },
      { name: 'LT', slug: 'lt' },
      { name: 'RST', slug: 'rst' },
      { name: 'LT Trail Boss', slug: 'lt-trail-boss' },
      { name: 'LTZ', slug: 'ltz' },
      { name: 'High Country', slug: 'high-country' },
      { name: 'ZR2', slug: 'zr2' },
    ]
  }

  // Ford F-150 trims
  if (makeLower === 'ford' && modelLower.includes('f-150')) {
    return [
      { name: 'XL', slug: 'xl' },
      { name: 'STX', slug: 'stx' },
      { name: 'XLT', slug: 'xlt' },
      { name: 'Lariat', slug: 'lariat' },
      { name: 'King Ranch', slug: 'king-ranch' },
      { name: 'Platinum', slug: 'platinum' },
      { name: 'Limited', slug: 'limited' },
      { name: 'Tremor', slug: 'tremor' },
      { name: 'Raptor', slug: 'raptor' },
    ]
  }

  // RAM 1500 trims
  if (makeLower === 'ram' && modelLower.includes('1500')) {
    return [
      { name: 'Tradesman', slug: 'tradesman' },
      { name: 'Big Horn', slug: 'big-horn' },
      { name: 'Lone Star', slug: 'lone-star' },
      { name: 'Laramie', slug: 'laramie' },
      { name: 'Rebel', slug: 'rebel' },
      { name: 'Limited', slug: 'limited' },
      { name: 'Longhorn', slug: 'longhorn' },
      { name: 'TRX', slug: 'trx' },
    ]
  }

  // GMC Sierra trims
  if (makeLower === 'gmc' && modelLower.includes('sierra')) {
    return [
      { name: 'Pro', slug: 'pro' },
      { name: 'SLE', slug: 'sle' },
      { name: 'Elevation', slug: 'elevation' },
      { name: 'SLT', slug: 'slt' },
      { name: 'AT4', slug: 'at4' },
      { name: 'AT4X', slug: 'at4x' },
      { name: 'Denali', slug: 'denali' },
      { name: 'Denali Ultimate', slug: 'denali-ultimate' },
    ]
  }

  // Toyota Tacoma trims
  if (makeLower === 'toyota' && modelLower.includes('tacoma')) {
    return [
      { name: 'SR', slug: 'sr' },
      { name: 'SR5', slug: 'sr5' },
      { name: 'TRD Sport', slug: 'trd-sport' },
      { name: 'TRD Off-Road', slug: 'trd-off-road' },
      { name: 'Limited', slug: 'limited' },
      { name: 'TRD Pro', slug: 'trd-pro' },
      { name: 'Trailhunter', slug: 'trailhunter' },
    ]
  }

  // Toyota Tundra trims
  if (makeLower === 'toyota' && modelLower.includes('tundra')) {
    return [
      { name: 'SR', slug: 'sr' },
      { name: 'SR5', slug: 'sr5' },
      { name: 'Limited', slug: 'limited' },
      { name: 'Platinum', slug: 'platinum' },
      { name: 'TRD Pro', slug: 'trd-pro' },
      { name: '1794 Edition', slug: '1794-edition' },
      { name: 'Capstone', slug: 'capstone' },
    ]
  }

  // Toyota 4Runner trims
  if (makeLower === 'toyota' && modelLower.includes('4runner')) {
    return [
      { name: 'SR5', slug: 'sr5' },
      { name: 'TRD Sport', slug: 'trd-sport' },
      { name: 'TRD Off-Road', slug: 'trd-off-road' },
      { name: 'TRD Off-Road Premium', slug: 'trd-off-road-premium' },
      { name: 'Limited', slug: 'limited' },
      { name: 'TRD Pro', slug: 'trd-pro' },
    ]
  }

  // Jeep Wrangler trims
  if (makeLower === 'jeep' && modelLower.includes('wrangler')) {
    return [
      { name: 'Sport', slug: 'sport' },
      { name: 'Sport S', slug: 'sport-s' },
      { name: 'Willys', slug: 'willys' },
      { name: 'Sahara', slug: 'sahara' },
      { name: 'Rubicon', slug: 'rubicon' },
      { name: 'Rubicon 392', slug: 'rubicon-392' },
    ]
  }

  // Jeep Gladiator trims
  if (makeLower === 'jeep' && modelLower.includes('gladiator')) {
    return [
      { name: 'Sport', slug: 'sport' },
      { name: 'Sport S', slug: 'sport-s' },
      { name: 'Willys', slug: 'willys' },
      { name: 'Overland', slug: 'overland' },
      { name: 'Rubicon', slug: 'rubicon' },
      { name: 'Mojave', slug: 'mojave' },
    ]
  }

  // Nissan Titan trims
  if (makeLower === 'nissan' && modelLower.includes('titan')) {
    return [
      { name: 'S', slug: 's' },
      { name: 'SV', slug: 'sv' },
      { name: 'PRO-4X', slug: 'pro-4x' },
      { name: 'SL', slug: 'sl' },
      { name: 'Platinum Reserve', slug: 'platinum-reserve' },
    ]
  }

  // Default generic trims if no specific match
  return [
    { name: 'Base', slug: 'base' },
    { name: 'Sport', slug: 'sport' },
    { name: 'Premium', slug: 'premium' },
    { name: 'Limited', slug: 'limited' },
    { name: 'Off-Road', slug: 'off-road' },
  ]
}
