from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: Optional[int] = Field(default=None, foreign_key="orders.id")
    usuario_id: Optional[int] = Field(default=None, foreign_key="users.id")
    evento: str = Field(nullable=False, max_length=80)
    detalle: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
