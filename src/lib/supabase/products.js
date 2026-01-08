import { supabase } from '../../supabaseClient'

const DEFAULT_PAGE_SIZE = 12

const isNonEmpty = (value) => {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ''
}

export async function fetchFilteredProducts(filters = {}, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  let query = supabase.from('products').select('*', { count: 'exact' })

  const applyArrayFilter = (column, values) => {
    if (Array.isArray(values) && values.length) {
      query = query.in(column, values)
    }
  }

  const applySingleFilter = (column, value) => {
    if (isNonEmpty(value)) {
      query = query.eq(column, value)
    }
  }

  const keyword = (filters.query ?? filters.search)?.trim()
  if (keyword) {
    const term = `%${keyword}%`
    query = query.or(
      `title.ilike.${term},description.ilike.${term},sku.ilike.${term}`
    )
  }

  if (isNonEmpty(filters.price_min)) {
    query = query.gte('price', Number(filters.price_min))
  }

  if (isNonEmpty(filters.price_max)) {
    query = query.lte('price', Number(filters.price_max))
  }

  applyArrayFilter('brand', filters.brand)
  applyArrayFilter('category', filters.category)
  applyArrayFilter('wheel_brand', filters.wheel_brand)
  applyArrayFilter('wheel_diameter', filters.diameter ?? filters.wheel_diameter)
  applyArrayFilter('offset', filters.offset)
  applyArrayFilter('bolt_pattern', filters.bolt_pattern)
  applyArrayFilter('finish', filters.finish ?? filters.wheel_finish)
  applyArrayFilter('wheel_finish', filters.wheel_finish)
  applyArrayFilter('aspect_ratio', filters.aspect_ratio)
  applyArrayFilter('tire_width', filters.tire_width)
  applyArrayFilter('tire_brand', filters.tire_brand)
  applyArrayFilter('rim_diameter', filters.rim_diameter)
  applyArrayFilter('tire_type', filters.tire_type)
  applyArrayFilter('tire_season', filters.tire_season ?? filters.season)
  applyArrayFilter('lift_height_range', filters.lift_height_range ?? filters.lift_height)
  applyArrayFilter('lift_height', filters.lift_height)
  applyArrayFilter('lift_brand', filters.lift_brand)
  applyArrayFilter('accessory_type', filters.accessory_type)
  applyArrayFilter('vehicle_year', filters.vehicle_year)
  applyArrayFilter('vehicle_make', filters.vehicle_make)
  applyArrayFilter('vehicle_model', filters.vehicle_model)
  applyArrayFilter('color', filters.color)
  applyArrayFilter('brand_style', filters.brand_style)
  applyArrayFilter('season', filters.season)
  applyArrayFilter('warehouse_location', filters.warehouse_location)

  applySingleFilter('sku', filters.sku)

  if (filters.on_sale) {
    query = query.eq('on_sale', true)
  }

  if (filters.free_shipping) {
    query = query.eq('free_shipping', true)
  }

  if (filters.local_pickup) {
    query = query.eq('local_pickup_available', true)
  }

  if (filters.featured) {
    query = query.eq('featured', true)
  }

  if (filters.show_combos_only || filters.show_combos) {
    query = query.eq('category', 'Combo')
  }

  if (filters.in_stock) {
    query = query.eq('in_stock', true)
  }

  // Sorting control
  switch (filters.sort_by || filters.sortBy || filters.sort) {
    case 'price_low_high':
      query = query.order('price', { ascending: true })
      break
    case 'price_high_low':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('title', { ascending: true })
      break
  }

  const limit = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1
  const from = (currentPage - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    throw error
  }

  const items = data ?? []
  const total = typeof count === 'number' ? count : items.length
  const more = items.length === limit && from + items.length < total

  return { data: items, count: total, more }
}

export const fetchFilterFacet = async (column) => {
  if (!column) return []

  const { data, error } = await supabase.from('products').select(`${column}`).not(column, 'is', null)

  if (error) {
    console.error(`Failed to load facet for ${column}`, error)
    return []
  }

  const values = new Set()

  data.forEach((entry) => {
    const value = entry?.[column]
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) values.add(String(item))
      })
    } else if (value) {
      values.add(String(value))
    }
  })

  return Array.from(values).sort((a, b) => a.localeCompare(b))
}
