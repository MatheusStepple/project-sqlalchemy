from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.categoria_imagens import load_category_images
from app.routers import categorias, produtos


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    load_category_images()
    yield


app = FastAPI(
    title="Sistema de Compras Online",
    description="API para gerenciamento de produtos, pedidos e avaliações.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(produtos.router, prefix="/api/produtos", tags=["Produtos"])
app.include_router(categorias.router, prefix="/api/categorias", tags=["Categorias"])


@app.get("/", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "API rodando com sucesso!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
