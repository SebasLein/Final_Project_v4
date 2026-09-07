# DOMUX 1.0

Plataforma de gestión de propiedad horizontal. MVP académico funcional compuesto por:

- **Backend**: Node.js + Fastify + TypeScript + Prisma + PostgreSQL
- **Panel web**: Next.js 15 + React 19 + TypeScript + Tailwind (para `SUPERADMIN` y `ADMIN`)
- **App móvil**: Kotlin + Jetpack Compose + MVVM + Retrofit (para `GATEKEEPER` y `RESIDENT`)

Jerarquía de roles:

```
SUPERADMIN (plataforma completa, panel web)
 └── Tenant / Propiedad
      ├── ADMIN (gestiona su propiedad, panel web)
      ├── GATEKEEPER (portería, app móvil)
      └── RESIDENT (residentes, app móvil)
```

## Estado real del proyecto (léase antes que nada)

Este proyecto fue construido en un entorno sin acceso a internet salvo a los registros de npm/PyPI/GitHub. Por eso:

- El **backend compila** (`tsc --noEmit` limpio) pero **nunca se ejecutó contra una base de datos real** ni se generó el cliente de Prisma en este entorno. Tú debes correr `prisma generate` y `prisma migrate dev` la primera vez, con internet normal.
- El **panel web sí se compiló completamente con `next build`** en este entorno (16 rutas, build de producción exitoso). Es lo más cerca de "verificado en ejecución" que se pudo lograr aquí, aunque tampoco se probó contra un backend real corriendo.
- La **app Android nunca se compiló** — no hay Android SDK ni acceso a los repositorios Maven de Google en este entorno. Se hicieron verificaciones estáticas manuales (paquetes, imports, firmas de funciones cruzadas) descritas en `docs/android-api-audit.md` y en el informe de cierre, pero **la compilación real en Android Studio queda pendiente de que tú la hagas**.

No se declara nada como "100% funcional" sin esta aclaración.

---

## 1. Requisitos

- Node.js 20+
- Docker y Docker Compose (recomendado) o PostgreSQL 16 instalado localmente
- Android Studio (Koala o más reciente) para la app móvil

## 2. Instalación

```bash
git clone <este-repositorio>
cd domux
npm install --workspaces
```

## 3. Variables de entorno

Copia los `.env.example` de cada paquete:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Dónde | Descripción |
|---|---|---|
| `DATABASE_URL` | `apps/api/.env` | Cadena de conexión a PostgreSQL |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | `apps/api/.env` | Secretos para firmar los JWT. Cámbialos en cualquier entorno real. |
| `PORT` | `apps/api/.env` | Puerto del API (por defecto 4000) |
| `WEB_URL` | `apps/api/.env` | Origen permitido por CORS (el panel web) |
| `NEXT_PUBLIC_API_URL` | `apps/web/.env.local` | URL del API que consume el panel web |

## 4. PostgreSQL con Docker

```bash
docker compose up -d postgres
```

Esto levanta Postgres 16 en `localhost:5432` con la base `domux` (usuario/clave `domux`/`domux`).

Si prefieres levantar también el API en Docker:

```bash
docker compose up -d
```

(el servicio `api` fue agregado al `docker-compose.yml`; no se probó en este entorno por falta de Docker en el sandbox — verifícalo en tu máquina).

## 5. Prisma: cliente y migraciones

**Esto es lo primero que debes correr tú, con internet real:**

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

`prisma migrate dev` va a crear la carpeta `prisma/migrations/` (no incluida en el repo por la razón explicada arriba) y aplicar el schema a tu base de datos.

## 6. Seed (datos demo)

```bash
cd apps/api
npx prisma db seed
```

Esto crea:

- 1 SUPERADMIN
- 1 propiedad demo ("Torres del Bosque") con 1 ADMIN, 1 GATEKEEPER, 3 RESIDENT, 3 unidades
- Visitantes, paquetes, zonas comunes, una reserva y un comunicado de ejemplo

### Usuarios demo (contraseña para todos: `Domux123*`)

| Rol | Correo |
|---|---|
| SUPERADMIN | `superadmin@domux.app` |
| ADMIN | `admin@torresdelbosque.com` |
| GATEKEEPER | `porteria@torresdelbosque.com` |
| RESIDENT | `residente1@torresdelbosque.com` (unidad T1-101) |

## 7. Backend

```bash
cd apps/api
npm run dev
```

API en `http://localhost:4000`. Documentación interactiva en `http://localhost:4000/docs` (Swagger). Referencia completa de endpoints en `docs/api.md`.

Arquitectura de 5 capas: `routes/ → controllers/ → services/ → Prisma → PostgreSQL`, con `plugins/` para autenticación JWT y aislamiento de tenant. Ver `docs/architecture.md`.

## 8. Panel web

```bash
cd apps/web
npm run dev
```

En `http://localhost:3000`. La landing pública se mantiene intacta en `/`. El login real está en `/login` (solo SUPERADMIN/ADMIN — GATEKEEPER/RESIDENT usan la app móvil). Sesión con cookies httpOnly + Server Actions de Next.js; rutas protegidas por `middleware.ts`.

## 9. App Android

```bash
cd mobile
# Abrir en Android Studio, o:
./gradlew assembleDebug   # requiere generar el wrapper JAR (ver nota abajo)
```

**Nota sobre el wrapper de Gradle**: se incluyó `gradle/wrapper/gradle-wrapper.properties` apuntando a Gradle 8.7, pero no el `gradle-wrapper.jar` binario (no se pudo descargar en este sandbox). Al abrir el proyecto en Android Studio, este generará el wrapper automáticamente, o puedes correr `gradle wrapper` una vez tengas Gradle instalado localmente.

Por defecto la app apunta a `http://10.0.2.2:4000/` (el alias que usa el emulador de Android para `localhost` de tu máquina). Si usas un dispositivo físico, cambia `API_BASE_URL` en `mobile/app/build.gradle.kts` a la IP de tu máquina en la red local.

Arquitectura: `Compose UI → ViewModel → Repository → Retrofit → API`. Ver `docs/android-api-audit.md` para el detalle endpoint por endpoint que usa la app y su verificación contra el backend real.

## 10. Documentación adicional

- `docs/architecture.md` — capas del backend y jerarquía de tenants
- `docs/security.md` — medidas de seguridad implementadas
- `docs/api.md` — referencia completa de endpoints REST
- `docs/android-api-audit.md` — auditoría de integración Android↔Backend
- `docs/ux.md` — lineamientos de experiencia de usuario

## 11. Roles y alcance (resumen)

| Rol | Superficie | Puede |
|---|---|---|
| SUPERADMIN | Panel web | Crear/editar/activar propiedades; crear administradores y asignarlos |
| ADMIN | Panel web | Gestionar su propiedad: unidades, usuarios de portería/residentes, ver historial de visitantes/paquetes, gestionar zonas comunes, ver reservas, gestionar comunicados |
| GATEKEEPER | App Android | Ver visitantes autorizados/dentro, registro manual, entrada/salida, registrar y entregar paquetes, ver comunicados |
| RESIDENT | App Android | Autorizar/cancelar visitantes, ver sus paquetes, crear/cancelar reservas, ver comunicados |

Fuera de alcance en DOMUX 1.0 (por decisión explícita del equipo): pagos, PQRS, mantenimiento, chat, IA, notificaciones push, CRM, analítica avanzada.

## 12. Limitaciones reales conocidas

- Sin `prisma/migrations/` generadas — debes correrlas tú (paso 5).
- Backend nunca ejecutado end-to-end contra una base de datos real en este entorno.
- App Android nunca compilada; solo verificada estáticamente (paquetes/imports/firmas coinciden). Ábrela en Android Studio y resuelve cualquier ajuste de versión de dependencia que el propio IDE te sugiera (especialmente `ExposedDropdownMenuBox`/`menuAnchor()`, cuya firma cambió entre versiones de Material3 — revísalo si tu versión de Compose difiere de la fijada en `build.gradle.kts`).
- `docker-compose.yml` con el servicio `api` agregado pero no probado (no hay Docker en este sandbox).
- El middleware de rutas del panel web es una protección de UX (decodifica el rol del JWT sin verificar firma); la seguridad real vive en el backend, que sí verifica la firma y el rol en cada request.
