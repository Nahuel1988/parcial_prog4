from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.product_categories.schemas import (
    ProductCategoryCreate,
    ProductCategoryRead,
    ProductCategoryUpdate,
)
from app.modules.product_categories.services import (
    create_product_category,
    delete_product_category,
    get_product_category,
    list_product_categories,
    update_product_category,
)

router = APIRouter(prefix="/producto-categorias", tags=["ProductoCategorias"])


@router.post("/", response_model=ProductCategoryRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: ProductCategoryCreate, session: Session = Depends(get_uow_session)):
    return create_product_category(session, payload)


@router.get("/", response_model=list[ProductCategoryRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_product_categories(session, offset=offset, limit=limit)


@router.get("/{product_id}/{category_id}", response_model=ProductCategoryRead)
def read_item(
    product_id: Annotated[int, Path(gt=0)],
    category_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    product_category = get_product_category(session, product_id, category_id)
    if product_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductCategory not found")
    return product_category


@router.patch("/{product_id}/{category_id}", response_model=ProductCategoryRead)
def update_item(
    product_id: Annotated[int, Path(gt=0)],
    category_id: Annotated[int, Path(gt=0)],
    payload: ProductCategoryUpdate,
    session: Session = Depends(get_uow_session),
):
    product_category = update_product_category(session, product_id, category_id, payload)
    if product_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductCategory not found")
    return product_category


@router.delete("/{product_id}/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    product_id: Annotated[int, Path(gt=0)],
    category_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_product_category(session, (product_id, category_id))
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductCategory not found")
