from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow, SqlModelUnitOfWork
from app.modules.ingredients.schemas import IngredientCreate, IngredientRead, IngredientUpdate
from app.modules.ingredients.services import (
    create_ingredient,
    delete_ingredient,
    get_ingredient,
    list_ingredients,
    update_ingredient,
)

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.post("/", response_model=IngredientRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: IngredientCreate, uow: SqlModelUnitOfWork = Depends(get_uow)):
    ingredient = create_ingredient(uow.session, payload)
    uow.commit()
    try:
        uow.session.refresh(ingredient)
    except Exception:
        pass
    return ingredient


@router.get("/", response_model=list[IngredientRead])
def read_items(
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    with SqlModelUnitOfWork() as uow:
        return list_ingredients(uow.session, offset=offset, limit=limit)


@router.get("/{ingredient_id}", response_model=IngredientRead)
def read_item(
    ingredient_id: Annotated[int, Path(gt=0)],
):
    with SqlModelUnitOfWork() as uow:
        ingredient = get_ingredient(uow.session, ingredient_id)
    if ingredient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    return ingredient


@router.patch("/{ingredient_id}", response_model=IngredientRead)
def update_item(
    ingredient_id: Annotated[int, Path(gt=0)],
    payload: IngredientUpdate,
    uow: SqlModelUnitOfWork = Depends(get_uow),
):
    ingredient = update_ingredient(uow.session, ingredient_id, payload)
    if ingredient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    uow.commit()
    try:
        uow.session.refresh(ingredient)
    except Exception:
        pass
    return ingredient


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    ingredient_id: Annotated[int, Path(gt=0)],
    uow: SqlModelUnitOfWork = Depends(get_uow),
):
    deleted = delete_ingredient(uow.session, ingredient_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    uow.commit()
