import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DOMUX — Seguridad y operación residencial inteligente',
  description: 'Plataforma SaaS multi-tenant para propiedad horizontal con control de accesos, trazabilidad y dashboards operativos.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
