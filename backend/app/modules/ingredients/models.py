from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class Ingredient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False, min_length=2, max_length=100)
    descripcion: Optional[str] = Field(default=None)
    es_alergeno: bool = Field(default=False)

    product_links: list["ProductIngredient"] = Relationship(back_populates="ingredient")
