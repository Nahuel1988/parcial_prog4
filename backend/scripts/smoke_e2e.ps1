# Smoke E2E script: crea ingrediente, producto, vincula categoría e ingrediente y muestra el producto final
$base = 'http://127.0.0.1:8000'

Write-Output "Listando categorias..."
Invoke-RestMethod -Uri "$base/categorias/" | ConvertTo-Json -Depth 3 | Write-Output

Write-Output "Creando ingrediente..."
$ing = Invoke-RestMethod -Uri "$base/ingredientes/" -Method Post -Body (@{nombre='Ing Smoke Script'; descripcion='Creado por smoke_e2e.ps1'; es_alergeno=$false} | ConvertTo-Json) -ContentType 'application/json'
Write-Output "Ingrediente creado: $($ing.id)"

Write-Output "Creando producto..."
$prod = Invoke-RestMethod -Uri "$base/productos/" -Method Post -Body (@{nombre='Producto Smoke Script'; descripcion='Creado por smoke_e2e.ps1'; precio_base=123.45; imagenes_url=$null; stock_cantidad=3; disponible=$true} | ConvertTo-Json) -ContentType 'application/json'
Write-Output "Producto creado: $($prod.id)"

Write-Output "Vinculando producto a categoria id=1..."
$relCat = Invoke-RestMethod -Uri "$base/producto-categorias/" -Method Post -Body (@{producto_id=$prod.id; categoria_id=1; es_principal=$true} | ConvertTo-Json) -ContentType 'application/json'
Write-Output "ProductCategory creado: $($relCat.producto_id) -> $($relCat.categoria_id)"

Write-Output "Vinculando producto a ingrediente..."
$relIng = Invoke-RestMethod -Uri "$base/producto-ingredientes/" -Method Post -Body (@{producto_id=$prod.id; ingrediente_id=$ing.id; es_removible=$false} | ConvertTo-Json) -ContentType 'application/json'
Write-Output "ProductIngredient creado: $($relIng.producto_id) -> $($relIng.ingrediente_id)"

Write-Output "Obteniendo producto completo:"
$prodFull = Invoke-RestMethod -Uri "$base/productos/$($prod.id)" -Method Get
$prodFull | ConvertTo-Json -Depth 5 | Write-Output
