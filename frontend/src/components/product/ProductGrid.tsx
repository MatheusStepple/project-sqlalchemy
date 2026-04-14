import type { Produto } from '../../types/index.ts'
import ProductCard from './ProductCard.tsx'

interface ProductGridProps {
  produtos: Produto[]
}

export default function ProductGrid({ produtos }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {produtos.map((produto) => (
        <ProductCard key={produto.id_produto} produto={produto} />
      ))}
    </div>
  )
}
