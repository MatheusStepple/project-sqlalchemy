import client from './client.ts'
import type { Categoria } from '../types/index.ts'

export async function getCategorias(): Promise<Categoria[]> {
  const response = await client.get<Categoria[]>('/categorias/')
  return response.data
}
