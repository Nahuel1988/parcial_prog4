from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.modules.order_items.models import OrderItem
from app.modules.order_items.schemas import OrderItemCreate, OrderItemUpdate
from app.modules.orders.models import Order
from app.modules.products.models import Product


def create_order_item(session: Session, data: OrderItemCreate) -> OrderItem:
    order = session.get(Order, data.pedido_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    product = session.get(Product, data.producto_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    item = OrderItem(
        pedido_id=data.pedido_id,
        producto_id=data.producto_id,
        cantidad=data.cantidad,
        precio_unitario=product.precio_base,
        subtotal=product.precio_base * data.cantidad,
    )
    session.add(item)

    order.total += item.subtotal
    session.add(order)

    session.commit()
    session.refresh(item)
    return item


def list_order_items(session: Session, *, offset: int = 0, limit: int = 20) -> list[OrderItem]:
    statement = select(OrderItem).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def list_order_items_by_order(
    session: Session,
    order_id: int,
    *,
    offset: int = 0,
    limit: int = 20,
) -> list[OrderItem]:
    statement = select(OrderItem).where(OrderItem.pedido_id == order_id).offset(offset).limit(limit)
    return list(session.exec(statement).all())


def update_order_item(session: Session, item_id: int, data: OrderItemUpdate) -> OrderItem | None:
    item = session.get(OrderItem, item_id)
    if item is None:
        return None

    order = session.get(Order, item.pedido_id)
    if order is None:
        return None

    updates = data.model_dump(exclude_unset=True)
    if "cantidad" in updates:
        new_qty = updates["cantidad"]
        if new_qty is None or new_qty < 1:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid quantity")

        order.total -= item.subtotal
        item.cantidad = new_qty
        item.subtotal = item.precio_unitario * new_qty
        order.total += item.subtotal

    session.add(item)
    session.add(order)
    session.commit()
    session.refresh(item)
    return item


def delete_order_item(session: Session, item_id: int) -> bool:
    item = session.get(OrderItem, item_id)
    if item is None:
        return False

    order = session.get(Order, item.pedido_id)
    if order is not None:
        order.total = max(0, order.total - item.subtotal)
        session.add(order)

    session.delete(item)
    session.commit()
    return True
