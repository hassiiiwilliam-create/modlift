import { useMemo } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const BOOLEAN_KEYS = ['in_stock', 'on_sale', 'free_shipping', 'local_pickup', 'featured', 'show_combos_only', 'combo_only']
const NUMBER_KEYS = ['price_min', 'price_max']
const IGNORED_KEYS = new Set(['sort_by', 'sortBy', 'sort', 'query'])

const LABELS = {
  search: 'Search',
  category: 'Category',
  brand: 'Brand',
  wheel_brand: 'Wheel Brand',
  wheel_diameter: 'Wheel Diameter',
  wheel_finish: 'Wheel Finish',
  bolt_pattern: 'Bolt Pattern',
  offset: 'Offset',
  finish: 'Finish',
  tire_brand: 'Tire Brand',
  tire_width: 'Tire Width',
  aspect_ratio: 'Aspect Ratio',
  rim_diameter: 'Rim Diameter',
  tire_type: 'Tire Type',
  tire_season: 'Tire Season',
  lift_brand: 'Lift Brand',
  lift_height: 'Lift Height',
  lift_height_range: 'Lift Height Range',
  accessory_type: 'Accessory Type',
  vehicle_year: 'Vehicle Year',
  vehicle_make: 'Vehicle Make',
  vehicle_model: 'Vehicle Model',
  color: 'Color',
  brand_style: 'Brand Style',
  season: 'Season',
  warehouse_location: 'Warehouse',
  sku: 'SKU',
  in_stock: 'In Stock',
  on_sale: 'On Sale',
  free_shipping: 'Free Shipping',
  local_pickup: 'Local Pickup',
  featured: 'Featured',
  show_combos_only: 'Combos Only',
  combo_only: 'Combos Only',
  price: 'Price',
}

const deriveChips = (filters = {}) => {
  const chips = []

  Object.entries(filters).forEach(([key, value]) => {
    if (IGNORED_KEYS.has(key)) return
    if (!value || (Array.isArray(value) && value.length === 0)) return

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        chips.push({ key, value: entry })
      })
      return
    }

    if (BOOLEAN_KEYS.includes(key)) {
      if (value === true) {
        chips.push({ key, value: 'Yes' })
      }
      return
    }

    if (NUMBER_KEYS.includes(key)) {
      return
    }

    if (key === 'price' || key === 'price_range') return

    chips.push({ key, value })
  })

  const priceMin = filters.price_min
  const priceMax = filters.price_max
  if (priceMin || priceMax) {
    const minLabel = priceMin ? `$${priceMin}` : 'Any'
    const maxLabel = priceMax ? `$${priceMax}` : 'Any'
    chips.push({ key: 'price', value: `${minLabel} - ${maxLabel}` })
  }

  return chips
}

export default function FilterChips({
  filters,
  chips: chipsProp,
  onRemove,
  onClear,
  onClearAll,
  totalResults,
  count,
}) {
  const chips = useMemo(() => chipsProp ?? deriveChips(filters), [chipsProp, filters])
  const clearHandler = onClear ?? onClearAll
  const total = typeof totalResults === 'number' ? totalResults : typeof count === 'number' ? count : undefined

  if (!chips.length) return null

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => {
          const label = LABELS[chip.key] ?? chip.key
          return (
            <span
              key={`${chip.key}-${chip.value}`}
              className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-700 shadow-sm shadow-black/5 ring-1 ring-black/5 backdrop-blur"
            >
              <span>
                {label}: {chip.value}
              </span>
              {onRemove && (
                <button
                  type="button"
                  className="text-gray-400 transition hover:text-red-500"
                  onClick={() => onRemove(chip.key, chip.value)}
                  aria-label={`Remove ${label}`}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </span>
          )
        })}

        {clearHandler && (
          <button
            type="button"
            onClick={clearHandler}
            className="ml-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 transition hover:text-gray-800"
          >
            Clear Filters
          </button>
        )}

        {typeof total === 'number' && (
          <span className="ml-auto text-xs uppercase tracking-[0.2em] text-gray-400">
            Showing {total} product{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
