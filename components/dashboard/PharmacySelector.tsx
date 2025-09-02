'use client';

import { usePharmacy } from '@/contexts/PharmacyContext';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function PharmacySelector() {
  const { selectedPharmacy, setSelectedPharmacy } = usePharmacy();
  const { data: session } = useSession();

  const handlePharmacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPharmacy(e.target.value);
    // Store in localStorage for persistence
    localStorage.setItem('selectedPharmacy', e.target.value);
  };

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('selectedPharmacy');
    if (stored && session?.user?.pharmacyAccess) {
      // Validate that stored value is still valid for this user
      if (stored === 'both' && session.user.pharmacyAccess.length === 2) {
        setSelectedPharmacy('both');
      } else if (session.user.pharmacyAccess.includes(stored)) {
        setSelectedPharmacy(stored);
      }
    }
  }, [session, setSelectedPharmacy]);

  // If user only has access to one pharmacy, don't show dropdown
  if (session?.user?.pharmacyAccess?.length === 1) {
    const pharmacyName = session.user.pharmacyAccess[0] === 'PHARM01' 
      ? 'Mycelium Pharmacy' 
      : 'Angel Pharmacy';
    
    return (
      <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
        <span className="text-sm font-medium">Viewing:</span>
        <span className="text-sm font-semibold">{pharmacyName}</span>
      </div>
    );
  }

  // Only show dropdown for users with access to multiple pharmacies (super admins)
  return (
    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
      <label className="text-sm font-medium">Viewing:</label>
      <select 
        id="pharmacySelector" 
        className="bg-white text-black border-none px-3 py-1 rounded-md text-sm font-semibold cursor-pointer"
        value={selectedPharmacy}
        onChange={handlePharmacyChange}
      >
        {session?.user?.pharmacyAccess?.includes('PHARM01') && (
          <option value="PHARM01">Mycelium Pharmacy</option>
        )}
        {session?.user?.pharmacyAccess?.includes('PHARM02') && (
          <option value="PHARM02">Angel Pharmacy</option>
        )}
        {session?.user?.pharmacyAccess?.length === 2 && (
          <option value="both">Both Pharmacies</option>
        )}
      </select>
    </div>
  );
}
