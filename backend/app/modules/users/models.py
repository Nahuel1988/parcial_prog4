from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    rol_id: Optional[int] = Field(default=None, foreign_key="roles.id")
    nombre: str = Field(nullable=False, max_length=80)
    apellido: Optional[str] = Field(default=None, max_length=80)
    email: str = Field(index=True, nullable=False, max_length=120)
    password_hash: str = Field(nullable=False, max_length=256)
    activo: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
