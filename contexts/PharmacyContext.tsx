'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface PharmacyContextType {
  selectedPharmacy: string;
  setSelectedPharmacy: (pharmacy: string) => void;
  availablePharmacies: string[];
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export function PharmacyProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('both');
  const [availablePharmacies, setAvailablePharmacies] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.pharmacyAccess) {
      const access = session.user.pharmacyAccess;
      setAvailablePharmacies(access);
      
      // Set default selection based on user access
      if (access.length === 1) {
        setSelectedPharmacy(access[0]);
      } else if (access.length === 2) {
        setSelectedPharmacy('both');
      }
    }
  }, [session]);

  return (
    <PharmacyContext.Provider
      value={{
        selectedPharmacy,
        setSelectedPharmacy,
        availablePharmacies,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const context = useContext(PharmacyContext);
  if (context === undefined) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
}
