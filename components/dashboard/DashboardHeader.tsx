'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import PharmacySelector from './PharmacySelector';
import LogoutButton from './LogoutButton';

export default function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <img 
              src="https://static.wixstatic.com/media/c49a9b_ea9e6b716ac844ddbe9bce2485ba6198~mv2.png" 
              alt="Logo" 
              className="h-14 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <PharmacySelector />
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-sm">User: {session?.user?.name || session?.user?.email}</span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">{session?.user?.role}</span>
            </div>
            <div className="text-sm">
              Last Sync: <span className="text-blue-400">Just now</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
