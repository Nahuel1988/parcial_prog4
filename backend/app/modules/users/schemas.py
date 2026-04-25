from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    rol_id: Optional[int] = None
    nombre: str
    apellido: Optional[str] = None
    email: EmailStr
    activo: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    rol_id: Optional[int] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    activo: Optional[bool] = None


class UserPasswordUpdate(BaseModel):
    password: str


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
