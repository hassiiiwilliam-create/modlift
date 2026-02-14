// wheelsizeService.js

// Use the Supabase Edge Function as the proxy (works in both dev and production)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[WheelSize] Missing required environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY')
}

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

  // Check if we have custom fallback trims for this make/model first
  // The WheelSize API returns generation codes (like "V (DT) Facelift") instead of
  // actual marketing trim names (like "Laramie", "Limited", "Big Horn")
  const fallbackTrims = generateFallbackTrims(make, model)

  // If we have specific fallback trims for this vehicle, use them
  // (fallback returns generic trims if no match, so check if it's a known vehicle)
  if (isKnownVehicle(make, model)) {
    console.log(`[ℹ️ trims] Using curated trim list for ${year} ${make} ${model}`)
    return fallbackTrims
  }

  // For unknown vehicles, try the Wheel-Size API
  const trims = await requestArray('trims', { year, make, model })

  // If API returns data that looks like actual trim names (not generation codes), use it
  if (trims && trims.length > 0 && !looksLikeGenerationCodes(trims)) {
    return trims
  }

  // Fallback to generic trims
  console.log(`[ℹ️ trims] Using generic trims for ${year} ${make} ${model}`)
  return fallbackTrims
}

// Check if the API returned generation/platform codes instead of trim names
const looksLikeGenerationCodes = (trims) => {
  if (!trims || trims.length === 0) return false

  // Generation codes typically have patterns like:
  // - Roman numerals: "IV", "V", "VI"
  // - Platform codes in parentheses: "(DT)", "(DS/DJ)", "(JK)", "(JL)"
  // - "Facelift" suffix
  const generationPatterns = [
    /^[IVX]+\s*\(/i,           // Starts with roman numerals followed by (
    /\([A-Z]{2,}(\/[A-Z]+)?\)/i, // Contains platform code like (DT), (DS/DJ)
    /facelift/i,               // Contains "Facelift"
    /^[IVX]+$/,                // Just roman numerals
    /^\d+(st|nd|rd|th)\s+gen/i // "1st gen", "2nd gen", etc.
  ]

  // If more than half the trims look like generation codes, return true
  let generationCount = 0
  for (const trim of trims) {
    const name = trim.name || trim.slug || trim
    if (typeof name === 'string') {
      for (const pattern of generationPatterns) {
        if (pattern.test(name)) {
          generationCount++
          break
        }
      }
    }
  }

  return generationCount > trims.length / 2
}

// Check if we have specific trim data for this make/model
const isKnownVehicle = (make, model) => {
  const makeLower = (make || '').toLowerCase()
  const modelLower = (model || '').toLowerCase()

  const knownVehicles = [
    { make: 'chevrolet', models: ['silverado'] },
    { make: 'ford', models: ['f-150', 'f150'] },
    { make: 'ram', models: ['1500', '2500', '3500'] },
    { make: 'gmc', models: ['sierra'] },
    { make: 'toyota', models: ['tacoma', 'tundra', '4runner'] },
    { make: 'jeep', models: ['wrangler', 'gladiator'] },
    { make: 'nissan', models: ['titan', 'frontier'] },
  ]

  for (const vehicle of knownVehicles) {
    if (makeLower === vehicle.make) {
      for (const m of vehicle.models) {
        if (modelLower.includes(m)) {
          return true
        }
      }
    }
  }

  return false
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

  // Nissan Frontier trims
  if (makeLower === 'nissan' && modelLower.includes('frontier')) {
    return [
      { name: 'S', slug: 's' },
      { name: 'SV', slug: 'sv' },
      { name: 'PRO-4X', slug: 'pro-4x' },
      { name: 'PRO-X', slug: 'pro-x' },
      { name: 'Desert Runner', slug: 'desert-runner' },
    ]
  }

  // RAM 2500/3500 Heavy Duty trims
  if (makeLower === 'ram' && (modelLower.includes('2500') || modelLower.includes('3500'))) {
    return [
      { name: 'Tradesman', slug: 'tradesman' },
      { name: 'Big Horn', slug: 'big-horn' },
      { name: 'Lone Star', slug: 'lone-star' },
      { name: 'Laramie', slug: 'laramie' },
      { name: 'Power Wagon', slug: 'power-wagon' },
      { name: 'Limited', slug: 'limited' },
      { name: 'Longhorn', slug: 'longhorn' },
      { name: 'Limited Longhorn', slug: 'limited-longhorn' },
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
