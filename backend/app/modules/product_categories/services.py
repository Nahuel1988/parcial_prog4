from sqlmodel import Session, select

from app.modules.product_categories.models import ProductCategory
from app.modules.product_categories.schemas import ProductCategoryCreate, ProductCategoryUpdate


def create_product_category(session: Session, data: ProductCategoryCreate) -> ProductCategory:
    product_category = ProductCategory.model_validate(data)
    session.add(product_category)
    session.commit()
    session.refresh(product_category)
    return product_category


def list_product_categories(
    session: Session,
    *,
    offset: int = 0,
    limit: int = 20,
) -> list[ProductCategory]:
    statement = select(ProductCategory).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_product_category(session: Session, product_id: int, category_id: int) -> ProductCategory | None:
    return session.get(ProductCategory, (product_id, category_id))


def update_product_category(
    session: Session,
    product_id: int,
    category_id: int,
    data: ProductCategoryUpdate,
) -> ProductCategory | None:
    product_category = session.get(ProductCategory, (product_id, category_id))
    if product_category is None:
        return None

    product_category.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(product_category)
    session.commit()
    session.refresh(product_category)
    return product_category


def delete_product_category(session: Session, key: tuple[int, int]) -> bool:
    product_category = session.get(ProductCategory, key)
    if product_category is None:
        return False

    session.delete(product_category)
    session.commit()
    return True
