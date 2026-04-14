from app.schemas.produto import (
    ProdutoCreate,
    ProdutoUpdate,
    ProdutoRead,
    ProdutoDetail,
    ProdutoListResponse,
)
from app.schemas.avaliacao import AvaliacaoRead, AvaliacaoListResponse
from app.schemas.categoria import CategoriaRead

__all__ = [
    "ProdutoCreate",
    "ProdutoUpdate",
    "ProdutoRead",
    "ProdutoDetail",
    "ProdutoListResponse",
    "AvaliacaoRead",
    "AvaliacaoListResponse",
    "CategoriaRead",
]
