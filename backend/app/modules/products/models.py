from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from app.modules.categories.models import Category
from app.modules.ingredients.models import Ingredient


class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False, min_length=2, max_length=150)
    descripcion: Optional[str] = Field(default=None)
    precio_base: float = Field(gt=0)
    imagenes_url: Optional[str] = Field(default=None)
    stock_cantidad: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)

    category_links: list["ProductCategory"] = Relationship(back_populates="product")
    ingredient_links: list["ProductIngredient"] = Relationship(back_populates="product")

    @property
    def categories(self) -> list[Category]:
        return [link.category for link in self.category_links if link.category is not None]

    @property
    def ingredients(self) -> list[Ingredient]:
        return [link.ingredient for link in self.ingredient_links if link.ingredient is not None]
