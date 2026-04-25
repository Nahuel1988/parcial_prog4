# Como usar API_SMOKE_REQUESTS.http

## Opcion A: Extension REST Client en VS Code
1. Instalar extension: `REST Client`.
2. Abrir `API_SMOKE_REQUESTS.http`.
3. Ejecutar requests de arriba hacia abajo con `Send Request`.

## Opcion B: Usar Swagger
- Abrir `http://127.0.0.1:8000/docs` y ejecutar en el mismo orden.

## Recomendaciones
- Si ya corriste pruebas antes, los IDs pueden no ser `1`.
- Ajustar manualmente `rol_id`, `usuario_id`, `producto_id`, `categoria_id`, `ingrediente_id`, `pedido_id` segun respuestas reales.
- Para validaciones, dejar como estan los requests al final (`/productos/0` y email duplicado).

## Resultado esperado del flujo feliz
- Login 200
- Alta producto/categoria/ingrediente 201
- Alta pedido 201 con total > 0
- Alta pago 201
- Pedido final con `estado = pagado`
- Auditoria con eventos de ORDER_CREATED y PAYMENT_CREATED
