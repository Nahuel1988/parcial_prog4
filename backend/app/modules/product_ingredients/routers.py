from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.product_ingredients.schemas import (
    ProductIngredientCreate,
    ProductIngredientRead,
    ProductIngredientUpdate,
)
from app.modules.product_ingredients.services import (
    create_product_ingredient,
    delete_product_ingredient,
    get_product_ingredient,
    list_product_ingredients,
    update_product_ingredient,
)

router = APIRouter(prefix="/producto-ingredientes", tags=["ProductoIngredientes"])


@router.post("/", response_model=ProductIngredientRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: ProductIngredientCreate, session: Session = Depends(get_uow_session)):
    return create_product_ingredient(session, payload)


@router.get("/", response_model=list[ProductIngredientRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_product_ingredients(session, offset=offset, limit=limit)


@router.get("/{product_id}/{ingredient_id}", response_model=ProductIngredientRead)
def read_item(
    product_id: Annotated[int, Path(gt=0)],
    ingredient_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    product_ingredient = get_product_ingredient(session, product_id, ingredient_id)
    if product_ingredient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductIngredient not found")
    return product_ingredient


@router.patch("/{product_id}/{ingredient_id}", response_model=ProductIngredientRead)
def update_item(
    product_id: Annotated[int, Path(gt=0)],
    ingredient_id: Annotated[int, Path(gt=0)],
    payload: ProductIngredientUpdate,
    session: Session = Depends(get_uow_session),
):
    product_ingredient = update_product_ingredient(session, product_id, ingredient_id, payload)
    if product_ingredient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductIngredient not found")
    return product_ingredient


@router.delete("/{product_id}/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    product_id: Annotated[int, Path(gt=0)],
    ingredient_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_product_ingredient(session, (product_id, ingredient_id))
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductIngredient not found")
