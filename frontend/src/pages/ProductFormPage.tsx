import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProduto, createProduto, updateProduto } from '../api/produtos.ts'
import { useCategories } from '../hooks/useCategories.ts'
import { formatCategoryName } from '../utils/formatters.ts'
import LoadingSpinner from '../components/ui/LoadingSpinner.tsx'

interface FormData {
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: string
  comprimento_centimetros: string
  altura_centimetros: string
  largura_centimetros: string
}

const EMPTY_FORM: FormData = {
  nome_produto: '',
  categoria_produto: '',
  peso_produto_gramas: '',
  comprimento_centimetros: '',
  altura_centimetros: '',
  largura_centimetros: '',
}

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id) && id !== 'novo'

  const { data: categories } = useCategories()
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (!isEditMode || !id) return

    setLoading(true)
    getProduto(id)
      .then((produto) => {
        setForm({
          nome_produto: produto.nome_produto,
          categoria_produto: produto.categoria_produto,
          peso_produto_gramas: produto.peso_produto_gramas != null ? String(produto.peso_produto_gramas) : '',
          comprimento_centimetros: produto.comprimento_centimetros != null ? String(produto.comprimento_centimetros) : '',
          altura_centimetros: produto.altura_centimetros != null ? String(produto.altura_centimetros) : '',
          largura_centimetros: produto.largura_centimetros != null ? String(produto.largura_centimetros) : '',
        })
        setLoading(false)
      })
      .catch(() => {
        toast.error('Erro ao carregar produto.')
        navigate('/catalogo')
      })
  }, [id, isEditMode, navigate])

  function parseNumber(value: string): number | null {
    if (value === '' || value === null) return null
    const num = parseFloat(value)
    return isNaN(num) ? null : num
  }

  function validate(): boolean {
    const newErrors: Partial<FormData> = {}
    if (!form.nome_produto.trim()) {
      newErrors.nome_produto = 'Nome do produto é obrigatório.'
    }
    if (!form.categoria_produto) {
      newErrors.categoria_produto = 'Categoria é obrigatória.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    const payload = {
      nome_produto: form.nome_produto.trim(),
      categoria_produto: form.categoria_produto,
      peso_produto_gramas: parseNumber(form.peso_produto_gramas),
      comprimento_centimetros: parseNumber(form.comprimento_centimetros),
      altura_centimetros: parseNumber(form.altura_centimetros),
      largura_centimetros: parseNumber(form.largura_centimetros),
    }

    try {
      if (isEditMode && id) {
        const updated = await updateProduto(id, payload)
        toast.success('Produto atualizado com sucesso!')
        navigate(`/produtos/${updated.id_produto}`)
      } else {
        const created = await createProduto(payload)
        toast.success('Produto criado com sucesso!')
        navigate(`/produtos/${created.id_produto}`)
      }
    } catch {
      toast.error('Erro ao salvar produto. Tente novamente.')
      setSubmitting(false)
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-700 transition-colors">Início</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/catalogo" className="hover:text-gray-700 transition-colors">Catálogo</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium">
          {isEditMode ? 'Editar Produto' : 'Novo Produto'}
        </span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          {isEditMode ? 'Editar Produto' : 'Novo Produto'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome do produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nome_produto}
              onChange={(e) => handleChange('nome_produto', e.target.value)}
              placeholder="Ex: Smartphone Galaxy S24"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.nome_produto ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            />
            {errors.nome_produto && (
              <p className="mt-1 text-xs text-red-600">{errors.nome_produto}</p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={form.categoria_produto}
              onChange={(e) => handleChange('categoria_produto', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none ${
                errors.categoria_produto ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            >
              <option value="">Selecionar categoria...</option>
              {categories.map((cat) => (
                <option key={cat.nome} value={cat.nome}>
                  {formatCategoryName(cat.nome)}
                </option>
              ))}
            </select>
            {errors.categoria_produto && (
              <p className="mt-1 text-xs text-red-600">{errors.categoria_produto}</p>
            )}
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Dimensões <span className="text-gray-400 font-normal">(opcional)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Peso (gramas)</label>
                <input
                  type="number"
                  value={form.peso_produto_gramas}
                  onChange={(e) => handleChange('peso_produto_gramas', e.target.value)}
                  placeholder="Ex: 250"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Comprimento (cm)</label>
                <input
                  type="number"
                  value={form.comprimento_centimetros}
                  onChange={(e) => handleChange('comprimento_centimetros', e.target.value)}
                  placeholder="Ex: 15"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={form.altura_centimetros}
                  onChange={(e) => handleChange('altura_centimetros', e.target.value)}
                  placeholder="Ex: 5"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Largura (cm)</label>
                <input
                  type="number"
                  value={form.largura_centimetros}
                  onChange={(e) => handleChange('largura_centimetros', e.target.value)}
                  placeholder="Ex: 8"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to={isEditMode && id ? `/produtos/${id}` : '/catalogo'}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditMode ? 'Salvar alterações' : 'Criar produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
