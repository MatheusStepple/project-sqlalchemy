from typing import Optional

from pydantic import BaseModel, Field


class ProdutoCreate(BaseModel):
    nome_produto: str = Field(..., min_length=1, max_length=255)
    categoria_produto: str = Field(..., max_length=100)
    peso_produto_gramas: Optional[float] = Field(None, ge=0)
    comprimento_centimetros: Optional[float] = Field(None, ge=0)
    altura_centimetros: Optional[float] = Field(None, ge=0)
    largura_centimetros: Optional[float] = Field(None, ge=0)


class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = Field(None, min_length=1, max_length=255)
    categoria_produto: Optional[str] = Field(None, max_length=100)
    peso_produto_gramas: Optional[float] = Field(None, ge=0)
    comprimento_centimetros: Optional[float] = Field(None, ge=0)
    altura_centimetros: Optional[float] = Field(None, ge=0)
    largura_centimetros: Optional[float] = Field(None, ge=0)


class ProdutoRead(BaseModel):
    id_produto: str
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None
    categoria_imagem_url: Optional[str] = None
    model_config = {"from_attributes": True}


class ProdutoDetail(ProdutoRead):
    total_vendas: int = 0
    receita_total: float = 0.0
    avaliacao_media: Optional[float] = None
    total_avaliacoes: int = 0


class ProdutoListResponse(BaseModel):
    items: list[ProdutoRead]
    total: int
    page: int
    page_size: int
    total_pages: int
