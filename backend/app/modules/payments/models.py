from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class Payment(SQLModel, table=True):
    __tablename__ = "payments"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="orders.id", nullable=False)
    monto: float = Field(ge=0)
    metodo: str = Field(max_length=40)
    estado: str = Field(default="pendiente", max_length=30)
    referencia: Optional[str] = Field(default=None, max_length=120)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
