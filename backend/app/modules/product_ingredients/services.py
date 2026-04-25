from sqlmodel import Session, select

from app.modules.product_ingredients.models import ProductIngredient
from app.modules.product_ingredients.schemas import ProductIngredientCreate, ProductIngredientUpdate


def create_product_ingredient(session: Session, data: ProductIngredientCreate) -> ProductIngredient:
    product_ingredient = ProductIngredient.model_validate(data)
    session.add(product_ingredient)
    session.commit()
    session.refresh(product_ingredient)
    return product_ingredient


def list_product_ingredients(
    session: Session,
    *,
    offset: int = 0,
    limit: int = 20,
) -> list[ProductIngredient]:
    statement = select(ProductIngredient).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_product_ingredient(session: Session, product_id: int, ingredient_id: int) -> ProductIngredient | None:
    return session.get(ProductIngredient, (product_id, ingredient_id))


def update_product_ingredient(
    session: Session,
    product_id: int,
    ingredient_id: int,
    data: ProductIngredientUpdate,
) -> ProductIngredient | None:
    product_ingredient = session.get(ProductIngredient, (product_id, ingredient_id))
    if product_ingredient is None:
        return None

    product_ingredient.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(product_ingredient)
    session.commit()
    session.refresh(product_ingredient)
    return product_ingredient


def delete_product_ingredient(session: Session, key: tuple[int, int]) -> bool:
    product_ingredient = session.get(ProductIngredient, key)
    if product_ingredient is None:
        return False

    session.delete(product_ingredient)
    session.commit()
    return True
