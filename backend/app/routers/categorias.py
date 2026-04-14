from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.categoria_imagens import get_all_categories
from app.database import get_db
from app.models.produto import Produto
from app.schemas.categoria import CategoriaRead

router = APIRouter()


@router.get("/", response_model=list[CategoriaRead])
def list_categorias(db: Session = Depends(get_db)) -> list[CategoriaRead]:
    rows = (
        db.query(Produto.categoria_produto, func.count(Produto.id_produto).label("total"))
        .group_by(Produto.categoria_produto)
        .all()
    )

    all_images = get_all_categories()

    categorias: list[CategoriaRead] = []
    for categoria, total in rows:
        imagem_url = all_images.get(categoria, "")
        categorias.append(
            CategoriaRead(
                nome=categoria,
                imagem_url=imagem_url,
                total_produtos=total,
            )
        )

    categorias.sort(key=lambda c: c.nome)
    return categorias
