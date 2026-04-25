from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="orders.id", nullable=False)
    producto_id: int = Field(foreign_key="product.id", nullable=False)
    cantidad: int = Field(default=1, ge=1)
    precio_unitario: float = Field(default=0, ge=0)
    subtotal: float = Field(default=0, ge=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
