from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class ProductCategory(SQLModel, table=True):
    producto_id: int = Field(foreign_key="product.id", primary_key=True)
    categoria_id: int = Field(foreign_key="category.id", primary_key=True)
    es_principal: bool = Field(default=False)

    product: Optional["Product"] = Relationship(back_populates="category_links")
    category: Optional["Category"] = Relationship(back_populates="product_links")