from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
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
def create_item(payload: ProductCreate, session: Session = Depends(get_uow_session)):
    return create_product(session, payload)


@router.get("/", response_model=list[ProductReadFull])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_products(session, offset=offset, limit=limit)


@router.get("/{product_id}", response_model=ProductReadFull)
def read_item(
    product_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    product = get_product(session, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.patch("/{product_id}", response_model=ProductReadFull)
def update_item(
    product_id: Annotated[int, Path(gt=0)],
    payload: ProductUpdate,
    session: Session = Depends(get_uow_session),
):
    product = update_product(session, product_id, payload)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    product_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_product(session, product_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
