import { supabase } from '../supabaseClient'

const coalesceArray = (values) => Array.from(new Set(values.filter(Boolean)))

const isUnset = (value) =>
  value === undefined || value === null || value === '' || value === 'all' || (Array.isArray(value) && value.length === 0)

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) throw error
  return data ?? []
}

export async function fetchDistinct(options = {}) {
  const { column, filter } = options
  if (!column) return []
  let query = supabase.from('products').select(column)
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (!isUnset(value)) {
        query = query.eq(key, value)
      }
    })
  }
  const { data, error } = await query
  if (error) throw error
  return coalesceArray(data.map((item) => item[column]))
}

export async function fetchFilteredProducts(filters = {}) {
  let query = supabase.from('products').select('*')

  const eqField = (column, value) => {
    if (isUnset(value)) return
    if (Array.isArray(value)) {
      if (value.length > 0) query = query.in(column, value)
    } else {
      query = query.eq(column, value)
    }
  }

  const ilikeField = (column, value) => {
    if (value && value.trim()) {
      query = query.ilike(column, `%${value.trim()}%`)
    }
  }

  const boolField = (column, value) => {
    if (value === true) {
      query = query.eq(column, true)
    }
  }

  eqField('category', filters.category)
  eqField('brand', filters.brand)
  eqField('wheel_diameter', filters.wheelDiameter ?? filters.wheel_diameter)
  eqField('bolt_pattern', filters.boltPattern ?? filters.bolt_pattern)
  eqField('offset', filters.offset)
  eqField('wheel_finish', filters.wheelFinish ?? filters.wheel_finish)
  eqField('wheel_brand', filters.wheelBrand ?? filters.wheel_brand)
  eqField('tire_width', filters.tireWidth ?? filters.tire_width)
  eqField('aspect_ratio', filters.aspectRatio ?? filters.aspect_ratio)
  eqField('rim_diameter', filters.rimDiameter ?? filters.rim_diameter)
  eqField('tire_type', filters.tireType ?? filters.tire_type)
  eqField('tire_brand', filters.tireBrand ?? filters.tire_brand)
  eqField('lift_height', filters.liftHeight ?? filters.lift_height)
  eqField('lift_brand', filters.liftBrand ?? filters.lift_brand)
  eqField('accessory_type', filters.accessoryType ?? filters.accessory_type)
  eqField('vehicle_year', filters.vehicle_year)
  eqField('vehicle_make', filters.vehicle_make)
  eqField('vehicle_model', filters.vehicle_model)
  eqField('color', filters.color)
  eqField('brand_style', filters.brand_style)
  eqField('season', filters.season)
  eqField('warehouse_location', filters.warehouseLocation ?? filters.warehouse_location)

  boolField('in_stock', filters.inStock ?? filters.in_stock)
  boolField('on_sale', filters.onSale ?? filters.on_sale)
  boolField('free_shipping', filters.freeShipping ?? filters.free_shipping)
  boolField('local_pickup_available', filters.localPickup ?? filters.local_pickup)
  boolField('featured', filters.featuredOnly ?? filters.show_featured)

  if (filters.comboOnly || filters.show_combos) {
    query = query.eq('category', 'combo')
  }

  if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
    const [min, max] = filters.priceRange
    if (typeof min === 'number' && typeof max === 'number') {
      query = query.gte('price', min).lte('price', max)
    }
  }

  if (!isUnset(filters.price_min)) {
    query = query.gte('price', filters.price_min)
  }
  if (!isUnset(filters.price_max)) {
    query = query.lte('price', filters.price_max)
  }

  if (filters.search) {
    const term = filters.search.trim()
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,sku.ilike.%${term}%`
      )
    }
  }

  ilikeField('vehicle_fitment', filters.fitmentQuery ?? filters.fits_vehicle)
  ilikeField('compatible_vehicles', filters.compatibleVehicles)
  ilikeField('lift_height_range', filters.liftHeightRange)
  ilikeField('finish_color', filters.finishColor ?? filters.color)
  ilikeField('sku', filters.sku ?? filters.search_sku)

  switch (filters.sortBy) {
    case 'price_low_high':
      query = query.order('price', { ascending: true })
      break
    case 'price_high_low':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}
