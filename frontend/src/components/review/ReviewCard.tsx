import type { Avaliacao } from '../../types/index.ts'
import StarRating from './StarRating.tsx'
import { User } from 'lucide-react'

interface ReviewCardProps {
  review: Avaliacao
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {review.nome_consumidor ?? 'Consumidor anônimo'}
            </p>
            {review.data_comentario && (
              <p className="text-xs text-gray-400">{formatDate(review.data_comentario)}</p>
            )}
          </div>
        </div>
        <StarRating value={review.avaliacao} size="sm" />
      </div>
      {review.titulo_comentario && (
        <p className="text-sm font-semibold text-gray-800 mb-1">{review.titulo_comentario}</p>
      )}
      {review.comentario && (
        <p className="text-sm text-gray-500 leading-relaxed">{review.comentario}</p>
      )}
    </div>
  )
}
