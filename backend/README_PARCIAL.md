# Parcial Prog4 - Backend Checklist de Entrega

## 1) Entorno
- Entorno virtual: `.venv`
- Dependencias: `requirements.txt`
- Ejecucion en dev:

```powershell
cd app
python -m fastapi dev main.py
```

## 2) Modelado SQLModel + Relaciones
Se modelan relaciones 1:N y N:N con `Relationship`.

### Catalogo
- Productos: `app/modules/products/models.py`
- Categorias (autorreferencia parent/children): `app/modules/categories/models.py`
- Ingredientes: `app/modules/ingredients/models.py`
- N:N Producto-Categoria: `app/modules/product_categories/models.py`
- N:N Producto-Ingrediente: `app/modules/product_ingredients/models.py`

### Dominios adicionales
- Roles: `app/modules/roles/models.py`
- Usuarios: `app/modules/users/models.py`
- Pedidos: `app/modules/orders/models.py`
- Items de pedido: `app/modules/order_items/models.py`
- Pagos: `app/modules/payments/models.py`
- Auditoria: `app/modules/audit_logs/models.py`

## 3) Validacion con Annotated, Query y Path
Se aplica validacion en routers clave:
- Productos: `app/modules/products/routers.py`
- Usuarios: `app/modules/users/routers.py`
- Pedidos: `app/modules/orders/routers.py`

Ejemplos:
- `Path(gt=0)` para IDs
- `Query(ge=0, le=100000)` para `offset`
- `Query(ge=1, le=100)` para `limit`

## 4) CRUD persistente en PostgreSQL
Se exponen CRUD funcionales en PostgreSQL para:
- Catalogo (`/productos`, `/categorias`, `/ingredientes`, tablas puente)
- Identidad (`/roles`, `/usuarios`, `/auth/login`)
- Ventas y pagos (`/pedidos`, `/pedido-items`, `/pagos`)
- Trazabilidad (`/auditoria`)

## 5) Seguridad de datos con response_model
Se usa `response_model` para controlar salida y evitar filtrado de datos sensibles.

Caso importante:
- `users` no expone `password_hash`, porque responde `UserRead`.

## 6) Estructura modular + UoW
Estructura por modulo:
- `models.py`
- `schemas.py`
- `services.py`
- `routers.py`

Unidad de trabajo:
- `app/core/uow.py`

## Smoke Test recomendado (Swagger)
Abrir: `http://127.0.0.1:8000/docs`

### Flujo minimo
1. POST `/roles/`
2. POST `/usuarios/`
3. POST `/auth/login`
4. POST `/productos/`
5. POST `/pedidos/` con `items`
6. POST `/pagos/` con estado `aprobado`
7. GET `/pedidos/{id}` (esperado: `estado = pagado`)
8. GET `/auditoria/` (esperado: eventos registrados)

## Notas
- Si falla conexion DB, validar `.env`:

```env
DATABASE_URL=postgresql+psycopg://usuario:password@localhost:5432/parcial_prog4
```
