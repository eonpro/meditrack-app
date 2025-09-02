'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
