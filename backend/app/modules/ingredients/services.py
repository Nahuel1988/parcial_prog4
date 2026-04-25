from sqlmodel import Session, select

from app.modules.ingredients.models import Ingredient
from app.modules.ingredients.schemas import IngredientCreate, IngredientUpdate


def create_ingredient(session: Session, data: IngredientCreate) -> Ingredient:
    ingredient = Ingredient.model_validate(data)
    session.add(ingredient)
    session.commit()
    session.refresh(ingredient)
    return ingredient


def list_ingredients(session: Session, *, offset: int = 0, limit: int = 20) -> list[Ingredient]:
    statement = select(Ingredient).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_ingredient(session: Session, ingredient_id: int) -> Ingredient | None:
    return session.get(Ingredient, ingredient_id)


def update_ingredient(session: Session, ingredient_id: int, data: IngredientUpdate) -> Ingredient | None:
    ingredient = session.get(Ingredient, ingredient_id)
    if ingredient is None:
        return None

    ingredient.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(ingredient)
    session.commit()
    session.refresh(ingredient)
    return ingredient


def delete_ingredient(session: Session, ingredient_id: int) -> bool:
    ingredient = session.get(Ingredient, ingredient_id)
    if ingredient is None:
        return False

    session.delete(ingredient)
    session.commit()
    return True
