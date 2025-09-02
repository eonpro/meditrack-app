'use client';

import { SessionProvider } from 'next-auth/react';
import { PharmacyProvider } from '@/contexts/PharmacyContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PharmacyProvider>{children}</PharmacyProvider>
    </SessionProvider>
  );
}
