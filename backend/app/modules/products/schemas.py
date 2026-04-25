from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.modules.categories.schemas import CategoryRead
from app.modules.ingredients.schemas import IngredientRead


class ProductBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    imagenes_url: Optional[str] = None
    stock_cantidad: int = 0
    disponible: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = None
    imagenes_url: Optional[str] = None
    stock_cantidad: Optional[int] = None
    disponible: Optional[bool] = None


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ProductReadFull(ProductRead):
    model_config = ConfigDict(from_attributes=True)

    categories: list[CategoryRead] = Field(default_factory=list)
    ingredients: list[IngredientRead] = Field(default_factory=list)
