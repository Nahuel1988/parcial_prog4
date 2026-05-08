from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.database import init_db
from app.modules.categories.routers import router as categories_router
from app.modules.ingredients.routers import router as ingredients_router
from app.modules.product_categories.routers import router as product_categories_router
from app.modules.product_ingredients.routers import router as product_ingredients_router
from app.modules.products.routers import router as products_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield



openapi_tags = [
    {"name": "Categorias", "description": "Operaciones sobre categorías"},
    {"name": "Ingredientes", "description": "Operaciones sobre ingredientes"},
    {"name": "ProductoCategorias", "description": "Operaciones sobre relaciones producto-categoría"},
    {"name": "ProductoIngredientes", "description": "Operaciones sobre relaciones producto-ingrediente"},
    {"name": "Productos", "description": "Operaciones sobre productos"},
    {"name": "General", "description": "Rutas generales del servicio"},
]

app = FastAPI(title="Parcial Prog4 Backend", lifespan=lifespan, openapi_tags=openapi_tags)

app.include_router(categories_router, tags=["Categorias"])
app.include_router(ingredients_router, tags=["Ingredientes"])
app.include_router(product_categories_router, tags=["ProductoCategorias"])
app.include_router(product_ingredients_router, tags=["ProductoIngredientes"])
app.include_router(products_router, tags=["Productos"])


@app.get("/", tags=["General"])
def root():
    return {"message": "Backend listo"}
