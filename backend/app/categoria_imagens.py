import csv
from pathlib import Path

_category_images: dict[str, str] = {}

DATA_DIR = Path(__file__).parent.parent / "data"


def load_category_images() -> None:
    csv_path = DATA_DIR / "dim_categoria_imagens.csv"
    if not csv_path.exists():
        return
    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            categoria = row.get("Categoria", "").strip()
            link = row.get("Link", "").strip()
            if categoria and link:
                _category_images[categoria] = link


def get_category_image(categoria: str) -> str | None:
    return _category_images.get(categoria)


def get_all_categories() -> dict[str, str]:
    return dict(_category_images)
