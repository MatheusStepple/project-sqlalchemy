import { type FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Package } from 'lucide-react'
import { useCategories } from '../hooks/useCategories.ts'
import { formatCategoryName } from '../utils/formatters.ts'
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx'

export default function HomePage() {
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const { data: categories, loading: categoriesLoading } = useCategories()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const topCategories = [...categories]
    .sort((a, b) => b.total_produtos - a.total_produtos)
    .slice(0, 20)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 py-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <Package className="w-3.5 h-3.5" />
            Gestão de Produtos
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight">
            Gerencie seus produtos<br />com facilidade
          </h1>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
            Explore, adicione e gerencie todo o seu catálogo de produtos em um só lugar.
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-indigo-700 font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex-shrink-0"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Explore por Categoria</h2>
            <p className="text-sm text-gray-400 mt-1">Navegue pelas categorias mais populares</p>
          </div>
          <Link
            to="/catalogo"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Ver catálogo completo →
          </Link>
        </div>

        {categoriesLoading && (
          <div className="py-16">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!categoriesLoading && topCategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topCategories.map((cat) => (
              <Link
                key={cat.nome}
                to={`/catalogo?categoria=${encodeURIComponent(cat.nome)}`}
                className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                {cat.imagem_url ? (
                  <img
                    src={cat.imagem_url}
                    alt={formatCategoryName(cat.nome)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                    <Package className="w-8 h-8 text-indigo-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                    {formatCategoryName(cat.nome)}
                  </p>
                  <span className="inline-block mt-1 text-white/70 text-xs">
                    {cat.total_produtos} produtos
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
