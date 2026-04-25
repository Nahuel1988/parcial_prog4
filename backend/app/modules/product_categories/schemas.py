from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductCategoryBase(BaseModel):
    producto_id: int
    categoria_id: int
    es_principal: bool = False


class ProductCategoryCreate(ProductCategoryBase):
    pass


class ProductCategoryUpdate(BaseModel):
    es_principal: Optional[bool] = None


class ProductCategoryRead(ProductCategoryBase):
    model_config = ConfigDict(from_attributes=True)
