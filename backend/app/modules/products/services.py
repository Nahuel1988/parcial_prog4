from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from app.modules.products.models import Product
from app.modules.products.schemas import ProductCreate, ProductUpdate
from app.modules.product_categories.models import ProductCategory
from app.modules.product_ingredients.models import ProductIngredient


def _product_query():
    return select(Product).options(
        selectinload(Product.category_links).selectinload(ProductCategory.category),
        selectinload(Product.ingredient_links).selectinload(ProductIngredient.ingredient),
    )


def create_product(session: Session, data: ProductCreate) -> Product:
    product = Product.model_validate(data)
    session.add(product)
    session.commit()
    session.refresh(product)
    return get_product(session, product.id) or product


def list_products(session: Session, *, offset: int = 0, limit: int = 20) -> list[Product]:
    statement = _product_query().offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_product(session: Session, product_id: int) -> Product | None:
    statement = _product_query().where(Product.id == product_id)
    return session.exec(statement).first()


def update_product(session: Session, product_id: int, data: ProductUpdate) -> Product | None:
    product = session.get(Product, product_id)
    if product is None:
        return None

    updates = data.model_dump(exclude_unset=True)
    product.sqlmodel_update(updates)
    session.add(product)
    session.commit()
    session.refresh(product)
    return get_product(session, product.id) or product


def delete_product(session: Session, product_id: int) -> bool:
    product = session.get(Product, product_id)
    if product is None:
        return False

    session.delete(product)
    session.commit()
    return True
