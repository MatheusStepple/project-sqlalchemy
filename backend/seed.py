import csv
from pathlib import Path

from sqlalchemy import text

from app.database import engine

DATA_DIR = Path(__file__).parent / "data"

TABLE_CSV_MAP = [
    ("consumidores", "dim_consumidores.csv"),
    ("vendedores", "dim_vendedores.csv"),
    ("produtos", "dim_produtos.csv"),
    ("pedidos", "fat_pedidos.csv"),
    ("itens_pedidos", "fat_itens_pedidos.csv"),
    ("avaliacoes_pedidos", "fat_avaliacoes_pedidos.csv"),
]

BATCH_SIZE = 5000


def seed() -> None:
    for table_name, csv_file in TABLE_CSV_MAP:
        path = DATA_DIR / csv_file
        if not path.exists():
            print(f"! Arquivo nao encontrado: {path}")
            continue
        count = 0
        with open(path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            batch: list[dict] = []
            for row in reader:
                cleaned = {k: (v if v != "" else None) for k, v in row.items()}
                batch.append(cleaned)
                if len(batch) >= BATCH_SIZE:
                    _insert_batch(table_name, batch)
                    count += len(batch)
                    batch = []
            if batch:
                _insert_batch(table_name, batch)
                count += len(batch)
        print(f"v {table_name}: {count} registros inseridos")


def _insert_batch(table_name: str, rows: list[dict]) -> None:
    if not rows:
        return
    cols = list(rows[0].keys())
    placeholders = ", ".join(f":{c}" for c in cols)
    col_names = ", ".join(cols)
    stmt = text(
        f"INSERT OR IGNORE INTO {table_name} ({col_names}) VALUES ({placeholders})"
    )
    with engine.begin() as conn:
        conn.execute(stmt, rows)


if __name__ == "__main__":
    print("Iniciando seed do banco de dados...")
    seed()
    print("Seed concluido!")
