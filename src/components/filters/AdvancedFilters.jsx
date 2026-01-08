const wheelDiameters = ['17"', '18"', '20"', '22"']
const boltPatterns = ['5x114.3', '6x135', '6x139.7']
const offsets = ['-12', '0', '+18', '+20']
const finishes = ['Matte Black', 'Gloss Black', 'Bronze', 'Chrome']

const tireWidths = ['265', '285', '305']
const aspectRatios = ['75', '70', '65', '60']
const rimDiameters = ['17"', '18"', '20"']
const tireTypes = ['All-Terrain', 'Mud-Terrain', 'Highway', 'Winter']

const liftHeights = ['0-2"', '2-3"', '4"+', 'Leveling Kit']
const accessoryTypes = ['Lug Nuts', 'Spacers', 'Center Caps', 'TPMS']
const warehouseLocations = ['TX', 'CA', 'UT', 'GA', 'PA']

export default function AdvancedFilters({ filters, onChange }) {
  const handleField = (key, value) => {
    onChange({ [key]: value })
  }

  const handleToggle = (key) => (event) => {
    onChange({ [key]: event.target.checked })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Wheel Specs</p>
        <div className="grid grid-cols-1 gap-3">
          <select
            value={filters.wheelDiameter || ''}
            onChange={(event) => handleField('wheelDiameter', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Diameter</option>
            {wheelDiameters.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={filters.boltPattern || ''}
            onChange={(event) => handleField('boltPattern', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Bolt Pattern</option>
            {boltPatterns.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={filters.offset || ''}
            onChange={(event) => handleField('offset', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Offset</option>
            {offsets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={filters.wheelFinish || ''}
            onChange={(event) => handleField('wheelFinish', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Finish / Color</option>
            {finishes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Tire Specs</p>
        <div className="grid grid-cols-1 gap-3">
          <select
            value={filters.tireWidth || ''}
            onChange={(event) => handleField('tireWidth', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Width</option>
            {tireWidths.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={filters.aspectRatio || ''}
            onChange={(event) => handleField('aspectRatio', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Aspect Ratio</option>
            {aspectRatios.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={filters.rimDiameter || ''}
            onChange={(event) => handleField('rimDiameter', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Rim Diameter</option>
            {rimDiameters.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={filters.tireType || ''}
            onChange={(event) => handleField('tireType', event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Tire Type</option>
            {tireTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Lift Kits & Accessories</p>
        <select
          value={filters.liftHeight || ''}
          onChange={(event) => handleField('liftHeight', event.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Lift Height</option>
          {liftHeights.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={filters.accessoryType || ''}
          onChange={(event) => handleField('accessoryType', event.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Accessory Type</option>
          {accessoryTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Availability</p>
        <select
          value={filters.warehouseLocation || ''}
          onChange={(event) => handleField('warehouseLocation', event.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Warehouse</option>
          {warehouseLocations.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filters.sku || ''}
          onChange={(event) => handleField('sku', event.target.value)}
          placeholder="Search SKU"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="grid grid-cols-1 gap-2 text-sm text-neutral-700">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-black"
              checked={filters.inStock || false}
              onChange={handleToggle('inStock')}
            />
            In Stock
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-black"
              checked={filters.onSale || false}
              onChange={handleToggle('onSale')}
            />
            On Sale
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-black"
              checked={filters.freeShipping || false}
              onChange={handleToggle('freeShipping')}
            />
            Free Shipping
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-black"
              checked={filters.localPickup || false}
              onChange={handleToggle('localPickup')}
            />
            Local Pickup Available
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-black"
              checked={filters.featuredOnly || false}
              onChange={handleToggle('featuredOnly')}
            />
            Featured Only
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-black"
              checked={filters.comboOnly || false}
              onChange={handleToggle('comboOnly')}
            />
            Show Combos Only
          </label>
        </div>
      </div>
    </div>
  )
}
