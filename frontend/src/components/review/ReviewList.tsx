import { useState, useEffect } from 'react'
import { getAvaliacoes } from '../../api/produtos.ts'
import type { AvaliacaoListResponse } from '../../types/index.ts'
import ReviewCard from './ReviewCard.tsx'
import Pagination from '../ui/Pagination.tsx'
import LoadingSpinner from '../ui/LoadingSpinner.tsx'
import EmptyState from '../ui/EmptyState.tsx'

interface ReviewListProps {
  produtoId: string
}

export default function ReviewList({ produtoId }: ReviewListProps) {
  const [data, setData] = useState<AvaliacaoListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getAvaliacoes(produtoId, page, 10)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [produtoId, page])

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Avaliações
        {data && data.total > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-400">({data.total})</span>
        )}
      </h2>

      {loading && (
        <div className="py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && (!data || data.items.length === 0) && (
        <EmptyState
          title="Nenhuma avaliação ainda"
          description="Este produto ainda não recebeu avaliações."
        />
      )}

      {!loading && data && data.items.length > 0 && (
        <div className="space-y-4">
          {data.items.map((review) => (
            <ReviewCard key={review.id_avaliacao} review={review} />
          ))}
          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
