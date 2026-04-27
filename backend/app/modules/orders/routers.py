from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.orders.schemas import OrderCreate, OrderReadFull, OrderStatusUpdate, OrderUpdate
from app.modules.orders.services import (
    create_order,
    delete_order,
    get_order,
    list_orders,
    update_order,
    update_order_status,
)

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post("/", response_model=OrderReadFull, status_code=status.HTTP_201_CREATED)
def create_item(payload: OrderCreate, session: Session = Depends(get_uow_session)):
    return create_order(session, payload)


@router.get("/", response_model=list[OrderReadFull])
def read_items(
    session: Session = Depends(get_uow_session),
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    usuario_id: Annotated[int | None, Query(gt=0)] = None,
):
    return list_orders(session, limit=limit, usuario_id=usuario_id)


@router.get("/{order_id}", response_model=OrderReadFull)
def read_item(
    order_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    order = get_order(session, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.patch("/{order_id}", response_model=OrderReadFull)
def update_item(
    order_id: Annotated[int, Path(gt=0)],
    payload: OrderUpdate,
    session: Session = Depends(get_uow_session),
):
    order = update_order(session, order_id, payload)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.patch("/{order_id}/estado", response_model=OrderReadFull)
def update_status(
    order_id: Annotated[int, Path(gt=0)],
    payload: OrderStatusUpdate,
    session: Session = Depends(get_uow_session),
):
    order = update_order_status(session, order_id, payload)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    order_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_order(session, order_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
