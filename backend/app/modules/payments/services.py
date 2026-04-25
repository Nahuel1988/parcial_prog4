from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.modules.audit_logs.models import AuditLog
from app.modules.orders.models import Order
from app.modules.payments.models import Payment
from app.modules.payments.schemas import PaymentCreate, PaymentUpdate


def create_payment(session: Session, data: PaymentCreate) -> Payment:
    order = session.get(Order, data.pedido_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    payment = Payment.model_validate(data)
    session.add(payment)

    if payment.estado.lower() in {"aprobado", "paid", "pagado"}:
        order.estado = "pagado"
        session.add(order)

    session.add(AuditLog(pedido_id=payment.pedido_id, usuario_id=order.usuario_id, evento="PAYMENT_CREATED", detalle=f"Pago {payment.estado}"))
    session.commit()
    session.refresh(payment)
    return payment


def list_payments(session: Session, *, offset: int = 0, limit: int = 20) -> list[Payment]:
    statement = select(Payment).order_by(Payment.created_at.desc()).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def get_payment(session: Session, payment_id: int) -> Payment | None:
    return session.get(Payment, payment_id)


def update_payment(session: Session, payment_id: int, data: PaymentUpdate) -> Payment | None:
    payment = session.get(Payment, payment_id)
    if payment is None:
        return None

    payment.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(payment)

    order = session.get(Order, payment.pedido_id)
    if order is not None and payment.estado and payment.estado.lower() in {"aprobado", "paid", "pagado"}:
        order.estado = "pagado"
        session.add(order)

    session.add(AuditLog(pedido_id=payment.pedido_id, usuario_id=order.usuario_id if order else None, evento="PAYMENT_UPDATED", detalle=f"Pago actualizado a {payment.estado}"))
    session.commit()
    session.refresh(payment)
    return payment


def delete_payment(session: Session, payment_id: int) -> bool:
    payment = session.get(Payment, payment_id)
    if payment is None:
        return False

    session.delete(payment)
    session.commit()
    return True
