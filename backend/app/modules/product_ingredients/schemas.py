from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductIngredientBase(BaseModel):
    producto_id: int
    ingrediente_id: int
    es_removible: bool = False


class ProductIngredientCreate(ProductIngredientBase):
    pass


class ProductIngredientUpdate(BaseModel):
    es_removible: Optional[bool] = None


class ProductIngredientRead(ProductIngredientBase):
    model_config = ConfigDict(from_attributes=True)
