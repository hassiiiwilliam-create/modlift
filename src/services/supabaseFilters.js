import { fetchDistinct } from './productsService.js'

const coerceString = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  return String(value).trim()
}

const sortByLabel = (a, b) => a.label.localeCompare(b.label, undefined, { numeric: true })

const buildLiftOption = (raw) => {
  const normalized = coerceString(raw)
  if (!normalized) return null

  const numeric = Number(normalized.replace(/[^0-9.]/g, ''))
  if (Number.isFinite(numeric)) {
    if (numeric === 0) {
      return { value: '0', label: 'Level Kit' }
    }
    if (normalized.includes('+')) {
      return { value: String(numeric), label: `${numeric}"+` }
    }
    return { value: String(numeric), label: `${numeric}"` }
  }

  if (normalized.toLowerCase().includes('level')) {
    return { value: '0', label: 'Level Kit' }
  }

  return { value: normalized, label: normalized }
}

const buildDiameterOption = (raw) => {
  const normalized = coerceString(raw)
  if (!normalized) return null

  const numeric = parseInt(normalized.replace(/[^0-9]/g, ''), 10)
  if (Number.isFinite(numeric)) {
    return { value: String(numeric), label: `${numeric}"` }
  }

  return { value: normalized, label: normalized.includes('"') ? normalized : `${normalized}"` }
}

const buildTireSizeOption = (raw) => {
  const normalized = coerceString(raw)
  if (!normalized) return null
  return { value: normalized, label: normalized }
}

const buildBrandOption = (raw) => {
  const normalized = coerceString(raw)
  if (!normalized) return null
  return { value: normalized, label: normalized }
}

const safeDistinct = async (column, formatter) => {
  try {
    const values = await fetchDistinct({ column })
    return values
      .map(formatter)
      .filter(Boolean)
      .sort(sortByLabel)
  } catch (error) {
    console.error(`Failed to load distinct values for column "${column}"`, error)
    return []
  }
}

export async function getLiftHeights() {
  return safeDistinct('lift_height', buildLiftOption)
}

export async function getWheelDiameters() {
  return safeDistinct('wheel_diameter', buildDiameterOption)
}

export async function getTireSizes() {
  return safeDistinct('tire_size', buildTireSizeOption)
}

export async function getBrands() {
  return safeDistinct('brand', buildBrandOption)
}
