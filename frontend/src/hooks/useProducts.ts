import { useState, useEffect } from 'react'
import { getProdutos } from '../api/produtos.ts'
import type { ProdutoListResponse, ProdutoFilters } from '../types/index.ts'

export function useProducts(filters: ProdutoFilters) {
  const [data, setData] = useState<ProdutoListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getProdutos(filters)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Erro ao carregar produtos.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [filters.page, filters.page_size, filters.search, filters.categoria, filters.ordem])

  return { data, loading, error }
}
