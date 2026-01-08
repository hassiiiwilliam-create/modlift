export default function FitmentFilter({ value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-neutral-700">Vehicle Fitment</p>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search year / make / model"
        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  )
}
