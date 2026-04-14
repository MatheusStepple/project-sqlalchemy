import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.tsx'
import HomePage from './pages/HomePage.tsx'
import CatalogPage from './pages/CatalogPage.tsx'
import ProductDetailPage from './pages/ProductDetailPage.tsx'
import ProductFormPage from './pages/ProductFormPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="produtos/novo" element={<ProductFormPage />} />
          <Route path="produtos/:id" element={<ProductDetailPage />} />
          <Route path="produtos/:id/editar" element={<ProductFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
