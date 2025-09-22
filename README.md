## Levantar el proyecto con Docker (simple)

### Requisitos

- Docker y Docker Compose Plugin

### 1) Configurar variables de entorno del backend

Edita `apps/backend/.env` (créalo si no existe o modifica el archivo de ejemplo .env.example y cambia el nombre):

```env
# Backend
BACKEND_PORT=3000

# Base de datos
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mindfactory

# Frontend (puerto de exposición)
FRONTEND_PORT=4200
```

Nota: luego se agregará aquí la información sobre variables de entorno del frontend.

### 2) (Opcional) Generar migraciones cuando cambies el modelo

Si modificas entidades/esquema, genera una nueva migración **referenciando el DataSource** que está en `apps/backend/src/database/datasources/`:

```bash
cd apps/backend
npm ci
npm run typeorm -- migration:generate src/migrations/NuevaMigracion \
  -d src/database/datasources/postgresql.datasource.ts
```

Las migraciones se ejecutan automáticamente dentro del contenedor al iniciar el servicio backend (el `Dockerfile` corre `typeorm migration:run` antes de arrancar la app).

### 3) Construir y levantar con Docker

Desde la raíz del repo:

```bash
docker compose up -d --build
```

Esto levanta:

- Postgres 16 (volumen `postgres_data`)
- API NestJS (prefijo `/api`)
- Frontend Angular

### 4) Acceso rápido

- API: `http://localhost:${BACKEND_PORT}/api`
- Frontend: `http://localhost:${FRONTEND_PORT}`
- Postgres: `localhost:${POSTGRES_PORT}`

### Notas

- `docker-compose.yml` usa `apps/backend/.env` para inyectar variables en los servicios.
- El backend ejecuta migraciones en el arranque del contenedor usando el DataSource compilado `dist/database/datasources/postgresql.datasource.js`.
