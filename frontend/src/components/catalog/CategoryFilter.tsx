import type { Categoria } from '../../types/index.ts'
import { formatCategoryName } from '../../utils/formatters.ts'

interface CategoryFilterProps {
  categories: Categoria[]
  selected: string
  onChange: (value: string) => void
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Categoria</h3>
      <div className="space-y-1">
        <button
          onClick={() => onChange('')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            selected === ''
              ? 'bg-indigo-50 text-indigo-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Todas as categorias
        </button>
        {categories.map((cat) => (
          <button
            key={cat.nome}
            onClick={() => onChange(cat.nome)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
              selected === cat.nome
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="truncate">{formatCategoryName(cat.nome)}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{cat.total_produtos}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
