from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PaymentBase(BaseModel):
    pedido_id: int
    monto: float
    metodo: str
    estado: str = "pendiente"
    referencia: Optional[str] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    estado: Optional[str] = None
    referencia: Optional[str] = None


class PaymentRead(PaymentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
