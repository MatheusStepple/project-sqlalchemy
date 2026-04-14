import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight, Edit, Trash2, Package, ShoppingCart, DollarSign, Star, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProductDetail } from '../hooks/useProductDetail.ts'
import { deleteProduto } from '../api/produtos.ts'
import { formatCategoryName, formatCurrency } from '../utils/formatters.ts'
import StarRating from '../components/review/StarRating.tsx'
import ReviewList from '../components/review/ReviewList.tsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.tsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx'
import ErrorMessage from '../components/ui/ErrorMessage.tsx'

function DimensionRow({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="py-2.5 text-sm text-gray-500 w-1/2">{label}</td>
      <td className="py-2.5 text-sm font-medium text-gray-900">
        {value != null ? `${value} ${unit}` : <span className="text-gray-300">—</span>}
      </td>
    </tr>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: produto, loading, error } = useProductDetail(id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!id) return
    setDeleting(true)
    try {
      await deleteProduto(id)
      toast.success('Produto excluído com sucesso.')
      navigate('/catalogo')
    } catch {
      toast.error('Erro ao excluir produto. Tente novamente.')
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !produto) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <ErrorMessage message={error ?? 'Produto não encontrado.'} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-700 transition-colors">Início</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/catalogo" className="hover:text-gray-700 transition-colors">Catálogo</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{produto.nome_produto}</span>
      </nav>

      {/* Main content: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Left: image */}
        <div className="relative h-72 sm:h-96 lg:h-full min-h-72 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
          {produto.categoria_imagem_url ? (
            <img
              src={produto.categoria_imagem_url}
              alt={produto.nome_produto}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-20 h-20 text-gray-200" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Right: info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
              {formatCategoryName(produto.categoria_produto)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 leading-snug">
            {produto.nome_produto}
          </h1>

          {/* Rating preview */}
          {produto.avaliacao_media != null && (
            <div className="flex items-center gap-2 mb-6">
              <StarRating value={produto.avaliacao_media} />
              <span className="text-sm font-medium text-gray-700">
                {produto.avaliacao_media.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({produto.total_avaliacoes} {produto.total_avaliacoes !== 1 ? 'avaliações' : 'avaliação'})
              </span>
            </div>
          )}

          {/* Dimensions */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Dimensões</h3>
            <table className="w-full">
              <tbody>
                <DimensionRow label="Peso" value={produto.peso_produto_gramas} unit="g" />
                <DimensionRow label="Comprimento" value={produto.comprimento_centimetros} unit="cm" />
                <DimensionRow label="Altura" value={produto.altura_centimetros} unit="cm" />
                <DimensionRow label="Largura" value={produto.largura_centimetros} unit="cm" />
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-auto">
            <Link
              to={`/produtos/${produto.id_produto}/editar`}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Link>
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors border border-red-100"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-gray-400 font-medium">Total Vendas</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {produto.total_vendas.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400 font-medium">Receita Total</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(produto.receita_total)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400 font-medium">Nota Média</span>
          </div>
          {produto.avaliacao_media != null ? (
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-gray-900">
                {produto.avaliacao_media.toFixed(1)}
              </p>
              <StarRating value={produto.avaliacao_media} size="sm" />
            </div>
          ) : (
            <p className="text-sm text-gray-300">Sem avaliações</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400 font-medium">Total Avaliações</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {produto.total_avaliacoes.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Reviews */}
      <ReviewList produtoId={produto.id_produto} />

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir "${produto.nome_produto}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  )
}
