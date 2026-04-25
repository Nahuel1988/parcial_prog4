from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session

from app.core.uow import get_uow_session
from app.modules.payments.schemas import PaymentCreate, PaymentRead, PaymentUpdate
from app.modules.payments.services import create_payment, delete_payment, get_payment, list_payments, update_payment

router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.post("/", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: PaymentCreate, session: Session = Depends(get_uow_session)):
    return create_payment(session, payload)


@router.get("/", response_model=list[PaymentRead])
def read_items(
    session: Session = Depends(get_uow_session),
    offset: Annotated[int, Query(ge=0, le=100000)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return list_payments(session, offset=offset, limit=limit)


@router.get("/{payment_id}", response_model=PaymentRead)
def read_item(
    payment_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    payment = get_payment(session, payment_id)
    if payment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return payment


@router.patch("/{payment_id}", response_model=PaymentRead)
def update_item(
    payment_id: Annotated[int, Path(gt=0)],
    payload: PaymentUpdate,
    session: Session = Depends(get_uow_session),
):
    payment = update_payment(session, payment_id, payload)
    if payment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return payment


@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    payment_id: Annotated[int, Path(gt=0)],
    session: Session = Depends(get_uow_session),
):
    deleted = delete_payment(session, payment_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
