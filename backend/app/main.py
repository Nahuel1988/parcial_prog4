from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.database import init_db
from app.modules.audit_logs.routers import router as audit_logs_router
from app.modules.auth.routers import router as auth_router
from app.modules.categories.routers import router as categories_router
from app.modules.ingredients.routers import router as ingredients_router
from app.modules.order_items.routers import router as order_items_router
from app.modules.orders.routers import router as orders_router
from app.modules.payments.routers import router as payments_router
from app.modules.product_categories.routers import router as product_categories_router
from app.modules.product_ingredients.routers import router as product_ingredients_router
from app.modules.products.routers import router as products_router
from app.modules.roles.routers import router as roles_router
from app.modules.users.routers import router as users_router


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
app.include_router(roles_router)
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(orders_router)
app.include_router(order_items_router)
app.include_router(payments_router)
app.include_router(audit_logs_router)


@app.get("/")
def root():
    return {"message": "Backend listo"}
