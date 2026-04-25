from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.modules.order_items.schemas import OrderItemBase, OrderItemRead


class OrderBase(BaseModel):
    usuario_id: Optional[int] = None
    notas: Optional[str] = None


class OrderCreate(OrderBase):
    items: list[OrderItemBase] = Field(default_factory=list)


class OrderUpdate(BaseModel):
    notas: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    estado: str


class OrderRead(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    estado: str
    total: float
    created_at: datetime
    updated_at: datetime


class OrderReadFull(OrderRead):
    items: list[OrderItemRead] = Field(default_factory=list)
