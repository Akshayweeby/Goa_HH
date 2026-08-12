export default function FormInput({ label, id, error, ...props }) {
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.18em] text-white/55">{label}</label>
    <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`h-12 w-full rounded-xl border bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d8ff44] ${error ? 'border-red-400' : 'border-white/10'}`} {...props} />
    {error && <p id={`${id}-error`} className="text-xs text-red-300">{error}</p>}
  </div>;
}
