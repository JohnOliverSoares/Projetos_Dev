import type { Metadata } from 'next';
import './globals.css';
import { AppToaster } from '@/components/ui/sonner';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

export const metadata: Metadata = {
  title: 'Entregas PWA',
  description: 'Controle de entregas para vendedores e entregadores',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerRegister />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
