export default function CategoryFilter({ value, onChange, categories }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-neutral-700">Category</p>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="all">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  )
}
