import hashlib
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.core.database import engine
from app.modules.categories.models import Category
from app.modules.ingredients.models import Ingredient
from app.modules.product_categories.models import ProductCategory
from app.modules.product_ingredients.models import ProductIngredient
from app.modules.products.models import Product


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def seed_data() -> None:
    now = datetime.now(timezone.utc)

    with Session(engine) as session:
        # Seed categories, ingredients and products for Dominio 2

        category = session.exec(select(Category).where(Category.nombre == "Pizzas")).first()
        if category is None:
            category = Category(nombre="Pizzas", descripcion="Categoria seed", imagen_url=None)
            session.add(category)
            session.commit()
            session.refresh(category)
            print("[seed] categoria Pizzas creada")

        ingredient = session.exec(select(Ingredient).where(Ingredient.nombre == "Queso")).first()
        if ingredient is None:
            ingredient = Ingredient(nombre="Queso", descripcion="Mozzarella", es_alergeno=True)
            session.add(ingredient)
            session.commit()
            session.refresh(ingredient)
            print("[seed] ingrediente Queso creado")

        product = session.exec(select(Product).where(Product.nombre == "Pizza Muzzarella")).first()
        if product is None:
            product = Product(
                nombre="Pizza Muzzarella",
                descripcion="Producto seed",
                precio_base=3500,
                imagenes_url=None,
                stock_cantidad=20,
                disponible=True,
            )
            session.add(product)
            session.commit()
            session.refresh(product)
            print("[seed] producto Pizza Muzzarella creado")

        product_category = session.get(ProductCategory, (product.id, category.id))
        if product_category is None:
            product_category = ProductCategory(producto_id=product.id, categoria_id=category.id, es_principal=True)
            session.add(product_category)
            session.commit()
            print("[seed] link producto-categoria creado")

        product_ingredient = session.get(ProductIngredient, (product.id, ingredient.id))
        if product_ingredient is None:
            product_ingredient = ProductIngredient(producto_id=product.id, ingrediente_id=ingredient.id, es_removible=True)
            session.add(product_ingredient)
            session.commit()
            print("[seed] link producto-ingrediente creado")

        print("[seed] listo")


if __name__ == "__main__":
    seed_data()
