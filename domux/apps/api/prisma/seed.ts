import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role, VisitorType } from '@prisma/client';

const prisma = new PrismaClient();
const DEMO_PASSWORD = 'Domux123*';

async function upsertUser(data: {
  name: string;
  email: string;
  role: Role;
  tenantId?: string | null;
  unitId?: string | null;
}) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email: data.email },
    update: { name: data.name, role: data.role, tenantId: data.tenantId ?? null, unitId: data.unitId ?? null },
    create: { ...data, passwordHash }
  });
}

async function main() {
  // --- SUPERADMIN (sin tenant, gestiona la plataforma) ---
  await upsertUser({
    name: 'DOMUX Superadmin',
    email: 'superadmin@domux.app',
    role: Role.SUPERADMIN
  });

  // --- Tenant demo: Torres del Bosque ---
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'torres-del-bosque' },
    update: {},
    create: { name: 'Torres del Bosque', slug: 'torres-del-bosque' }
  });

  const admin = await upsertUser({
    name: 'Carlos Pérez',
    email: 'admin@torresdelbosque.com',
    role: Role.ADMIN,
    tenantId: tenant.id
  });

  const gatekeeper = await upsertUser({
    name: 'Andrea Portería',
    email: 'porteria@torresdelbosque.com',
    role: Role.GATEKEEPER,
    tenantId: tenant.id
  });

  // --- Unidades ---
  const unitCodes = ['T1-101', 'T1-102', 'T2-201'];
  const units = [];
  for (const code of unitCodes) {
    const unit = await prisma.unit.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code } },
      update: {},
      create: { tenantId: tenant.id, code }
    });
    units.push(unit);
  }

  // --- Residentes, uno por unidad ---
  const residentSeeds = [
    { name: 'Sara Gómez', email: 'residente1@torresdelbosque.com', unit: units[0] },
    { name: 'Julián Ramírez', email: 'residente2@torresdelbosque.com', unit: units[1] },
    { name: 'Valentina Ríos', email: 'residente3@torresdelbosque.com', unit: units[2] }
  ];
  const residents = [];
  for (const r of residentSeeds) {
    const resident = await upsertUser({
      name: r.name,
      email: r.email,
      role: Role.RESIDENT,
      tenantId: tenant.id,
      unitId: r.unit.id
    });
    residents.push(resident);
  }
  const [resident1, resident2] = residents;

  // --- Visitantes ---
  await prisma.visitor.createMany({
    data: [
      {
        tenantId: tenant.id,
        unitId: units[0].id,
        fullName: 'Andrés Mateus',
        documentId: '1029384756',
        type: VisitorType.VISITOR,
        status: 'AUTHORIZED',
        authorizedById: resident1.id
      },
      {
        tenantId: tenant.id,
        unitId: units[1].id,
        fullName: 'Paula Gómez',
        documentId: '1133557799',
        type: VisitorType.DELIVERY,
        status: 'ENTERED',
        authorizedById: resident2.id,
        registeredById: gatekeeper.id,
        entryAt: new Date()
      }
    ],
    skipDuplicates: true
  });

  // --- Paquetes ---
  await prisma.package.createMany({
    data: [
      {
        tenantId: tenant.id,
        unitId: units[0].id,
        recipient: 'Sara Gómez',
        status: 'PENDING',
        registeredById: gatekeeper.id
      },
      {
        tenantId: tenant.id,
        unitId: units[1].id,
        recipient: 'Julián Ramírez',
        status: 'DELIVERED',
        registeredById: gatekeeper.id,
        deliveredById: gatekeeper.id,
        deliveredAt: new Date()
      }
    ],
    skipDuplicates: true
  });

  // --- Zonas comunes ---
  const salon = await prisma.commonArea.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Salón social' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Salón social',
      description: 'Espacio para eventos y reuniones',
      openTime: '08:00',
      closeTime: '20:00'
    }
  });

  await prisma.commonArea.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Cancha múltiple' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Cancha múltiple',
      description: 'Fútbol, baloncesto y voleibol',
      openTime: '06:00',
      closeTime: '22:00'
    }
  });

  // --- Reserva de ejemplo ---
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const reservationDate = new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate()));

  await prisma.reservation.upsert({
    where: { id: 'seed-reservation-1' },
    update: {},
    create: {
      id: 'seed-reservation-1',
      tenantId: tenant.id,
      commonAreaId: salon.id,
      residentId: resident1.id,
      date: reservationDate,
      startTime: '14:00',
      endTime: '16:00'
    }
  });

  // --- Comunicado ---
  await prisma.notice.upsert({
    where: { id: 'seed-notice-1' },
    update: {},
    create: {
      id: 'seed-notice-1',
      tenantId: tenant.id,
      title: 'Mantenimiento preventivo',
      body: 'El jueves a las 8:00 a. m. se realizará mantenimiento del sistema hidráulico.',
      createdById: admin.id
    }
  });

  console.log('Seed completado. Usuarios demo (contraseña para todos: Domux123*):');
  console.log('- SUPERADMIN: superadmin@domux.app');
  console.log('- ADMIN:      admin@torresdelbosque.com');
  console.log('- GATEKEEPER: porteria@torresdelbosque.com');
  console.log('- RESIDENT:   residente1@torresdelbosque.com (unidad T1-101)');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
