from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class OrderItemBase(BaseModel):
    producto_id: int
    cantidad: int = 1


class OrderItemCreate(OrderItemBase):
    pedido_id: int


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float
    subtotal: float
    created_at: datetime


class OrderItemUpdate(BaseModel):
    cantidad: Optional[int] = None
