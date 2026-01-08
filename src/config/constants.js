// ============================================================================
// ModLift E-commerce - Centralized Configuration
// ============================================================================

// Tax and Pricing
export const TAX_RATE = 0.0825 // 8.25% Texas sales tax
export const FREE_SHIPPING_THRESHOLD = 500 // Orders over $500 get free shipping
export const DEFAULT_SHIPPING_COST = 49.99

// Pagination
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100

// Product Categories
export const PRODUCT_CATEGORIES = [
  { value: 'wheels', label: 'Wheels' },
  { value: 'tires', label: 'Tires' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'combo', label: 'Wheel & Tire Combos' },
]

export const TIRE_TYPES = [
  { value: 'all_terrain', label: 'All Terrain' },
  { value: 'mud_terrain', label: 'Mud Terrain' },
  { value: 'hybrid', label: 'Hybrid AT/MT' },
  { value: 'all_season', label: 'All Season' },
  { value: 'highway', label: 'Highway' },
]

export const SUSPENSION_TYPES = [
  { value: 'lift_kits', label: 'Lift Kits' },
  { value: 'leveling', label: 'Leveling Kits' },
  { value: 'coilovers', label: 'Coilovers' },
  { value: 'shocks_struts', label: 'Shocks & Struts' },
  { value: 'air_suspension', label: 'Air Suspension' },
  { value: 'lowering', label: 'Lowering Kits' },
  { value: 'body_lift', label: 'Body Lift Kits' },
]

export const ACCESSORY_TYPES = [
  { value: 'winch', label: 'Winch' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'fender_flares', label: 'Fender Flares' },
  { value: 'bumper', label: 'Bumpers' },
  { value: 'other', label: 'Other' },
]

// Wheel Specifications
export const WHEEL_DIAMETERS = [15, 16, 17, 18, 19, 20, 22, 24, 26]
export const WHEEL_WIDTHS = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 14]

export const WHEEL_FINISHES = [
  'Matte Black',
  'Gloss Black',
  'Satin Black',
  'Black Milled',
  'Matte Bronze',
  'Satin Bronze',
  'Gunmetal',
  'Machined Black',
  'Chrome',
  'Polished',
  'Gloss Black Machined',
]

export const WHEEL_MATERIALS = [
  'Aluminum',
  'Forged Aluminum',
  'Steel',
  'Carbon Fiber',
]

export const BOLT_PATTERNS = [
  '5x114.3',
  '5x120',
  '5x127',
  '5x139.7',
  '5x150',
  '6x114.3',
  '6x120',
  '6x135',
  '6x139.7',
  '8x165.1',
  '8x170',
  '8x180',
]

// Popular Brands
export const WHEEL_BRANDS = [
  'Fuel Off-Road',
  'Method Race Wheels',
  'KMC',
  'Vision',
  'Moto Metal',
  'American Force',
  'Hostile',
  'XD Series',
  'Raceline',
  'Black Rhino',
]

export const TIRE_BRANDS = [
  'BFGoodrich',
  'Nitto',
  'Toyo',
  'Falken',
  'Cooper',
  'Mickey Thompson',
  'Goodyear',
  'Maxxis',
  'General',
  'Yokohama',
]

export const SUSPENSION_BRANDS = [
  'Rough Country',
  'BDS Suspension',
  'Fox',
  'Icon Vehicle Dynamics',
  'Bilstein',
  'Rancho',
  'Skyjacker',
  'Pro Comp',
  'Fabtech',
  'ReadyLift',
  'Air Lift',
  'Belltech',
]

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'modlift_cart_v1',
  VEHICLE: 'modlift_vehicle',
  FILTERS: 'modlift_filters',
}

// Currency Formatter
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Date Formatter
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Filter Labels (for UI display)
export const FILTER_LABELS = {
  category: 'Category',
  brand: 'Brand',
  wheel_diameter: 'Wheel Diameter',
  wheel_width: 'Wheel Width',
  wheel_offset: 'Offset',
  bolt_pattern: 'Bolt Pattern',
  wheel_finish: 'Finish',
  wheel_brand: 'Wheel Brand',
  wheel_model: 'Wheel Model',
  material: 'Material',
  weight: 'Weight',
  tire_size: 'Tire Size',
  tire_type: 'Tire Type',
  tire_brand: 'Tire Brand',
  suspension_type: 'Suspension Type',
  lift_height: 'Lift Height',
  lift_brand: 'Lift Brand',
  price_min: 'Min Price',
  price_max: 'Max Price',
  on_sale: 'On Sale',
  free_shipping: 'Free Shipping',
  in_stock: 'In Stock',
}
