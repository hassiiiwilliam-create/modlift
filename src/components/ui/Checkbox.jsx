export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-neutral-700">
      <input
        type="checkbox"
        className="accent-black"
        checked={Boolean(checked)}
        onChange={(event) => onChange && onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}
