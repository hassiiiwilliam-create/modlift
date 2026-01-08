export default function Dropdown({ label, options = [], selected, onChange, placeholder }) {
  const handleChange = (event) => {
    if (onChange) onChange(event.target.value)
  }

  const resolvedPlaceholder = placeholder || (label ? `Select ${label}` : 'Select an option')

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
      <select
        value={selected ?? ''}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="">{resolvedPlaceholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
