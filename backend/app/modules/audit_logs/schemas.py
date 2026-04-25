from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AuditLogCreate(BaseModel):
    pedido_id: Optional[int] = None
    usuario_id: Optional[int] = None
    evento: str
    detalle: Optional[str] = None


class AuditLogRead(AuditLogCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
