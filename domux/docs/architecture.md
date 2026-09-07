# Arquitectura DOMUX

## Decisiones clave
- **Monorepo** para compartir componentes, tipos y configuración.
- **Next.js** para marketing, SEO, App Router, rendering híbrido y navegación premium.
- **Fastify** para una API rápida y extensible con plugins de seguridad.
- **Prisma + PostgreSQL** por consistencia transaccional, modelado claro y soporte sólido para SaaS B2B.
- **Multi-tenant por columna `tenantId` + guardas centralizadas** para la demo; evoluciona a esquema/DB por tenant cuando el volumen lo requiera.

## Capas del backend (apps/api)
```
routes/       → mapeo endpoint→controller + middlewares (auth, roles, tenant). Sin lógica de negocio.
controllers/  → HTTP in/out: valida payload con Zod, llama al service, arma la respuesta.
services/     → reglas de negocio, control de tenant/permisos, consultas Prisma.
lib/prisma.ts → cliente Prisma (acceso a PostgreSQL).
```

## Jerarquía de roles y tenants
```
DOMUX
└── SUPERADMIN (sin tenant — gestiona la plataforma)
    ├── Tenant A (propiedad horizontal)
    │   ├── ADMIN
    │   ├── GATEKEEPER
    │   └── RESIDENT (1..n, cada uno con su Unit)
    └── Tenant B
        └── ...
```
- `SUPERADMIN` crea/edita/activa propiedades (`Tenant`) y crea administradores (`ADMIN`) asignándolos a una propiedad.
- `ADMIN` gestiona únicamente su propiedad: unidades, usuarios (GATEKEEPER/RESIDENT), visitantes, paquetes, zonas comunes, reservas y comunicados de su `tenantId`.
- `GATEKEEPER` y `RESIDENT` operan exclusivamente dentro del `tenantId` de su cuenta.

## Multi-tenancy
- `tenantId` obligatorio en todas las entidades de negocio (`Unit`, `Visitor`, `Package`, `CommonArea`, `Reservation`, `Notice`); opcional solo en `User` (para permitir `SUPERADMIN`) y en `AuditLog`.
- El `tenantId` con el que se filtra cada consulta viene siempre del JWT del usuario autenticado (`request.authUser.tenantId`), nunca de un parámetro que el cliente pueda manipular.
- El decorator `requireTenant` bloquea con 403 cualquier request de un rol no-SUPERADMIN sin `tenantId`.
- El decorator `authorize(...roles)` bloquea con 403 cualquier rol no permitido para ese endpoint.
