from pydantic import BaseModel


class CategoriaRead(BaseModel):
    nome: str
    imagem_url: str
    total_produtos: int
