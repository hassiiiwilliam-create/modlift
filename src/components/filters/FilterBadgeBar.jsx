const LABEL_MAP = {
  liftHeight: 'Lift Height',
  tireSize: 'Tire Size',
  preference: 'Preference',
  vehicle_year: 'Year',
  vehicle_make: 'Make',
  vehicle_model: 'Model',
  vehicle_trim: 'Trim',
  drivetrain: 'Drivetrain',
  fitment_preference: 'Preference',
  tags: 'Tags',
}

const VALUE_MAP = {
  fitment_preference: {
    factory: 'Factory Suspension Only',
    no_rub: 'No Rub / No Trim',
    minor_trim: 'Minor Trimming OK',
  },
  preference: {
    factory: 'Factory Suspension Only',
    no_rub: 'No Rub / No Trim',
    minor_trim: 'Minor Trimming OK',
  },
}

const formatLabel = (key) => LABEL_MAP[key] ?? key.replace(/[_-]/g, ' ')

const formatValue = (key, value) => {
  if (Array.isArray(value)) {
    return value.map((item) => formatValue(key, item)).join(', ')
  }
  if (!value) return value
  const lookup = VALUE_MAP[key]?.[value]
  if (lookup) return lookup
  if (key === 'drivetrain') return value.toUpperCase()
  return value
}

export function FilterBadgeBar({ fitment, onClear }) {
  const entries = Object.entries(fitment ?? {}).filter(([, value]) => Boolean(value))

  if (entries.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-sm shadow-black/5 ring-1 ring-black/5 backdrop-blur dark:bg-neutral-900/60 dark:ring-neutral-800">
      {entries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/60 dark:text-blue-100"
        >
          {formatLabel(key)}: {formatValue(key, value)}
        </span>
      ))}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="ml-auto text-xs font-medium text-red-500 transition hover:text-red-600"
        >
          Clear All
        </button>
      )}
    </div>
  )
}

export default FilterBadgeBar
