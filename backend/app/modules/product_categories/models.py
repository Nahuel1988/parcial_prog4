from typing import Optional
from datetime import datetime, timezone

from sqlmodel import Field, Relationship, SQLModel


class ProductCategory(SQLModel, table=True):
    producto_id: int = Field(foreign_key="product.id", primary_key=True)
    categoria_id: int = Field(foreign_key="category.id", primary_key=True)
    es_principal: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    product: Optional["Product"] = Relationship(back_populates="category_links")
    category: Optional["Category"] = Relationship(back_populates="product_links")