import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <p className="text-8xl font-semibold text-indigo-100 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Página não encontrada</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-indigo-600 text-white font-medium text-sm px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        Voltar para o início
      </Link>
    </div>
  )
}
