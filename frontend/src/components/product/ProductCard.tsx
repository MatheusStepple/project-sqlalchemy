import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import type { Produto } from '../../types/index.ts'
import { formatCategoryName } from '../../utils/formatters.ts'

interface ProductCardProps {
  produto: Produto
}

export default function ProductCard({ produto }: ProductCardProps) {
  return (
    <Link
      to={`/produtos/${produto.id_produto}`}
      className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] overflow-hidden"
    >
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {produto.categoria_imagem_url ? (
          <img
            src={produto.categoria_imagem_url}
            alt={produto.categoria_produto}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute bottom-2 left-3 text-xs font-medium text-white/90 bg-black/30 rounded-full px-2 py-0.5 backdrop-blur-sm">
          {formatCategoryName(produto.categoria_produto)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {produto.nome_produto}
        </h3>
      </div>
    </Link>
  )
}
