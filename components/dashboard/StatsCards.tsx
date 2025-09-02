'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalMedications: number;
  lowStockItems: number;
  pendingOrders: number;
  todayUsage: number;
  totalDebt: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalMedications: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    todayUsage: 0,
    totalDebt: 0,
  });

  useEffect(() => {
    // TODO: Fetch stats from API
    // For now, using placeholder data
    setStats({
      totalMedications: 8,
      lowStockItems: 0,
      pendingOrders: 0,
      todayUsage: 0,
      totalDebt: 0,
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Total Medications
        </h3>
        <div className="text-4xl font-extrabold text-black">{stats.totalMedications}</div>
      </div>

      <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Low Stock Items
        </h3>
        <div className="text-4xl font-extrabold text-black">{stats.lowStockItems}</div>
      </div>

      <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Pending Orders
        </h3>
        <div className="text-4xl font-extrabold text-black">{stats.pendingOrders}</div>
      </div>

      <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Today's Usage
        </h3>
        <div className="text-4xl font-extrabold text-black">{stats.todayUsage}</div>
      </div>

      <div className="bg-blue-600 border-2 border-blue-600 p-6 rounded-xl hover:shadow-lg transition-all">
        <h3 className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-3">
          Total Debt
        </h3>
        <div className="text-4xl font-extrabold text-white">${stats.totalDebt}</div>
      </div>
    </div>
  );
}
