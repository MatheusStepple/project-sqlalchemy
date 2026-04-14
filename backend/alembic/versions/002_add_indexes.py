"""Add performance indexes on foreign key columns

Revision ID: 002
Revises: 001
Create Date: 2026-04-13

"""
from typing import Sequence, Union

from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index('ix_itens_pedidos_id_produto', 'itens_pedidos', ['id_produto'])
    op.create_index('ix_itens_pedidos_id_pedido', 'itens_pedidos', ['id_pedido'])
    op.create_index('ix_itens_pedidos_id_vendedor', 'itens_pedidos', ['id_vendedor'])
    op.create_index('ix_avaliacoes_pedidos_id_pedido', 'avaliacoes_pedidos', ['id_pedido'])
    op.create_index('ix_pedidos_id_consumidor', 'pedidos', ['id_consumidor'])


def downgrade() -> None:
    op.drop_index('ix_pedidos_id_consumidor', table_name='pedidos')
    op.drop_index('ix_avaliacoes_pedidos_id_pedido', table_name='avaliacoes_pedidos')
    op.drop_index('ix_itens_pedidos_id_vendedor', table_name='itens_pedidos')
    op.drop_index('ix_itens_pedidos_id_pedido', table_name='itens_pedidos')
    op.drop_index('ix_itens_pedidos_id_produto', table_name='itens_pedidos')
