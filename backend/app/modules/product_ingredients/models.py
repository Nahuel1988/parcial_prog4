from typing import Optional
from datetime import datetime, timezone

from sqlmodel import Field, Relationship, SQLModel


class ProductIngredient(SQLModel, table=True):
    producto_id: int = Field(foreign_key="product.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingredient.id", primary_key=True)
    es_removible: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    product: Optional["Product"] = Relationship(back_populates="ingredient_links")
    ingredient: Optional["Ingredient"] = Relationship(back_populates="product_links")
