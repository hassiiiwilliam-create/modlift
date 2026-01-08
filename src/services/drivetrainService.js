// drivetrainService.js
// Fetches available drivetrains for vehicles from Supabase

import { supabase } from '../supabaseClient'

/**
 * Fetches available drivetrains for a specific vehicle configuration
 * Uses the Supabase function or direct query with fallback
 *
 * @param {Object} vehicle - Vehicle selection
 * @param {number|string} vehicle.year - Vehicle year
 * @param {string} vehicle.make - Vehicle make (e.g., 'RAM', 'Chevrolet')
 * @param {string} vehicle.model - Vehicle model (e.g., '1500', 'Silverado 1500')
 * @param {string} [vehicle.trim] - Optional trim level
 * @returns {Promise<Array<{value: string, label: string, isDefault: boolean}>>}
 */
export async function fetchDrivetrainsForVehicle({ year, make, model, trim }) {
  if (!year || !make || !model) {
    return getDefaultDrivetrains()
  }

  try {
    // Try using the Supabase function first
    const { data, error } = await supabase.rpc('get_vehicle_drivetrains', {
      p_year: parseInt(year, 10),
      p_make: make,
      p_model: model,
      p_trim: trim || null,
    })

    if (error) {
      console.warn('[drivetrainService] RPC error, falling back to direct query:', error.message)
      return await fetchDrivetrainsDirect({ year, make, model, trim })
    }

    if (data && data.length > 0) {
      return data.map((item) => ({
        value: item.drivetrain,
        label: item.drivetrain_label,
        isDefault: item.is_default,
      }))
    }

    // No data found, try direct query
    return await fetchDrivetrainsDirect({ year, make, model, trim })
  } catch (err) {
    console.error('[drivetrainService] Error fetching drivetrains:', err)
    return getFallbackDrivetrains(make, model)
  }
}

/**
 * Direct query fallback if RPC function isn't available
 */
async function fetchDrivetrainsDirect({ year, make, model, trim }) {
  try {
    const yearInt = parseInt(year, 10)

    let query = supabase
      .from('vehicle_drivetrains')
      .select('drivetrain, drivetrain_label, is_default')
      .ilike('make', make)
      .ilike('model', model)
      .lte('year_start', yearInt)
      .gte('year_end', yearInt)

    // If trim is provided, look for trim-specific or null trim (generic)
    if (trim) {
      query = query.or(`trim.ilike.${trim},trim.is.null`)
    }

    const { data, error } = await query.order('is_default', { ascending: false })

    if (error) {
      console.warn('[drivetrainService] Direct query error:', error.message)
      return getFallbackDrivetrains(make, model)
    }

    if (data && data.length > 0) {
      // Deduplicate drivetrains
      const seen = new Set()
      const unique = data.filter((item) => {
        if (seen.has(item.drivetrain)) return false
        seen.add(item.drivetrain)
        return true
      })

      return unique.map((item) => ({
        value: item.drivetrain,
        label: item.drivetrain_label,
        isDefault: item.is_default,
      }))
    }

    return getFallbackDrivetrains(make, model)
  } catch (err) {
    console.error('[drivetrainService] Direct query exception:', err)
    return getFallbackDrivetrains(make, model)
  }
}

/**
 * Returns default drivetrain options when no vehicle is selected
 */
export function getDefaultDrivetrains() {
  return [
    { value: '4WD', label: '4WD (4x4)', isDefault: true },
    { value: 'RWD', label: 'RWD (Rear Wheel)', isDefault: false },
    { value: 'AWD', label: 'AWD (All Wheel)', isDefault: false },
    { value: 'FWD', label: 'FWD (Front Wheel)', isDefault: false },
  ]
}

/**
 * Smart fallback based on vehicle make/model when database has no data
 * This ensures users always have drivetrain options
 */
function getFallbackDrivetrains(make, model) {
  const makeLower = (make || '').toLowerCase()
  const modelLower = (model || '').toLowerCase()

  // Jeep Wrangler/Gladiator - 4WD only
  if (makeLower === 'jeep' && (modelLower.includes('wrangler') || modelLower.includes('gladiator'))) {
    return [{ value: '4WD', label: '4WD (4x4)', isDefault: true }]
  }

  // Toyota Land Cruiser, Lexus GX/LX - 4WD only
  if (
    (makeLower === 'toyota' && modelLower.includes('land cruiser')) ||
    (makeLower === 'lexus' && (modelLower.includes('gx') || modelLower.includes('lx')))
  ) {
    return [{ value: '4WD', label: '4WD (4x4)', isDefault: true }]
  }

  // Ford Bronco - 4WD only
  if (makeLower === 'ford' && modelLower === 'bronco') {
    return [{ value: '4WD', label: '4WD (4x4)', isDefault: true }]
  }

  // Honda/Acura crossovers - FWD/AWD
  if (makeLower === 'honda' || makeLower === 'acura') {
    if (modelLower.includes('ridgeline') || modelLower.includes('passport') || modelLower.includes('pilot')) {
      return [
        { value: 'AWD', label: 'AWD (All Wheel)', isDefault: true },
        { value: 'FWD', label: 'FWD (Front Wheel)', isDefault: false },
      ]
    }
  }

  // Ford Bronco Sport - FWD/AWD
  if (makeLower === 'ford' && modelLower.includes('bronco sport')) {
    return [
      { value: 'AWD', label: 'AWD (All Wheel)', isDefault: true },
      { value: 'FWD', label: 'FWD (Front Wheel)', isDefault: false },
    ]
  }

  // Most trucks - RWD/4WD
  const truckKeywords = ['1500', '2500', '3500', 'f-150', 'f-250', 'f-350', 'silverado', 'sierra', 'tundra', 'titan', 'tacoma', 'colorado', 'canyon', 'ranger', 'frontier', 'gladiator']
  const isTruck = truckKeywords.some((keyword) => modelLower.includes(keyword))

  if (isTruck) {
    return [
      { value: '4WD', label: '4WD (4x4)', isDefault: true },
      { value: 'RWD', label: 'RWD (Rear Wheel)', isDefault: false },
    ]
  }

  // SUVs - typically RWD/4WD or FWD/AWD
  const bodyOnFrameSuvs = ['4runner', 'sequoia', 'grand cherokee', 'tahoe', 'suburban', 'yukon', 'expedition', 'armada']
  const isBodyOnFrame = bodyOnFrameSuvs.some((keyword) => modelLower.includes(keyword))

  if (isBodyOnFrame) {
    return [
      { value: '4WD', label: '4WD (4x4)', isDefault: true },
      { value: 'RWD', label: 'RWD (Rear Wheel)', isDefault: false },
    ]
  }

  // Default fallback - all options
  return getDefaultDrivetrains()
}

/**
 * Check if vehicle_drivetrains table exists and has data
 * Useful for admin/setup purposes
 */
export async function checkDrivetrainDataStatus() {
  try {
    const { count, error } = await supabase
      .from('vehicle_drivetrains')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return { exists: false, count: 0, error: error.message }
    }

    return { exists: true, count: count || 0, error: null }
  } catch (err) {
    return { exists: false, count: 0, error: err.message }
  }
}
