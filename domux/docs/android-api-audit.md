# Auditoría de integración Android ↔ Backend (previa a implementación)

Verificado leyendo directamente `apps/api/src/routes/*.ts`, `controllers/*` y `services/*` — no se asume nada, no se inventa ningún endpoint.

## RESIDENT

| Función app | Método/ruta | Existe | Rol/tenant verificado en backend | Body / query | Response usado |
|---|---|---|---|---|---|
| Login | `POST /auth/login` | ✅ | público | `{email,password}` | `{accessToken,refreshToken,user}` |
| Refresh | `POST /auth/refresh` | ✅ | público (valida hash del refresh) | `{refreshToken}` | `{accessToken}` |
| Inicio (resumen) | compone `GET /visitors`, `GET /packages`, `GET /reservations`, `GET /notices` | ✅ (sin endpoint nuevo) | cada uno ya filtra por RESIDENT+tenant | — | ver abajo |
| Ver mis visitantes | `GET /visitors` | ✅ | rama `RESIDENT`: filtra `authorizedById = actor.sub` | query `status?` | `VisitorDto[]` sin `unit`/`authorizedBy` incluidos |
| Autorizar visitante | `POST /visitors/authorize` | ✅ | `authorize('RESIDENT')` + usa `resident.unitId` | `{fullName,documentId,type}` | `VisitorDto` (201) |
| Cancelar visitante | `PATCH /visitors/:id/cancel` | ✅ | valida `authorizedById === actor.sub` y `status===AUTHORIZED` | — | `VisitorDto` |
| Ver mis paquetes | `GET /packages` | ✅ | rama `RESIDENT`: filtra por `resident.unitId` | query `status?` | `PackageDto[]` sin `unit` incluido |
| Ver zonas comunes | `GET /common-areas` | ✅ | `authorize('ADMIN','RESIDENT')`; RESIDENT solo ve `active=true` | — | `CommonAreaDto[]` |
| Ver mis reservas | `GET /reservations` | ✅ | rama `RESIDENT`: filtra `residentId = actor.sub` | query `commonAreaId?,date?` | `ReservationDto[]` con `commonArea` incluido |
| Crear reserva | `POST /reservations` | ✅ | valida zona activa, horario dentro de apertura/cierre, sin solapes | `{commonAreaId,date,startTime,endTime}` | `ReservationDto` (201/409) |
| Cancelar reserva | `PATCH /reservations/:id/cancel` | ✅ | valida `residentId === actor.sub` | — | `ReservationDto` |
| Comunicados | `GET /notices` | ✅ | RESIDENT solo ve `active=true` | — | `NoticeDto[]` |
| Perfil / logout | no requiere endpoint (borra sesión local) | — | — | — | — |

## GATEKEEPER

| Función app | Método/ruta | Existe | Rol/tenant verificado | Body / query | Response usado |
|---|---|---|---|---|---|
| Login / Refresh | igual que arriba | ✅ | — | — | — |
| Inicio (resumen operativo) | compone `GET /visitors` + `GET /packages` | ✅ | — | — | — |
| Visitantes autorizados/entrados | `GET /visitors` | ✅ | rama `GATEKEEPER`: `status ∈ {AUTHORIZED,ENTERED}` por defecto | query `status?,unitCode?` | `VisitorDto[]` con `unit` incluido |
| Registro manual | `POST /visitors/manual` | ✅ | crea con `status=ENTERED`, `entryAt=now` | `{fullName,documentId,type,unitCode}` | `VisitorDto` (201) |
| Registrar entrada | `PATCH /visitors/:id/entry` | ✅ | exige `status===AUTHORIZED` → `ENTERED` | — | `VisitorDto` |
| Registrar salida | `PATCH /visitors/:id/exit` | ✅ | exige `status===ENTERED` → `EXITED` | — | `VisitorDto` |
| Paquetes pendientes | `GET /packages` | ✅ | GATEKEEPER ve todos, filtrable por `status` | query `status?` | `PackageDto[]` con `unit` incluido |
| Registrar paquete | `POST /packages` | ✅ | crea con `status=PENDING` | `{unitCode,recipient}` | `PackageDto` (201) |
| Marcar entregado | `PATCH /packages/:id/deliver` | ✅ | exige `status===PENDING` | — | `PackageDto` |
| Comunicados | `GET /notices` | ✅ | GATEKEEPER solo ve `active=true` | — | `NoticeDto[]` |
| Perfil / logout | local | — | — | — | — |

## Decisión de diseño (no un endpoint faltante)

Tanto `POST /visitors/manual` como `POST /packages` piden `unitCode` como **texto libre**, no como selección de una lista. No existe (ni voy a crear) un endpoint `GET /units` accesible para GATEKEEPER — `/units` es exclusivo de ADMIN por diseño (gestión administrativa de la propiedad). Esto es intencional y refleja el flujo real de un portero: conoce los códigos de las unidades de memoria o los recibe verbalmente del residente/repartidor; no necesita "navegar" un listado. Si el código no existe, el backend responde `404 Unidad no encontrada` y la app simplemente muestra ese mensaje para que el portero lo corrija. No se agregó ningún endpoint nuevo para esto — evita expandir el alcance.

## Resultado

**Ningún endpoint nuevo fue necesario.** Los 15 endpoints que usa Android ya existían, con el rol y el aislamiento de tenant correctos. La app se construye estrictamente sobre lo que el backend ya expone.
