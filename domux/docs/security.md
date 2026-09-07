# Seguridad DOMUX

## Implementado
- JWT access tokens de corta duración.
- Refresh tokens rotables, almacenados como **hash bcrypt** (nunca en texto plano) en `User.refreshTokenHash`.
- RBAC por rol (`SUPERADMIN`, `ADMIN`, `GATEKEEPER`, `RESIDENT`) validado en cada endpoint vía el decorator `authorize(...roles)`.
- Aislamiento de tenant: cada consulta de negocio filtra explícitamente por `tenantId` derivado del JWT del usuario autenticado (nunca del request body/query), reforzado por el decorator `requireTenant`.
- Helmet.
- CORS restringido por `WEB_URL`.
- Rate limiting global.
- Validación Zod en cada controller.
- Password hashing con bcrypt.
- Auditoría básica de acciones críticas (login, altas de usuarios/propiedades, cambios de estado de visitantes/paquetes/reservas/comunicados).
- Manejador de errores centralizado: nunca se exponen stack traces ni detalles internos al cliente.
- Variables de entorno fuera del repositorio.

## Recomendado para producción
- Rotación de secretos.
- Revocación persistente de refresh tokens.
- 2FA para perfiles administrativos.
- WAF/CDN.
- CSP estricta y nonce dinámico.
- SIEM centralizado y alertamiento.
