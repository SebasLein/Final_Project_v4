import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change_me_access',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change_me_refresh',
  accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
  refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  webUrl: process.env.WEB_URL ?? 'http://localhost:3000'
};
