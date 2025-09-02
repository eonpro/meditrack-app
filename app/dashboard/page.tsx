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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-100">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="daily-usage">Daily Usage</TabsTrigger>
          <TabsTrigger value="debt-report">Supplier Debt</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
