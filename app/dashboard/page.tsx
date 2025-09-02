'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCards from '@/components/dashboard/StatsCards';
import InventoryTab from '@/components/dashboard/InventoryTab';
import DailyUsageTab from '@/components/dashboard/DailyUsageTab';
import DebtReportTab from '@/components/dashboard/DebtReportTab';
import OrdersTab from '@/components/dashboard/OrdersTab';
import SuppliersTab from '@/components/dashboard/SuppliersTab';
import LicensingTab from '@/components/dashboard/LicensingTab';
import ReportsTab from '@/components/dashboard/ReportsTab';
import UserManagementTab from '@/components/dashboard/UserManagementTab';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('inventory');
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-8' : 'grid-cols-7'} bg-[#efece7]`}>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="daily-usage">Daily Usage</TabsTrigger>
          <TabsTrigger value="debt-report">Pharmacy Debt</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Pharmacies</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
        </TabsList>

        <TabsContent value="inventory" className="mt-6">
          <InventoryTab />
        </TabsContent>

        <TabsContent value="daily-usage" className="mt-6">
          <DailyUsageTab />
        </TabsContent>

        <TabsContent value="debt-report" className="mt-6">
          <DebtReportTab />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="suppliers" className="mt-6">
          <SuppliersTab />
        </TabsContent>

        <TabsContent value="licensing" className="mt-6">
          <LicensingTab />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportsTab />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="mt-6">
            <UserManagementTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
