import { supabase } from '../supabaseClient'

const isUnset = (value) =>
  value === undefined || value === null || value === '' || value === 'all'

export async function fetchGalleryItems(filters = {}) {
  let query = supabase
    .from('gallery')
    .select('*')
    .eq('archived', false)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (!isUnset(filters.vehicle_make)) {
    query = query.eq('vehicle_make', filters.vehicle_make)
  }

  if (!isUnset(filters.vehicle_model)) {
    query = query.eq('vehicle_model', filters.vehicle_model)
  }

  if (!isUnset(filters.vehicle_year)) {
    query = query.eq('vehicle_year', filters.vehicle_year)
  }

  if (!isUnset(filters.wheel_size)) {
    query = query.eq('wheel_size', filters.wheel_size)
  }

  if (!isUnset(filters.tire_size)) {
    query = query.eq('tire_size', filters.tire_size)
  }

  if (!isUnset(filters.lift_height)) {
    query = query.eq('lift_height', filters.lift_height)
  }

  if (filters.featured_only) {
    query = query.eq('featured', true)
  }

  if (filters.search) {
    const term = filters.search.trim()
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,vehicle_make.ilike.%${term}%,vehicle_model.ilike.%${term}%,lift_height.ilike.%${term}%,wheel_size.ilike.%${term}%,tire_size.ilike.%${term}%`
      )
    }
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function fetchFeaturedGalleryItems(limit = 6) {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('archived', false)
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function fetchGalleryMakes() {
  const { data, error } = await supabase
    .from('gallery')
    .select('vehicle_make')
    .eq('archived', false)

  if (error) throw error

  const makes = [...new Set(data.map((item) => item.vehicle_make))].filter(Boolean).sort()
  return makes
}

export async function fetchGalleryModels(make) {
  if (!make) return []

  const { data, error } = await supabase
    .from('gallery')
    .select('vehicle_model')
    .eq('archived', false)
    .eq('vehicle_make', make)

  if (error) throw error

  const models = [...new Set(data.map((item) => item.vehicle_model))].filter(Boolean).sort()
  return models
}

export async function fetchGalleryYears(make, model) {
  let query = supabase
    .from('gallery')
    .select('vehicle_year')
    .eq('archived', false)

  if (make) {
    query = query.eq('vehicle_make', make)
  }
  if (model) {
    query = query.eq('vehicle_model', model)
  }

  const { data, error } = await query
  if (error) throw error

  const years = [...new Set(data.map((item) => item.vehicle_year))].filter(Boolean).sort((a, b) => b - a)
  return years
}

// Fetch distinct wheel sizes from gallery
export async function fetchGalleryWheelSizes() {
  const { data, error } = await supabase
    .from('gallery')
    .select('wheel_size')
    .eq('archived', false)

  if (error) throw error

  const sizes = [...new Set(data.map((item) => item.wheel_size))]
    .filter(Boolean)
    .sort((a, b) => {
      // Extract numeric part for sorting (e.g., "20x10" -> 20)
      const aNum = parseInt(a.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })
  return sizes
}

// Fetch distinct tire sizes from gallery
export async function fetchGalleryTireSizes() {
  const { data, error } = await supabase
    .from('gallery')
    .select('tire_size')
    .eq('archived', false)

  if (error) throw error

  const sizes = [...new Set(data.map((item) => item.tire_size))]
    .filter(Boolean)
    .sort((a, b) => {
      // Extract first numeric part for sorting (e.g., "35x12.50R20" -> 35)
      const aNum = parseInt(a.match(/\d+/)?.[0] || '0', 10)
      const bNum = parseInt(b.match(/\d+/)?.[0] || '0', 10)
      return aNum - bNum
    })
  return sizes
}

// Fetch distinct lift heights from gallery
export async function fetchGalleryLiftHeights() {
  const { data, error } = await supabase
    .from('gallery')
    .select('lift_height')
    .eq('archived', false)

  if (error) throw error

  const heights = [...new Set(data.map((item) => item.lift_height))]
    .filter(Boolean)
    .sort((a, b) => {
      // Extract numeric part for sorting (e.g., "6 inch" -> 6, "2.5\"" -> 2.5)
      const aNum = parseFloat(a.match(/[\d.]+/)?.[0] || '0')
      const bNum = parseFloat(b.match(/[\d.]+/)?.[0] || '0')
      return aNum - bNum
    })
  return heights
}
