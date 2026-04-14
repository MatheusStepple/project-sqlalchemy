import { useState, useEffect } from 'react'
import { getProduto } from '../api/produtos.ts'
import type { ProdutoDetail } from '../types/index.ts'

export function useProductDetail(id: string | undefined) {
  const [data, setData] = useState<ProdutoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getProduto(id)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Produto não encontrado.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { data, loading, error }
}
