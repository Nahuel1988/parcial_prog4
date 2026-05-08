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


app = FastAPI(title="Parcial Prog4 Backend", lifespan=lifespan)

app.include_router(categories_router)
app.include_router(ingredients_router)
app.include_router(product_categories_router)
app.include_router(product_ingredients_router)
app.include_router(products_router)


@app.get("/")
def root():
    return {"message": "Backend listo"}
