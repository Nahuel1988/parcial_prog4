from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.modules.audit_logs.models import AuditLog
from app.modules.order_items.models import OrderItem
from app.modules.orders.models import Order
from app.modules.orders.schemas import OrderCreate, OrderStatusUpdate, OrderUpdate
from app.modules.products.models import Product


def _attach_items(session: Session, orders: list[Order]) -> list[dict]:
    payloads: list[dict] = []
    for order in orders:
        statement = select(OrderItem).where(OrderItem.pedido_id == order.id)
        items = list(session.exec(statement).all())
        payloads.append({**order.model_dump(), "items": [item.model_dump() for item in items]})
    return payloads


def create_order(session: Session, data: OrderCreate) -> dict:
    order = Order(usuario_id=data.usuario_id, notas=data.notas)
    session.add(order)
    session.commit()
    session.refresh(order)

    total = 0.0
    for row in data.items:
        product = session.get(Product, row.producto_id)
        if product is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {row.producto_id} not found")

        subtotal = product.precio_base * row.cantidad
        total += subtotal
        item = OrderItem(
            pedido_id=order.id,
            producto_id=row.producto_id,
            cantidad=row.cantidad,
            precio_unitario=product.precio_base,
            subtotal=subtotal,
        )
        session.add(item)

    order.total = total
    order.updated_at = datetime.now(timezone.utc)
    session.add(order)
    session.add(AuditLog(pedido_id=order.id, usuario_id=order.usuario_id, evento="ORDER_CREATED", detalle="Pedido creado"))
    session.commit()

    return _attach_items(session, [order])[0]


def list_orders(session: Session, *, limit: int = 20, usuario_id: int | None = None) -> list[dict]:
    statement = select(Order)
    if usuario_id is not None:
        statement = statement.where(Order.usuario_id == usuario_id)
    statement = statement.order_by(Order.created_at.desc()).limit(limit)
    orders = list(session.exec(statement).all())
    return _attach_items(session, orders)


def get_order(session: Session, order_id: int) -> dict | None:
    order = session.get(Order, order_id)
    if order is None:
        return None
    return _attach_items(session, [order])[0]


def update_order(session: Session, order_id: int, data: OrderUpdate) -> dict | None:
    order = session.get(Order, order_id)
    if order is None:
        return None

    order.sqlmodel_update(data.model_dump(exclude_unset=True))
    order.updated_at = datetime.now(timezone.utc)
    session.add(order)
    session.add(AuditLog(pedido_id=order.id, usuario_id=order.usuario_id, evento="ORDER_UPDATED", detalle="Pedido actualizado"))
    session.commit()

    return _attach_items(session, [order])[0]


def update_order_status(session: Session, order_id: int, data: OrderStatusUpdate) -> dict | None:
    order = session.get(Order, order_id)
    if order is None:
        return None

    order.estado = data.estado
    order.updated_at = datetime.now(timezone.utc)
    session.add(order)
    session.add(AuditLog(pedido_id=order.id, usuario_id=order.usuario_id, evento="ORDER_STATUS_CHANGED", detalle=f"Estado: {data.estado}"))
    session.commit()

    return _attach_items(session, [order])[0]


def delete_order(session: Session, order_id: int) -> bool:
    order = session.get(Order, order_id)
    if order is None:
        return False

    statement = select(OrderItem).where(OrderItem.pedido_id == order.id)
    items = list(session.exec(statement).all())
    for item in items:
        session.delete(item)

    session.add(AuditLog(pedido_id=order.id, usuario_id=order.usuario_id, evento="ORDER_DELETED", detalle="Pedido eliminado"))
    session.delete(order)
    session.commit()
    return True
