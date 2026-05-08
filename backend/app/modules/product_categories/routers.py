from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow, SqlModelUnitOfWork
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
def create_item(payload: ProductCategoryCreate, uow: SqlModelUnitOfWork = Depends(get_uow)):
    pc = create_product_category(uow.session, payload)
    uow.commit()
    try:
        uow.session.refresh(pc)
    except Exception:
        pass
    return pc


@router.get("/", response_model=list[ProductCategoryRead])
def read_items(
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    with SqlModelUnitOfWork() as uow:
        return list_product_categories(uow.session, offset=offset, limit=limit)


@router.get("/{product_id}/{category_id}", response_model=ProductCategoryRead)
def read_item(
    product_id: Annotated[int, Path(gt=0)],
    category_id: Annotated[int, Path(gt=0)],
):
    with SqlModelUnitOfWork() as uow:
        product_category = get_product_category(uow.session, product_id, category_id)
    if product_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductCategory not found")
    return product_category


@router.patch("/{product_id}/{category_id}", response_model=ProductCategoryRead)
def update_item(
    product_id: Annotated[int, Path(gt=0)],
    category_id: Annotated[int, Path(gt=0)],
    payload: ProductCategoryUpdate,
    uow: SqlModelUnitOfWork = Depends(get_uow),
):
    product_category = update_product_category(uow.session, product_id, category_id, payload)
    if product_category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductCategory not found")
    uow.commit()
    try:
        uow.session.refresh(product_category)
    except Exception:
        pass
    return product_category


@router.delete("/{product_id}/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    product_id: Annotated[int, Path(gt=0)],
    category_id: Annotated[int, Path(gt=0)],
    uow: SqlModelUnitOfWork = Depends(get_uow),
):
    deleted = delete_product_category(uow.session, (product_id, category_id))
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProductCategory not found")
    uow.commit()
