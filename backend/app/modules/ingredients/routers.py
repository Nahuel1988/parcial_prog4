from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
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
def create_item(payload: IngredientCreate, session: Session = Depends(get_uow_session)):
    return create_ingredient(session, payload)


@router.get("/", response_model=list[IngredientRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_ingredients(session, offset=offset, limit=limit)


@router.get("/{ingredient_id}", response_model=IngredientRead)
def read_item(
    ingredient_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    ingredient = get_ingredient(session, ingredient_id)
    if ingredient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    return ingredient


@router.patch("/{ingredient_id}", response_model=IngredientRead)
def update_item(
    ingredient_id: Annotated[int, Path(gt=0)],
    payload: IngredientUpdate,
    session: Session = Depends(get_uow_session),
):
    ingredient = update_ingredient(session, ingredient_id, payload)
    if ingredient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    return ingredient


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    ingredient_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_ingredient(session, ingredient_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
