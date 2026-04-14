const CATEGORY_MAP: Record<string, string> = {
  perfumaria: 'Perfumaria',
  automotivo: 'Automotivo',
  cama_mesa_banho: 'Cama, Mesa e Banho',
  utilidades_domesticas: 'Utilidades Domésticas',
  relogios_presentes: 'Relógios e Presentes',
  cool_stuff: 'Cool Stuff',
  consoles_games: 'Consoles e Games',
  moveis_decoracao: 'Móveis e Decoração',
  beleza_saude: 'Beleza e Saúde',
  fashion_calcados: 'Fashion Calçados',
  informatica_acessorios: 'Informática e Acessórios',
  brinquedos: 'Brinquedos',
  pet_shop: 'Pet Shop',
  esporte_lazer: 'Esporte e Lazer',
  ferramentas_jardim: 'Ferramentas e Jardim',
  moveis_sala: 'Móveis de Sala',
  malas_acessorios: 'Malas e Acessórios',
  casa_construcao: 'Casa e Construção',
  moveis_cozinha_area_de_servico_jantar_e_jardim: 'Móveis Cozinha, Jantar e Jardim',
  construcao_ferramentas_construcao: 'Construção e Ferramentas',
  moveis_quarto: 'Móveis de Quarto',
  fashion_roupa_masculina: 'Fashion Roupa Masculina',
  construcao_ferramentas_seguranca: 'Construção e Segurança',
  fashion_bolsas_e_acessorios: 'Fashion Bolsas e Acessórios',
  fraldas_higiene: 'Fraldas e Higiene',
  telefonia: 'Telefonia',
  artigos_de_natal: 'Artigos de Natal',
  papelaria: 'Papelaria',
  telefonia_fixa: 'Telefonia Fixa',
  livros_interesse_geral: 'Livros de Interesse Geral',
  eletronicos: 'Eletrônicos',
  pc_gamer: 'PC Gamer',
  bebes: 'Bebês',
  eletrodomesticos: 'Eletrodomésticos',
  alimentos: 'Alimentos',
  agro_industria_e_comercio: 'Agro, Indústria e Comércio',
  livros_importados: 'Livros Importados',
  construcao_iluminacao: 'Construção e Iluminação',
  bebidas: 'Bebidas',
  eletrodomesticos_2: 'Eletrodomésticos 2',
  eletroportateis: 'Eletroportáteis',
  industria_comercio_e_negocios: 'Indústria, Comércio e Negócios',
  dvds_blu_ray: 'DVDs e Blu-Ray',
  livros_tecnicos: 'Livros Técnicos',
  moveis_escritorio: 'Móveis de Escritório',
  climatizacao: 'Climatização',
  instrumentos_musicais: 'Instrumentos Musicais',
  portateis_casa_forno_e_cafe: 'Portáteis Casa, Forno e Café',
  sinalizacao_e_seguranca: 'Sinalização e Segurança',
  artes: 'Artes',
  market_place: 'Market Place',
  cine_foto: 'Cine e Foto',
  alimentos_bebidas: 'Alimentos e Bebidas',
  flores: 'Flores',
  fashion_underwear_e_moda_praia: 'Fashion Underwear e Moda Praia',
  musica: 'Música',
  audio: 'Áudio',
  artes_e_artesanato: 'Artes e Artesanato',
  casa_conforto: 'Casa e Conforto',
  fashion_roupa_feminina: 'Fashion Roupa Feminina',
  fashion_roupa_infanto_juvenil: 'Fashion Roupa Infanto-Juvenil',
  la_cuisine: 'La Cuisine',
  fashion_esporte: 'Fashion Esporte',
  artigos_de_festas: 'Artigos de Festas',
  moveis_colchao_e_estofado: 'Móveis, Colchão e Estofado',
  portateis_cozinha: 'Portáteis de Cozinha',
  pcs: 'PCs',
  cds_dvds_musicais: 'CDs, DVDs e Musicais',
  tablets_impressao_imagem: 'Tablets, Impressão e Imagem',
  moveis_cozinha_jantar_jardim: 'Móveis Cozinha, Jantar e Jardim',
  // Legacy keys kept for backward compatibility
  construcao: 'Construção',
  livros_midia: 'Livros e Mídia',
  bebe: 'Bebê',
  moda: 'Moda',
  saude: 'Saúde',
  industria_comercio: 'Indústria e Comércio',
  flores_presentes: 'Flores e Presentes',
  portateis: 'Portáteis',
  relogios: 'Relógios',
  tablets_impressao: 'Tablets e Impressão',
  arte_artesanato: 'Arte e Artesanato',
  cameras_fotograficas: 'Câmeras Fotográficas',
  ar_condicionado: 'Ar Condicionado',
  fashion_bolsas_acessorios: 'Bolsas e Acessórios',
}

export function formatCategoryName(nome: string): string {
  if (CATEGORY_MAP[nome]) return CATEGORY_MAP[nome]

  return nome
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}
