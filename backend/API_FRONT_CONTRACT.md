# Contrato API para Front

## Base
- Base URL local: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs
- Nota: el login devuelve token, pero hoy no hay middleware de autorizacion aplicado en rutas.

## Pantalla: Login

### POST /auth/login
Request
- email: string (email)
- password: string

Response 200
- access_token: string
- token_type: string (bearer)
- user_id: integer
- email: string

Errores
- 401 credenciales invalidas

## Pantalla: Usuarios (admin)

### GET /usuarios?offset=0&limit=20
Response 200: lista de UserRead
- id, rol_id, nombre, apellido, email, activo

### GET /usuarios/{user_id}
Path
- user_id > 0

Response 200: UserRead
Errores
- 404 no existe
- 422 id invalido

### POST /usuarios
Request
- rol_id: integer | null
- nombre: string
- apellido: string | null
- email: string (email)
- password: string
- activo: boolean

Response 201: UserRead
Errores
- 409 email existente
- 422 validacion

### PATCH /usuarios/{user_id}
Request parcial
- rol_id, nombre, apellido, email, activo

Response 200: UserRead
Errores
- 404 no existe
- 409 email existente

### PATCH /usuarios/{user_id}/password
Request
- password: string

Response 200: UserRead

### DELETE /usuarios/{user_id}
Response 204

## Pantalla: Roles (admin)

### GET /roles
### GET /roles/{role_id}
### POST /roles
### PATCH /roles/{role_id}
### DELETE /roles/{role_id}

Role payload
- nombre: string
- descripcion: string | null
- activo: boolean

## Pantalla: Catalogo

### Productos
- GET /productos?offset=0&limit=20
- GET /productos/{product_id}
- POST /productos
- PATCH /productos/{product_id}
- DELETE /productos/{product_id}

ProductCreate
- nombre: string
- descripcion: string | null
- precio_base: number
- imagenes_url: string | null
- stock_cantidad: integer
- disponible: boolean

ProductReadFull
- id, nombre, descripcion, precio_base, imagenes_url, stock_cantidad, disponible
- categories: CategoryRead[]
- ingredients: IngredientRead[]

### Categorias
- GET /categorias
- GET /categorias/{category_id}
- POST /categorias
- PATCH /categorias/{category_id}
- DELETE /categorias/{category_id}

Category payload
- parent_id: integer | null
- nombre: string
- descripcion: string | null
- imagen_url: string | null

### Ingredientes
- GET /ingredientes
- GET /ingredientes/{ingredient_id}
- POST /ingredientes
- PATCH /ingredientes/{ingredient_id}
- DELETE /ingredientes/{ingredient_id}

Ingredient payload
- nombre: string
- descripcion: string | null
- es_alergeno: boolean

### Relaciones del catalogo

Producto-Categoria
- GET /producto-categorias
- GET /producto-categorias/{product_id}/{category_id}
- POST /producto-categorias
- PATCH /producto-categorias/{product_id}/{category_id}
- DELETE /producto-categorias/{product_id}/{category_id}

Payload
- producto_id: integer
- categoria_id: integer
- es_principal: boolean

Producto-Ingrediente
- GET /producto-ingredientes
- GET /producto-ingredientes/{product_id}/{ingredient_id}
- POST /producto-ingredientes
- PATCH /producto-ingredientes/{product_id}/{ingredient_id}
- DELETE /producto-ingredientes/{product_id}/{ingredient_id}

Payload
- producto_id: integer
- ingrediente_id: integer
- es_removible: boolean

## Pantalla: Pedidos

### GET /pedidos?limit=20
### GET /pedidos/{order_id}
### POST /pedidos
### PATCH /pedidos/{order_id}
### PATCH /pedidos/{order_id}/estado
### DELETE /pedidos/{order_id}

OrderCreate
- usuario_id: integer | null
- notas: string | null
- items: array de
  - producto_id: integer
  - cantidad: integer

OrderReadFull
- id, usuario_id, notas, estado, total, created_at, updated_at
- items: array de
  - id, pedido_id, producto_id, cantidad, precio_unitario, subtotal, created_at

Estados sugeridos para UI
- pendiente
- pagado
- cancelado
- entregado

## Pantalla: Items de pedido

### GET /pedido-items
### GET /pedido-items/pedido/{order_id}
### POST /pedido-items
### PATCH /pedido-items/{item_id}
### DELETE /pedido-items/{item_id}

Create payload
- pedido_id: integer
- producto_id: integer
- cantidad: integer >= 1

## Pantalla: Pagos

### GET /pagos
### GET /pagos/{payment_id}
### POST /pagos
### PATCH /pagos/{payment_id}
### DELETE /pagos/{payment_id}

PaymentCreate
- pedido_id: integer
- monto: number
- metodo: string
- estado: string (pendiente por defecto)
- referencia: string | null

Nota funcional
- Si estado llega como aprobado, paid o pagado, el pedido pasa a estado pagado.

## Pantalla: Auditoria

### GET /auditoria
### POST /auditoria

AuditLog
- id
- pedido_id: integer | null
- usuario_id: integer | null
- evento: string
- detalle: string | null
- created_at: datetime

## Errores comunes para front
- 401: login invalido
- 404: recurso inexistente
- 409: conflicto de negocio (ejemplo: email duplicado)
- 422: validacion de entrada (Path, Query o body)

## Mapeo sugerido Front -> API
- Login: /auth/login
- Gestion usuarios: /usuarios, /roles
- Catalogo: /productos, /categorias, /ingredientes
- Configuracion producto: /producto-categorias, /producto-ingredientes
- Checkout/pedidos: /pedidos, /pedido-items
- Pagos: /pagos
- Trazabilidad: /auditoria
