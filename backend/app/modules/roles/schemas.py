from typing import Optional

from pydantic import BaseModel, ConfigDict


class RoleBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    activo: bool = True


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None


class RoleRead(RoleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
