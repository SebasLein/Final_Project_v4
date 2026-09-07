# DOMUX API — Endpoints (v1.0)

Base URL local: `http://localhost:4000`
Documentación interactiva (Swagger UI): `http://localhost:4000/docs`

Todas las rutas privadas requieren el header:
```
Authorization: Bearer <accessToken>
```

Roles: `SUPERADMIN`, `ADMIN`, `GATEKEEPER`, `RESIDENT`.

Códigos de estado usados de forma consistente: `200`, `201`, `400` (payload inválido), `401` (no autenticado / credenciales inválidas), `403` (autenticado pero sin permiso o tenant), `404`, `409` (conflicto de negocio, ej. reserva solapada).

## Auth (público)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | `{ email, password }` → `{ accessToken, refreshToken, user }` |
| POST | `/auth/refresh` | `{ refreshToken }` → `{ accessToken }` |

## Tenants — solo SUPERADMIN

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/tenants` | Lista todas las propiedades |
| POST | `/tenants` | `{ name, slug }` crea una propiedad |
| PATCH | `/tenants/:id` | `{ name?, active? }` edita/activa/desactiva |

## Administradores — solo SUPERADMIN

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/admins` | Lista administradores de todas las propiedades |
| POST | `/admins` | `{ name, email, password, tenantId }` crea un ADMIN y lo asigna a una propiedad |
| PATCH | `/users/:id/active` | `{ active }` activa/desactiva cualquier cuenta |

## Usuarios de la propiedad — solo ADMIN (de su propio tenant)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/users` | Lista GATEKEEPER y RESIDENT de su propiedad |
| POST | `/users` | `{ name, email, password, role: GATEKEEPER\|RESIDENT, unitId? }` crea un usuario en su propiedad |

## Unidades — solo ADMIN

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/units` | Lista unidades de la propiedad con sus residentes |
| POST | `/units` | `{ code }` crea una unidad |

## Visitantes — ADMIN, GATEKEEPER, RESIDENT (según acción)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/visitors?status=&unitCode=` | ADMIN/GATEKEEPER/RESIDENT | ADMIN ve historial completo, GATEKEEPER ve autorizados/entrados, RESIDENT ve los que él autorizó |
| POST | `/visitors/authorize` | RESIDENT | `{ fullName, documentId, type }` autoriza un visitante a su propia unidad |
| PATCH | `/visitors/:id/cancel` | RESIDENT | Cancela una autorización propia (solo si sigue AUTHORIZED) |
| POST | `/visitors/manual` | GATEKEEPER | `{ fullName, documentId, type, unitCode }` registra un ingreso no autorizado previamente (queda en ENTERED) |
| PATCH | `/visitors/:id/entry` | GATEKEEPER | AUTHORIZED → ENTERED |
| PATCH | `/visitors/:id/exit` | GATEKEEPER | ENTERED → EXITED |

## Paquetes — ADMIN, GATEKEEPER, RESIDENT (según acción)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/packages?status=` | ADMIN/GATEKEEPER/RESIDENT | ADMIN/GATEKEEPER ven todos (filtrables), RESIDENT ve solo los de su unidad |
| POST | `/packages` | GATEKEEPER | `{ unitCode, recipient }` registra un paquete (PENDING) |
| PATCH | `/packages/:id/deliver` | GATEKEEPER | PENDING → DELIVERED |

## Zonas comunes — ADMIN gestiona, RESIDENT consulta

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/common-areas` | ADMIN/RESIDENT | ADMIN ve todas (incluidas inactivas), RESIDENT solo las activas |
| POST | `/common-areas` | ADMIN | `{ name, description?, openTime, closeTime }` |
| PATCH | `/common-areas/:id` | ADMIN | `{ name?, description?, openTime?, closeTime?, active? }` |

## Reservas — RESIDENT crea/cancela, ADMIN consulta

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/reservations?commonAreaId=&date=` | ADMIN/RESIDENT | ADMIN ve todas las de su propiedad, RESIDENT ve solo las suyas |
| POST | `/reservations` | RESIDENT | `{ commonAreaId, date, startTime, endTime }` — rechaza solapes (409) y horarios fuera del rango de la zona |
| PATCH | `/reservations/:id/cancel` | RESIDENT | ACTIVE → CANCELLED (solo el dueño de la reserva) |

## Comunicados — ADMIN gestiona, todos consultan

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/notices` | ADMIN/GATEKEEPER/RESIDENT | ADMIN ve todos, el resto solo los activos |
| POST | `/notices` | ADMIN | `{ title, body }` |
| PATCH | `/notices/:id` | ADMIN | `{ title?, body?, active? }` |

## Dashboard

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/dashboard/summary` | SUPERADMIN/ADMIN | SUPERADMIN → `{ scope: 'global', tenants, admins, totalUsers }`. ADMIN → `{ scope: 'tenant', units, residents, activeVisitors, pendingPackages, activeReservations }`. Todos los números vienen de conteos reales en PostgreSQL. |

## Salud

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | `{ ok: true, service: 'domux-api' }` |
