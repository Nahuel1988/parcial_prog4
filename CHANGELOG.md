# Changelog

## 2026-05-08
- Removed: Root endpoint `GET /` (OpenAPI tag `General`) — endpoint deprecated/removed because it provided no functional behavior.
- Added: `backend/API_SMOKE_REQUESTS.http` and `backend/scripts/smoke_e2e.ps1` for E2E smoke testing (create ingredient, create product, link category, link ingredient, verify retrieval).

Notes:
- Backend now exposes only domain endpoints for Categories, Ingredients, ProductCategories and ProductIngredients, and Products.
