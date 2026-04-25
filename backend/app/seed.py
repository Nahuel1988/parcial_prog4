import hashlib
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.core.database import engine
from app.modules.audit_logs.models import AuditLog
from app.modules.categories.models import Category
from app.modules.ingredients.models import Ingredient
from app.modules.order_items.models import OrderItem
from app.modules.orders.models import Order
from app.modules.payments.models import Payment
from app.modules.product_categories.models import ProductCategory
from app.modules.product_ingredients.models import ProductIngredient
from app.modules.products.models import Product
from app.modules.roles.models import Role
from app.modules.users.models import User


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def seed_data() -> None:
    now = datetime.now(timezone.utc)

    with Session(engine) as session:
        role = session.exec(select(Role).where(Role.nombre == "admin")).first()
        if role is None:
            role = Role(nombre="admin", descripcion="Administrador", activo=True)
            session.add(role)
            session.commit()
            session.refresh(role)
            print("[seed] role admin creado")

        user = session.exec(select(User).where(User.email == "admin@food.local")).first()
        if user is None:
            user = User(
                rol_id=role.id,
                nombre="Admin",
                apellido="Seed",
                email="admin@food.local",
                password_hash=_hash_password("admin123"),
                activo=True,
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            print("[seed] usuario admin@food.local creado")

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

        order = session.exec(
            select(Order).where(Order.usuario_id == user.id).where(Order.notas == "pedido seed")
        ).first()
        if order is None:
            order = Order(
                usuario_id=user.id,
                estado="pagado",
                total=3500,
                notas="pedido seed",
                created_at=now,
                updated_at=now,
            )
            session.add(order)
            session.commit()
            session.refresh(order)
            print("[seed] pedido seed creado")

            order_item = OrderItem(
                pedido_id=order.id,
                producto_id=product.id,
                cantidad=1,
                precio_unitario=3500,
                subtotal=3500,
                created_at=now,
            )
            session.add(order_item)

            payment = Payment(
                pedido_id=order.id,
                monto=3500,
                metodo="tarjeta",
                estado="aprobado",
                referencia="SEED-PAY-001",
                created_at=now,
            )
            session.add(payment)

            session.add(
                AuditLog(
                    pedido_id=order.id,
                    usuario_id=user.id,
                    evento="SEED_CREATED",
                    detalle="Datos iniciales creados",
                    created_at=now,
                )
            )
            session.commit()
            print("[seed] item, pago y auditoria seed creados")

        print("[seed] listo")


if __name__ == "__main__":
    seed_data()
