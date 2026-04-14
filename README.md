# Sistema de Gerenciamento de E-Commerce

Sistema web completo para gerenciamento de uma loja virtual. Permite ao gerente da loja navegar pelo catálogo de produtos, visualizar estatísticas de vendas e avaliações de consumidores, buscar produtos e realizar operações de CRUD (criar, editar e remover produtos).

Desenvolvido como atividade do programa **Rocket Lab 2026 - Visagio**.

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Estilização | Tailwind CSS v4 |
| Ícones | Lucide React |
| Roteamento | React Router DOM v7 |
| HTTP Client | Axios |
| Backend | FastAPI (Python) |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Banco de Dados | SQLite |
| Validação | Pydantic v2 |

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Python** 3.11 ou superior
- **Node.js** 18 ou superior
- **npm** (instalado junto com o Node.js)
- **Git**

Para verificar se estão instalados:

```bash
python --version
node --version
npm --version
```

---

## Passo a Passo para Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/MatheusStepple/project-sqlalchemy.git
cd project-sqlalchemy
```

### 2. Configurar e iniciar o Backend

Abra um terminal e execute:

```bash
cd backend
```

**Criar o ambiente virtual:**

```bash
python -m venv venv
```

**Ativar o ambiente virtual:**

Windows (CMD):
```bash
venv\Scripts\activate
```

Windows (PowerShell):
```bash
venv\Scripts\Activate.ps1
```

Linux / macOS:
```bash
source venv/bin/activate
```

**Instalar as dependências:**

```bash
pip install -r requirements.txt
```

**Criar as tabelas no banco de dados (migrations):**

```bash
alembic upgrade head
```

**Popular o banco com os dados dos CSVs (~440 mil registros):**

```bash
python seed.py
```

Saída esperada:
```
Iniciando seed do banco de dados...
✓ consumidores: 99441 registros inseridos
✓ vendedores: 3095 registros inseridos
✓ produtos: 32951 registros inseridos
✓ pedidos: 99441 registros inseridos
✓ itens_pedidos: 112650 registros inseridos
✓ avaliacoes_pedidos: 95307 registros inseridos
Seed concluído!
```

**Iniciar o servidor da API:**

```bash
python -m app.main
```

O backend estará disponível em: **http://localhost:8000**

Documentação interativa (Swagger): **http://localhost:8000/docs**

### 3. Configurar e iniciar o Frontend

Abra **outro terminal** e execute:

```bash
cd frontend
```

**Instalar as dependências:**

```bash
npm install
```

**Iniciar o servidor de desenvolvimento:**

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

> **Importante:** O backend (porta 8000) deve estar rodando para o frontend funcionar corretamente.

---

## Funcionalidades

### Requisitos Implementados

- **Catálogo de produtos** — Navegação por grid de produtos com imagens por categoria
- **Detalhes do produto** — Página com dimensões (peso, comprimento, altura, largura), estatísticas de vendas e avaliações
- **Busca** — Busca por nome de produto com resultados em tempo real
- **CRUD completo** — Adicionar, editar e remover produtos individualmente
- **Média de avaliações** — Nota média calculada a partir das avaliações dos consumidores

### Funcionalidades Extras

- **Paginação no backend** — Todas as listagens são paginadas (20 itens por página)
- **Filtro por categoria** — Sidebar com todas as categorias e contagem de produtos
- **Ordenação** — Por nome (A-Z ou Z-A)
- **Responsividade** — Layout adaptável para desktop, tablet e celular
- **Tratamento de erros** — Mensagens amigáveis, estados de loading e notificações toast
- **Validação de dados** — Campos obrigatórios, valores mínimos/máximos validados no backend
- **Índices no banco** — Otimização de performance nas consultas com JOINs
- **Imagens por categoria** — 69 categorias com imagens ilustrativas

---

## Páginas da Aplicação

| Página | Rota | Descrição |
|--------|------|-----------|
| Início | `/` | Página inicial com hero, barra de busca e grid de categorias populares |
| Catálogo | `/catalogo` | Grid de produtos com busca, filtros por categoria, ordenação e paginação |
| Detalhes | `/produtos/:id` | Informações completas do produto, estatísticas de vendas e avaliações |
| Novo Produto | `/produtos/novo` | Formulário para criar um novo produto |
| Editar Produto | `/produtos/:id/editar` | Formulário para editar um produto existente |

---

## Endpoints da API

### Produtos

| Método | Endpoint | Descrição | Parâmetros |
|--------|----------|-----------|------------|
| GET | `/api/produtos/` | Listar produtos (paginado) | `page`, `page_size`, `search`, `categoria`, `ordem` |
| GET | `/api/produtos/{id}` | Detalhes do produto com estatísticas | — |
| POST | `/api/produtos/` | Criar produto | Body JSON |
| PUT | `/api/produtos/{id}` | Atualizar produto (parcial) | Body JSON |
| DELETE | `/api/produtos/{id}` | Remover produto | — |
| GET | `/api/produtos/{id}/avaliacoes` | Avaliações do produto | `page`, `page_size` |

### Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categorias/` | Listar todas as categorias com imagem e contagem |

### Exemplos de Uso

**Listar produtos com busca e filtro:**
```
GET /api/produtos/?page=1&page_size=20&search=mouse&categoria=informatica_acessorios&ordem=nome_asc
```

**Criar um produto:**
```bash
curl -X POST http://localhost:8000/api/produtos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome_produto": "Teclado Mecânico RGB",
    "categoria_produto": "informatica_acessorios",
    "peso_produto_gramas": 850,
    "comprimento_centimetros": 44,
    "altura_centimetros": 4,
    "largura_centimetros": 14
  }'
```

---

## Modelo de Dados

O banco de dados contém 6 tabelas:

```
consumidores (99.441 registros)
├── id_consumidor (PK)
├── prefixo_cep
├── nome_consumidor
├── cidade
└── estado

vendedores (3.095 registros)
├── id_vendedor (PK)
├── nome_vendedor
├── prefixo_cep
├── cidade
└── estado

produtos (32.951 registros)
├── id_produto (PK)
├── nome_produto
├── categoria_produto
├── peso_produto_gramas
├── comprimento_centimetros
├── altura_centimetros
└── largura_centimetros

pedidos (99.441 registros)
├── id_pedido (PK)
├── id_consumidor (FK → consumidores)
├── status
├── pedido_compra_timestamp
├── pedido_entregue_timestamp
├── data_estimada_entrega
├── tempo_entrega_dias
├── tempo_entrega_estimado_dias
├── diferenca_entrega_dias
└── entrega_no_prazo

itens_pedidos (112.650 registros)
├── id_pedido (PK, FK → pedidos)
├── id_item (PK)
├── id_produto (FK → produtos)
├── id_vendedor (FK → vendedores)
├── preco_BRL
└── preco_frete

avaliacoes_pedidos (95.307 registros)
├── id_avaliacao (PK)
├── id_pedido (FK → pedidos)
├── avaliacao (1 a 5)
├── titulo_comentario
├── comentario
├── data_comentario
└── data_resposta
```

### Relação entre avaliações e produtos

As avaliações estão vinculadas a **pedidos**, não diretamente a produtos. O caminho é:

```
produto → itens_pedidos → pedido → avaliação
```

A nota média de um produto é calculada agregando todas as avaliações dos pedidos que contêm aquele produto.

---

## Estrutura do Projeto

```
project-sqlalchemy/
│
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py                  # Ponto de entrada da API (FastAPI)
│   │   ├── database.py              # Configuração do SQLAlchemy (engine, session)
│   │   ├── config.py                # Variáveis de ambiente (DATABASE_URL)
│   │   ├── categoria_imagens.py     # Carregamento de imagens por categoria
│   │   ├── models/
│   │   │   ├── consumidor.py        # Model: Consumidor
│   │   │   ├── vendedor.py          # Model: Vendedor
│   │   │   ├── produto.py           # Model: Produto
│   │   │   ├── pedido.py            # Model: Pedido
│   │   │   ├── item_pedido.py       # Model: ItemPedido
│   │   │   └── avaliacao_pedido.py  # Model: AvaliacaoPedido
│   │   ├── schemas/
│   │   │   ├── produto.py           # Schemas: Create, Update, Read, Detail
│   │   │   ├── avaliacao.py         # Schemas: AvaliacaoRead, ListResponse
│   │   │   └── categoria.py         # Schema: CategoriaRead
│   │   └── routers/
│   │       ├── produtos.py          # CRUD + busca + estatísticas + avaliações
│   │       └── categorias.py        # Listagem de categorias
│   ├── alembic/
│   │   └── versions/
│   │       ├── 001_initial_schema.py    # Criação das tabelas
│   │       └── 002_add_indexes.py       # Índices de performance
│   ├── data/                        # Arquivos CSV para popular o banco
│   │   ├── dim_produtos.csv
│   │   ├── dim_consumidores.csv
│   │   ├── dim_vendedores.csv
│   │   ├── dim_categoria_imagens.csv
│   │   ├── fat_pedidos.csv
│   │   ├── fat_itens_pedidos.csv
│   │   └── fat_avaliacoes_pedidos.csv
│   ├── seed.py                      # Script de população do banco
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── main.tsx                 # Entrada do React
    │   ├── App.tsx                  # Rotas da aplicação
    │   ├── index.css                # Estilos globais (Tailwind + Inter font)
    │   ├── api/
    │   │   ├── client.ts            # Instância do Axios
    │   │   ├── produtos.ts          # Chamadas da API de produtos
    │   │   └── categorias.ts        # Chamadas da API de categorias
    │   ├── types/
    │   │   └── index.ts             # Interfaces TypeScript
    │   ├── utils/
    │   │   └── formatters.ts        # Formatação de categorias, moeda, datas
    │   ├── hooks/
    │   │   ├── useProducts.ts       # Hook para listagem de produtos
    │   │   ├── useProductDetail.ts  # Hook para detalhe do produto
    │   │   └── useCategories.ts     # Hook para categorias
    │   ├── pages/
    │   │   ├── HomePage.tsx         # Página inicial
    │   │   ├── CatalogPage.tsx      # Catálogo com filtros
    │   │   ├── ProductDetailPage.tsx # Detalhes do produto
    │   │   ├── ProductFormPage.tsx  # Formulário criar/editar
    │   │   └── NotFoundPage.tsx     # Página 404
    │   └── components/
    │       ├── layout/              # Header, Footer, Layout
    │       ├── product/             # ProductCard, ProductGrid
    │       ├── catalog/             # SearchBar, CategoryFilter, SortSelect
    │       ├── review/              # StarRating, ReviewCard, ReviewList
    │       └── ui/                  # Pagination, Loading, Empty, Error, Confirm
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## Decisões Técnicas

| Decisão | Justificativa |
|---------|---------------|
| Tailwind CSS sem biblioteca de componentes | Garante visual customizado e único, sem aparência genérica |
| Imagens de categorias em memória (dict) | Apenas 69 categorias — não justifica criar tabela adicional |
| IDs como UUID hex (32 caracteres) | Mantém compatibilidade com o formato dos dados fornecidos |
| Índices nas foreign keys | Reduz tempo de consulta de ~9s para ~0.2s nas queries com JOINs |
| Seed com SQL raw (INSERT OR IGNORE) | 10x mais rápido que inserção via ORM para 440k registros |
| Avaliação média só no detalhe | Evita JOINs complexos na listagem, mantendo a paginação rápida |
