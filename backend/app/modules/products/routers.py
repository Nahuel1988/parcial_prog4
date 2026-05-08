from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow, SqlModelUnitOfWork
from app.modules.products.schemas import ProductCreate, ProductReadFull, ProductUpdate
from app.modules.products.services import (
    create_product,
    delete_product,
    get_product,
    list_products,
    update_product,
)

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post("/", response_model=ProductReadFull, status_code=status.HTTP_201_CREATED)
def create_item(payload: ProductCreate, uow: SqlModelUnitOfWork = Depends(get_uow)):
    product = create_product(uow.session, payload)
    uow.commit()
    try:
        uow.session.refresh(product)
    except Exception:
        pass
    return product


@router.get("/", response_model=list[ProductReadFull])
def read_items(
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    # read-only: create a short-lived session via UoW dependency
    with SqlModelUnitOfWork() as uow:
        return list_products(uow.session, offset=offset, limit=limit)


@router.get("/{product_id}", response_model=ProductReadFull)
def read_item(
    product_id: Annotated[int, Path(gt=0)],
):
    with SqlModelUnitOfWork() as uow:
        product = get_product(uow.session, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.patch("/{product_id}", response_model=ProductReadFull)
def update_item(
    product_id: Annotated[int, Path(gt=0)],
    payload: ProductUpdate,
    uow: SqlModelUnitOfWork = Depends(get_uow),
):
    product = update_product(uow.session, product_id, payload)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    uow.commit()
    try:
        uow.session.refresh(product)
    except Exception:
        pass
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    product_id: Annotated[int, Path(gt=0)],
    uow: SqlModelUnitOfWork = Depends(get_uow),
):
    deleted = delete_product(uow.session, product_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    uow.commit()
