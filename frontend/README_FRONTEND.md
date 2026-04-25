# Frontend Parcial Prog4

## Requisitos cubiertos
- Vite + React + TypeScript
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- React Router con ruta dinamica `/detalle/:id`
- React Query (`useQuery`, `useMutation`, `invalidateQueries`)
- Estado local con `useState` en formulario de alta de producto
- Feedback visual de `Cargando...` y `Error`

## Ejecucion
1. En una terminal, backend:
   - `cd backend/app`
   - `python -m fastapi dev main.py`
2. En otra terminal, frontend:
   - `cd frontend`
   - `npm run dev`

## Notas
- El frontend consume `/api/*` y Vite lo proxea a `http://127.0.0.1:8000`.
- Si queres llamar una URL distinta, crear `.env` en frontend con:
  - `VITE_API_BASE_URL=http://127.0.0.1:8000`
