import client from './client.ts'
import type {
  ProdutoListResponse,
  ProdutoDetail,
  ProdutoCreate,
  ProdutoUpdate,
  AvaliacaoListResponse,
  ProdutoFilters,
} from '../types/index.ts'

export async function getProdutos(filters: ProdutoFilters = {}): Promise<ProdutoListResponse> {
  const params = {
    page: filters.page ?? 1,
    page_size: filters.page_size ?? 20,
    search: filters.search ?? '',
    categoria: filters.categoria ?? '',
    ordem: filters.ordem ?? 'nome_asc',
  }
  const response = await client.get<ProdutoListResponse>('/produtos/', { params })
  return response.data
}

export async function getProduto(id: string): Promise<ProdutoDetail> {
  const response = await client.get<ProdutoDetail>(`/produtos/${id}`)
  return response.data
}

export async function createProduto(data: ProdutoCreate): Promise<ProdutoDetail> {
  const response = await client.post<ProdutoDetail>('/produtos/', data)
  return response.data
}

export async function updateProduto(id: string, data: ProdutoUpdate): Promise<ProdutoDetail> {
  const response = await client.put<ProdutoDetail>(`/produtos/${id}`, data)
  return response.data
}

export async function deleteProduto(id: string): Promise<void> {
  await client.delete(`/produtos/${id}`)
}

export async function getAvaliacoes(
  id: string,
  page = 1,
  page_size = 10
): Promise<AvaliacaoListResponse> {
  const response = await client.get<AvaliacaoListResponse>(`/produtos/${id}/avaliacoes`, {
    params: { page, page_size },
  })
  return response.data
}
