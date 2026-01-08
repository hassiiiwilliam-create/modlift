import { supabase } from '../supabaseClient'

const DEFAULT_PAGE_SIZE = 12

const isNonEmpty = (value) => {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ''
}

export async function fetchFilteredProducts(filters = {}, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const limit = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1
  const from = (currentPage - 1) * limit
  const to = from + limit - 1

  // Check if vehicle is fully selected (for fitment filtering)
  const hasVehicleSelected =
    filters &&
    filters.vehicle_year &&
    filters.vehicle_make &&
    filters.vehicle_model &&
    filters.vehicle_trim

  let query = supabase.from('products').select('*', { count: 'exact' })

  const applyEqFilter = (column, value) => {
    if (isNonEmpty(value)) {
      query = query.eq(column, value)
    }
  }

  const keyword = (filters.query ?? filters.search)?.trim()
  if (keyword) {
    const term = `%${keyword}%`
    query = query.or(
      `title.ilike.${term},name.ilike.${term},description.ilike.${term},sku.ilike.${term}`
    )
  }

  const minPriceInput = (filters.price_min ?? '').toString().trim()
  if (minPriceInput) {
    const minPrice = Number(minPriceInput)
    if (Number.isFinite(minPrice)) {
      query = query.gte('price', minPrice)
    }
  }

  const maxPriceInput = (filters.price_max ?? '').toString().trim()
  if (maxPriceInput) {
    const maxPrice = Number(maxPriceInput)
    if (Number.isFinite(maxPrice)) {
      query = query.lte('price', maxPrice)
    }
  }

  // Handle category as array or single value
  const categories = Array.isArray(filters.category)
    ? filters.category.filter((c) => c && c.trim())
    : filters.category
      ? [filters.category]
      : []
  if (categories.length > 0) {
    query = query.in('category', categories)
  }

  // Only apply vehicle compatibility filter if a vehicle is fully selected
  if (hasVehicleSelected) {
    const vehicleCompatibilityFilter = {}
    const rawYear = (filters.vehicle_year ?? '').toString().trim()
    if (rawYear) {
      const numericYear = Number.parseInt(rawYear, 10)
      vehicleCompatibilityFilter.year = Number.isFinite(numericYear) ? numericYear : rawYear
    }

    const trimmedMake = (filters.vehicle_make ?? '').toString().trim()
    if (trimmedMake) {
      vehicleCompatibilityFilter.make = trimmedMake
    }

    const trimmedModel = (filters.vehicle_model ?? '').toString().trim()
    if (trimmedModel) {
      vehicleCompatibilityFilter.model = trimmedModel
    }

    const trimmedTrim = (filters.vehicle_trim ?? '').toString().trim()
    if (trimmedTrim) {
      vehicleCompatibilityFilter.trim = trimmedTrim
    }

    const trimmedDrivetrain = (filters.drivetrain ?? '').toString().trim()
    if (trimmedDrivetrain) {
      vehicleCompatibilityFilter.drivetrain = trimmedDrivetrain
    }

    if (Object.keys(vehicleCompatibilityFilter).length > 0) {
      query = query.contains('vehicle_compatibility', vehicleCompatibilityFilter)
    }
  }

  const liftHeight = (filters.lift_height_range || filters.lift_height || '').toString().toLowerCase()
  if (liftHeight) {
    if (liftHeight.includes('level')) {
      query = query.eq('lift_height', 0)
    } else if (liftHeight.includes('+')) {
      const numeric = parseFloat(liftHeight.replace(/[^0-9.]/g, ''))
      if (Number.isFinite(numeric)) {
        query = query.gte('lift_height', numeric)
      }
    } else {
      const numeric = parseFloat(liftHeight.replace(/[^0-9.]/g, ''))
      if (Number.isFinite(numeric)) {
        query = query.eq('lift_height', numeric)
      }
    }
  }

  const wheelDiameter = (filters.wheel_diameter || '').toString()
  if (wheelDiameter) {
    if (wheelDiameter.includes('+')) {
      const numeric = parseInt(wheelDiameter.replace(/[^0-9]/g, ''), 10)
      if (Number.isFinite(numeric)) {
        query = query.gte('wheel_diameter', numeric)
      }
    } else {
      const numeric = parseInt(wheelDiameter.replace(/[^0-9]/g, ''), 10)
      if (Number.isFinite(numeric)) {
        query = query.eq('wheel_diameter', numeric)
      }
    }
  }

  if (filters.tire_size) {
    query = query.ilike('tire_size', `%${filters.tire_size}%`)
  }

  if (filters.brand) {
    query = query.ilike('brand', `%${filters.brand}%`)
  }

  // Apply drivetrain filter independently (works with or without vehicle selection)
  const drivetrainFilter = (filters.drivetrain ?? '').toString().trim()
  if (drivetrainFilter) {
    query = query.contains('vehicle_compatibility', { drivetrain: drivetrainFilter })
  }

  const preferenceRange = filters.fitment_preference_range
  if (preferenceRange && typeof preferenceRange === 'object') {
    const min = Number(preferenceRange.offset_min)
    const max = Number(preferenceRange.offset_max)
    if (Number.isFinite(min)) {
      query = query.gte('offset', min)
    }
    if (Number.isFinite(max)) {
      query = query.lte('offset', max)
    }
  }

  const productTags = Array.isArray(filters.tags)
    ? filters.tags.filter((value) => value && value.trim().length > 0)
    : []
  if (productTags.length > 0) {
    query = query.overlaps('product_tags', productTags)
  }

  applyEqFilter('bolt_pattern', filters.boltPattern ?? filters.bolt_pattern)
  applyEqFilter('offset', filters.offset ?? filters.wheel_offset)
  applyEqFilter('wheel_width', filters.wheelWidth ?? filters.wheel_width)
  applyEqFilter('wheel_finish', filters.wheelFinish ?? filters.wheel_finish)
  applyEqFilter('wheel_brand', filters.wheelBrand ?? filters.wheel_brand)
  applyEqFilter('wheel_model', filters.wheelModel ?? filters.wheel_model)
  applyEqFilter('weight', filters.wheelWeight ?? filters.wheel_weight)
  applyEqFilter('material', filters.wheelMaterial ?? filters.wheel_material)
  applyEqFilter('tire_width', filters.tireWidth ?? filters.tire_width)
  applyEqFilter('aspect_ratio', filters.aspectRatio ?? filters.aspect_ratio)
  applyEqFilter('rim_diameter', filters.rimDiameter ?? filters.rim_diameter)
  applyEqFilter('tire_type', filters.tireType ?? filters.tire_type)
  applyEqFilter('tire_brand', filters.tireBrand ?? filters.tire_brand)
  applyEqFilter('suspension_type', filters.suspensionType ?? filters.suspension_type)
  applyEqFilter('lift_brand', filters.liftBrand ?? filters.lift_brand)
  applyEqFilter('accessory_type', filters.accessoryType ?? filters.accessory_type)
  applyEqFilter('color', filters.color)
  applyEqFilter('brand_style', filters.brand_style)
  applyEqFilter('season', filters.season)
  applyEqFilter('warehouse_location', filters.warehouseLocation ?? filters.warehouse_location)

  if (filters.on_sale) {
    query = query.eq('on_sale', true)
  }

  if (filters.free_shipping) {
    query = query.eq('free_shipping', true)
  }

  if (filters.combo_only || filters.show_combos_only) {
    query = query.ilike('category', '%combo%')
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    throw error
  }

  const items = data ?? []
  const total = typeof count === 'number' ? count : items.length
  const hasMore = items.length === limit && from + items.length < total

  return {
    data: items,
    total,
    hasMore,
  }
}
