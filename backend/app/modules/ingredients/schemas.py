from typing import Optional

from pydantic import BaseModel, ConfigDict


class IngredientBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    es_alergeno: bool = False


class IngredientCreate(IngredientBase):
    pass


class IngredientUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    es_alergeno: Optional[bool] = None


class IngredientRead(IngredientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
