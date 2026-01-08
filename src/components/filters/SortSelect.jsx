export default function SortSelect({ value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-neutral-700">Sort By</p>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="newest">Newest</option>
        <option value="price_low_high">Price: Low to High</option>
        <option value="price_high_low">Price: High to Low</option>
      </select>
    </div>
  )
}
