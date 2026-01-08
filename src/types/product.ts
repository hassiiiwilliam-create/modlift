// ============================================================================
// Product Type Definitions for E-commerce App
// Matches database schema and admin app types
// ============================================================================

// Category types
export type ProductCategory = 'wheels' | 'tires' | 'suspension' | 'accessories' | 'combo'

export type TireType = 'all_terrain' | 'mud_terrain' | 'hybrid' | 'all_season' | 'highway'

export type SuspensionType =
  | 'lift_kits'
  | 'leveling'
  | 'coilovers'
  | 'shocks_struts'
  | 'air_suspension'
  | 'lowering'
  | 'body_lift'

export type AccessoryType = 'winch' | 'lighting' | 'fender_flares' | 'bumper' | 'other'

// Vehicle compatibility
export type VehicleCompatibility = {
  make?: string
  model?: string
  year_start?: number
  year_end?: number
  drivetrain?: '2WD' | '4WD' | 'AWD'
  trim?: string
}

// Complete Product type
export type Product = {
  id: string
  title: string
  description: string | null
  sku: string | null
  price: number

  // Category
  category: ProductCategory | null
  subcategory: string | null
  name: string | null
  brand: string | null

  // Pricing
  msrp: number | null
  sale_price: number | null

  // Stock
  in_stock: boolean
  stock_quantity: number

  // Status
  archived: boolean
  on_sale: boolean
  free_shipping: boolean
  featured: boolean

  // Images
  image_url: string | null
  additional_images: string[] | null
  thumbnail_url: string | null

  // Wheel fields
  wheel_diameter: number | null
  wheel_width: number | null
  wheel_offset: number | null
  bolt_pattern: string | null
  wheel_brand: string | null
  wheel_model: string | null
  wheel_finish: string | null
  wheel_color: string | null
  material: string | null
  weight: number | null
  load_rating: number | null
  backspacing: number | null
  center_bore: number | null

  // Tire fields
  tire_size: string | null
  tire_width: number | null
  aspect_ratio: number | null
  rim_diameter: number | null
  tire_type: TireType | null
  tire_brand: string | null
  tire_model: string | null
  season: string | null
  load_index: number | null
  speed_rating: string | null
  ply_rating: number | null
  tread_depth: number | null
  sidewall: string | null

  // Suspension fields
  suspension_type: SuspensionType | null
  lift_height: number | null
  lift_brand: string | null
  suspension_position: string | null
  includes_shocks: boolean
  includes_control_arms: boolean
  includes_hardware: boolean

  // Accessory fields
  accessory_type: AccessoryType | null
  color: string | null

  // Combo fields
  is_combo: boolean
  combo_components: Record<string, unknown> | null
  combo_savings: number | null

  // SEO
  meta_title: string | null
  meta_description: string | null
  slug: string | null
  priority: number

  // Compatibility
  vehicle_compatibility: VehicleCompatibility | null
  product_tags: string[]

  // Timestamps
  created_at: string
  updated_at: string
}

// Cart item type
export type CartItem = {
  product: Product
  quantity: number
}

// Filter types
export type ProductFilters = {
  category?: ProductCategory | ProductCategory[]
  subcategory?: string
  brand?: string | string[]

  // Wheel filters
  wheel_diameter?: number | number[]
  wheel_width?: number | number[]
  wheel_offset?: number
  bolt_pattern?: string | string[]
  wheel_brand?: string | string[]
  wheel_model?: string
  wheel_finish?: string | string[]
  material?: string | string[]
  weight?: number

  // Tire filters
  tire_size?: string | string[]
  tire_type?: TireType | TireType[]
  tire_brand?: string | string[]
  rim_diameter?: number | number[]

  // Suspension filters
  suspension_type?: SuspensionType | SuspensionType[]
  lift_height?: number | number[]
  lift_brand?: string | string[]

  // Price filters
  price_min?: number
  price_max?: number

  // Status filters
  on_sale?: boolean
  free_shipping?: boolean
  in_stock?: boolean

  // Vehicle filters
  vehicle_year?: number
  vehicle_make?: string
  vehicle_model?: string
  vehicle_trim?: string

  // Search
  search?: string

  // Pagination
  page?: number
  per_page?: number

  // Sorting
  sort_by?: 'price' | 'name' | 'created_at' | 'popularity'
  sort_order?: 'asc' | 'desc'
}

// API response type
export type ProductsResponse = {
  products: Product[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
