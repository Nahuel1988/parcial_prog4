from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.order_items.schemas import OrderItemCreate, OrderItemRead, OrderItemUpdate
from app.modules.order_items.services import (
    create_order_item,
    delete_order_item,
    list_order_items,
    list_order_items_by_order,
    update_order_item,
)

router = APIRouter(prefix="/pedido-items", tags=["PedidoItems"])


@router.post("/", response_model=OrderItemRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: OrderItemCreate, session: Session = Depends(get_uow_session)):
    return create_order_item(session, payload)


@router.get("/", response_model=list[OrderItemRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_order_items(session, offset=offset, limit=limit)


@router.get("/pedido/{order_id}", response_model=list[OrderItemRead])
def read_items_by_order(
    order_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_order_items_by_order(session, order_id, offset=offset, limit=limit)


@router.patch("/{item_id}", response_model=OrderItemRead)
def update_item(
    item_id: Annotated[int, Path(gt=0)],
    payload: OrderItemUpdate,
    session: Session = Depends(get_uow_session),
):
    item = update_order_item(session, item_id, payload)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order item not found")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    item_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_order_item(session, item_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order item not found")
