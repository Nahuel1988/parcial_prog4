from collections.abc import Generator

from sqlmodel import SQLModel, Session, create_engine

from app.core.config import settings


engine = create_engine(settings.database_url, echo=True)


def init_db() -> None:
    from app.modules.audit_logs.models import AuditLog
    from app.modules.categories.models import Category
    from app.modules.ingredients.models import Ingredient
    from app.modules.order_items.models import OrderItem
    from app.modules.orders.models import Order
    from app.modules.payments.models import Payment
    from app.modules.product_categories.models import ProductCategory
    from app.modules.product_ingredients.models import ProductIngredient
    from app.modules.products.models import Product
    from app.modules.roles.models import Role
    from app.modules.users.models import User

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
