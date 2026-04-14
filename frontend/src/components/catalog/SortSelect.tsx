interface SortSelectProps {
  value: string
  onChange: (value: string) => void
}

const OPTIONS = [
  { value: 'nome_asc', label: 'Nome A-Z' },
  { value: 'nome_desc', label: 'Nome Z-A' },
]

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ordenar por</h3>
      <div className="space-y-1">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              value === opt.value
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
