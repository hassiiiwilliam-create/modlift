import { useEffect, useState } from 'react'

const clampNumber = (value, min, max) => {
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return min
  return Math.min(Math.max(numberValue, min), max)
}

export default function PriceRangeFilter({ min = 0, max = 10000, value, onChange }) {
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  useEffect(() => {
    if (Array.isArray(value)) {
      setLocalMin(value[0])
      setLocalMax(value[1])
    }
  }, [value])

  const handleBlur = () => {
    const nextMin = clampNumber(localMin, min, localMax)
    const nextMax = clampNumber(localMax, nextMin, max)
    onChange([nextMin, nextMax])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-700">Price Range</p>
        <span className="text-xs text-neutral-500">
          ${localMin} - ${localMax}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          value={localMin}
          min={min}
          max={localMax}
          onChange={(event) => setLocalMin(event.target.value)}
          onBlur={handleBlur}
        />
        <input
          type="number"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          value={localMax}
          min={localMin}
          max={max}
          onChange={(event) => setLocalMax(event.target.value)}
          onBlur={handleBlur}
        />
      </div>
    </div>
  )
}
