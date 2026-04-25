📌 Descripción del Proyecto – Parcial Programación 4
Este proyecto es una aplicación Fullstack desarrollada para el Primer Parcial de Programación IV (UTN). Integra un backend en FastAPI + SQLModel y un frontend en React + TypeScript + Tailwind, con persistencia real en PostgreSQL y manejo avanzado de estado de servidor mediante TanStack Query.

El objetivo es demostrar una arquitectura completa que incluya modelado de datos, relaciones complejas, CRUD persistente, navegación SPA y un flujo funcional de punta a punta.

🟣 Backend – FastAPI + SQLModel
El backend implementa los módulos:

Categoría

Producto

Ingrediente

ProductoCategoria (relación N:N)

ProductoIngrediente (relación N:N)

Características principales:

Modelado con SQLModel, usando Relationship y back_populates para relaciones 1:N y N:N.

Endpoints organizados por módulos, con validaciones usando Annotated, Query, Path y manejo de errores con HTTPException.

Persistencia real en PostgreSQL, con creación automática de tablas.

Uso de response_model para controlar la salida y evitar exponer datos innecesarios.

Arquitectura limpia con carpetas para models, schemas, routers, services y uow.

🟢 Frontend – React + TypeScript + Tailwind
El frontend está construido con:

Vite + React + TypeScript

Tailwind CSS 4 para estilos

TanStack Query para estado del servidor

React Router DOM para navegación SPA

Cada módulo (Categorías, Ingredientes y Productos) incluye:

Página propia

Tabla de registros

Botones de acciones (crear, editar, eliminar)

Modal con formulario tipado en TypeScript

Integración directa con la API real

🔵 Integración – TanStack Query
useQuery para listados y detalles.

useMutation para crear, editar y eliminar.

invalidateQueries para refrescar la UI automáticamente.

Manejo visual de estados: loading, error y success.

🟢 Flujo Completo
La demo del proyecto muestra:

Creación, edición y eliminación de registros.

Validaciones desde Pydantic y mensajes de error en la UI.

Visualización de relaciones (por ejemplo, productos con sus categorías e ingredientes).

Peticiones visibles en consola del navegador y terminal del backend.

📁 Tecnologías Utilizadas
FastAPI

SQLModel

PostgreSQL

React + TypeScript

Vite

Tailwind CSS

TanStack Query

Axios

React Router DOM

🎥 Video de Presentación
El repositorio incluye el link al video donde se explica:

Arquitectura del backend

Estructura del frontend

Flujo completo de CRUD

Validaciones y relaciones

Persistencia en PostgreSQL

Si querés, te armo también un README completo con instalación, comandos, estructura de carpetas y screenshots.
