export interface Produto {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: number | null
  comprimento_centimetros: number | null
  altura_centimetros: number | null
  largura_centimetros: number | null
  categoria_imagem_url: string | null
}

export interface ProdutoDetail extends Produto {
  total_vendas: number
  receita_total: number
  avaliacao_media: number | null
  total_avaliacoes: number
}

export interface ProdutoListResponse {
  items: Produto[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ProdutoCreate {
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas?: number | null
  comprimento_centimetros?: number | null
  altura_centimetros?: number | null
  largura_centimetros?: number | null
}

export interface ProdutoUpdate {
  nome_produto?: string
  categoria_produto?: string
  peso_produto_gramas?: number | null
  comprimento_centimetros?: number | null
  altura_centimetros?: number | null
  largura_centimetros?: number | null
}

export interface Avaliacao {
  id_avaliacao: string
  avaliacao: number
  titulo_comentario: string | null
  comentario: string | null
  data_comentario: string | null
  nome_consumidor: string | null
}

export interface AvaliacaoListResponse {
  items: Avaliacao[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface Categoria {
  nome: string
  imagem_url: string
  total_produtos: number
}

export interface ProdutoFilters {
  page?: number
  page_size?: number
  search?: string
  categoria?: string
  ordem?: string
}
