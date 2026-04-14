import math
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.categoria_imagens import get_category_image
from app.database import get_db
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.consumidor import Consumidor
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.schemas.avaliacao import AvaliacaoListResponse, AvaliacaoRead
from app.schemas.produto import (
    ProdutoCreate,
    ProdutoDetail,
    ProdutoListResponse,
    ProdutoRead,
    ProdutoUpdate,
)

router = APIRouter()


def _enrich_produto(produto: Produto) -> ProdutoRead:
    data = ProdutoRead.model_validate(produto)
    data.categoria_imagem_url = get_category_image(produto.categoria_produto)
    return data


@router.get("/", response_model=ProdutoListResponse)
def list_produtos(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(""),
    categoria: str = Query(""),
    ordem: str = Query("nome_asc"),
    db: Session = Depends(get_db),
) -> ProdutoListResponse:
    query = db.query(Produto)

    if search:
        query = query.filter(Produto.nome_produto.ilike(f"%{search}%"))

    if categoria:
        query = query.filter(Produto.categoria_produto == categoria)

    order_map = {
        "nome_asc": Produto.nome_produto.asc(),
        "nome_desc": Produto.nome_produto.desc(),
    }
    order_clause = order_map.get(ordem, Produto.nome_produto.asc())
    query = query.order_by(order_clause)

    total = query.count()
    total_pages = max(1, math.ceil(total / page_size))
    offset = (page - 1) * page_size
    produtos = query.offset(offset).limit(page_size).all()

    items = [_enrich_produto(p) for p in produtos]

    return ProdutoListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{id_produto}", response_model=ProdutoDetail)
def get_produto(id_produto: str, db: Session = Depends(get_db)) -> ProdutoDetail:
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    total_vendas = (
        db.query(func.count(ItemPedido.id_item))
        .filter(ItemPedido.id_produto == id_produto)
        .scalar()
        or 0
    )

    receita_total = (
        db.query(func.sum(ItemPedido.preco_BRL))
        .filter(ItemPedido.id_produto == id_produto)
        .scalar()
        or 0.0
    )

    avg_q = (
        db.query(func.avg(AvaliacaoPedido.avaliacao))
        .join(Pedido, AvaliacaoPedido.id_pedido == Pedido.id_pedido)
        .join(ItemPedido, Pedido.id_pedido == ItemPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .scalar()
    )

    total_avaliacoes = (
        db.query(func.count(AvaliacaoPedido.id_avaliacao))
        .join(Pedido, AvaliacaoPedido.id_pedido == Pedido.id_pedido)
        .join(ItemPedido, Pedido.id_pedido == ItemPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .scalar()
        or 0
    )

    detail = ProdutoDetail(
        id_produto=produto.id_produto,
        nome_produto=produto.nome_produto,
        categoria_produto=produto.categoria_produto,
        peso_produto_gramas=produto.peso_produto_gramas,
        comprimento_centimetros=produto.comprimento_centimetros,
        altura_centimetros=produto.altura_centimetros,
        largura_centimetros=produto.largura_centimetros,
        categoria_imagem_url=get_category_image(produto.categoria_produto),
        total_vendas=int(total_vendas),
        receita_total=float(receita_total),
        avaliacao_media=float(avg_q) if avg_q is not None else None,
        total_avaliacoes=int(total_avaliacoes),
    )
    return detail


@router.post("/", response_model=ProdutoRead, status_code=201)
def create_produto(body: ProdutoCreate, db: Session = Depends(get_db)) -> ProdutoRead:
    produto = Produto(
        id_produto=uuid4().hex,
        nome_produto=body.nome_produto,
        categoria_produto=body.categoria_produto,
        peso_produto_gramas=body.peso_produto_gramas,
        comprimento_centimetros=body.comprimento_centimetros,
        altura_centimetros=body.altura_centimetros,
        largura_centimetros=body.largura_centimetros,
    )
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return _enrich_produto(produto)


@router.put("/{id_produto}", response_model=ProdutoRead)
def update_produto(
    id_produto: str, body: ProdutoUpdate, db: Session = Depends(get_db)
) -> ProdutoRead:
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(produto, field, value)

    db.commit()
    db.refresh(produto)
    return _enrich_produto(produto)


@router.delete("/{id_produto}")
def delete_produto(id_produto: str, db: Session = Depends(get_db)) -> dict[str, str]:
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    db.query(ItemPedido).filter(ItemPedido.id_produto == id_produto).delete()
    db.delete(produto)
    db.commit()
    return {"detail": "Produto removido com sucesso"}


@router.get("/{id_produto}/avaliacoes", response_model=AvaliacaoListResponse)
def list_avaliacoes_produto(
    id_produto: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> AvaliacaoListResponse:
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    base_query = (
        db.query(AvaliacaoPedido, Consumidor.nome_consumidor)
        .join(Pedido, AvaliacaoPedido.id_pedido == Pedido.id_pedido)
        .join(ItemPedido, Pedido.id_pedido == ItemPedido.id_pedido)
        .join(Consumidor, Pedido.id_consumidor == Consumidor.id_consumidor)
        .filter(ItemPedido.id_produto == id_produto)
        .distinct(AvaliacaoPedido.id_avaliacao)
    )

    total = base_query.count()
    total_pages = max(1, math.ceil(total / page_size))
    offset = (page - 1) * page_size
    rows = base_query.offset(offset).limit(page_size).all()

    items: list[AvaliacaoRead] = []
    for avaliacao, nome_consumidor in rows:
        items.append(
            AvaliacaoRead(
                id_avaliacao=avaliacao.id_avaliacao,
                avaliacao=avaliacao.avaliacao,
                titulo_comentario=avaliacao.titulo_comentario,
                comentario=avaliacao.comentario,
                data_comentario=avaliacao.data_comentario,
                nome_consumidor=nome_consumidor,
            )
        )

    return AvaliacaoListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
