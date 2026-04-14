from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AvaliacaoRead(BaseModel):
    id_avaliacao: str
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None
    data_comentario: Optional[datetime] = None
    nome_consumidor: Optional[str] = None
    model_config = {"from_attributes": True}


class AvaliacaoListResponse(BaseModel):
    items: list[AvaliacaoRead]
    total: int
    page: int
    page_size: int
    total_pages: int
