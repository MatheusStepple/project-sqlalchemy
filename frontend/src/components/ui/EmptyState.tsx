import { PackageSearch } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export default function EmptyState({
  title = 'Nenhum produto encontrado',
  description = 'Tente ajustar os filtros ou a busca.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}
