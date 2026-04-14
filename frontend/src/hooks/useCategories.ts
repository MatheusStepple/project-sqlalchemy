import { useState, useEffect } from 'react'
import { getCategorias } from '../api/categorias.ts'
import type { Categoria } from '../types/index.ts'

export function useCategories() {
  const [data, setData] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getCategorias()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Erro ao carregar categorias.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
