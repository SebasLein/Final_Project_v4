import fp from 'fastify-plugin';

/**
 * requireTenant: debe usarse DESPUÉS de authenticate.
 * Garantiza que el usuario autenticado tenga un tenantId asociado,
 * salvo que sea SUPERADMIN (que opera a nivel global).
 * Esto NO reemplaza el filtrado por tenantId en cada service: cada
 * consulta a Prisma debe seguir usando authUser.tenantId explícitamente.
 */
export default fp(async (app) => {
  app.decorate('requireTenant', async (request: any, reply: any) => {
    const authUser = request.authUser;
    if (!authUser) {
      return reply.code(401).send({ message: 'No autorizado' });
    }
    if (authUser.role !== 'SUPERADMIN' && !authUser.tenantId) {
      return reply.code(403).send({ message: 'El usuario no tiene una propiedad asociada' });
    }
  });
});
