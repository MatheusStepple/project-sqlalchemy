import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useCategories } from '../hooks/useCategories.ts'
import { useProducts } from '../hooks/useProducts.ts'
import ProductGrid from '../components/product/ProductGrid.tsx'
import SearchBar from '../components/catalog/SearchBar.tsx'
import CategoryFilter from '../components/catalog/CategoryFilter.tsx'
import SortSelect from '../components/catalog/SortSelect.tsx'
import Pagination from '../components/ui/Pagination.tsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx'
import EmptyState from '../components/ui/EmptyState.tsx'
import ErrorMessage from '../components/ui/ErrorMessage.tsx'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const searchParam = searchParams.get('search') ?? ''
  const categoriaParam = searchParams.get('categoria') ?? ''
  const ordemParam = searchParams.get('ordem') ?? 'nome_asc'
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)

  const [searchInput, setSearchInput] = useState(searchParam)

  const { data: categories } = useCategories()

  const filters = {
    page: pageParam,
    page_size: 20,
    search: searchParam,
    categoria: categoriaParam,
    ordem: ordemParam,
  }

  const { data, loading, error } = useProducts(filters)

  useEffect(() => {
    setSearchInput(searchParam)
  }, [searchParam])

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      next.delete('page')
      setSearchParams(next)
    },
    [searchParams, setSearchParams]
  )

  function handleSearchSubmit() {
    updateParam('search', searchInput.trim())
  }

  function handleCategoryChange(value: string) {
    updateParam('categoria', value)
    setSidebarOpen(false)
  }

  function handleOrdemChange(value: string) {
    updateParam('ordem', value)
  }

  function handlePageChange(page: number) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(page))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
          />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Results count */}
      {data && !loading && (
        <p className="text-sm text-gray-400 mb-4">
          {data.total === 0
            ? 'Nenhum produto encontrado'
            : `${data.total} produto${data.total !== 1 ? 's' : ''} encontrado${data.total !== 1 ? 's' : ''}`}
        </p>
      )}

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-0 z-30 bg-black/40 lg:static lg:bg-transparent lg:z-auto
            ${sidebarOpen ? 'block' : 'hidden lg:block'}
          `}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSidebarOpen(false)
          }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 shadow-xl lg:static lg:w-56 lg:shadow-none lg:bg-transparent lg:p-0 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="font-semibold text-gray-900">Filtros</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-8">
              <CategoryFilter
                categories={categories}
                selected={categoriaParam}
                onChange={handleCategoryChange}
              />
              <SortSelect value={ordemParam} onChange={handleOrdemChange} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {error && <ErrorMessage message={error} />}

          {loading && (
            <div className="py-24">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {!loading && !error && data && data.items.length === 0 && (
            <EmptyState />
          )}

          {!loading && !error && data && data.items.length > 0 && (
            <>
              <ProductGrid produtos={data.items} />
              <Pagination
                currentPage={data.page}
                totalPages={data.total_pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
