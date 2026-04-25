# Seed rapido para frontend

## Ejecutar seed
Desde la raiz del proyecto:

```powershell
c:/Users/moral/OneDrive/Desktop/parcial_prog4/.venv/Scripts/python.exe -m app.seed
```

## Que crea
- Rol: `admin`
- Usuario: `admin@food.local`
- Password: `admin123`
- Categoria: `Pizzas`
- Ingrediente: `Queso`
- Producto: `Pizza Muzzarella`
- Relaciones de producto con categoria e ingrediente
- Pedido seed (estado `pagado`) con item
- Pago seed aprobado
- Evento de auditoria seed

## Caracteristicas
- Idempotente: si lo corres varias veces, no duplica los datos base.

## Probar rapido en Swagger
1. `POST /auth/login` con:
```json
{
  "email": "admin@food.local",
  "password": "admin123"
}
```
2. `GET /productos?offset=0&limit=10`
3. `GET /pedidos?limit=10`
4. `GET /pagos`
5. `GET /auditoria`
