'use client';

import { FileText, BarChart3, CreditCard, AlertTriangle, RefreshCw, DollarSign } from 'lucide-react';

export default function ReportsTab() {
  const reportTypes = [
    { id: 'inventory', label: 'Inventory Report', icon: FileText },
    { id: 'usage', label: 'Usage Analysis', icon: BarChart3 },
    { id: 'debt', label: 'Debt Summary', icon: CreditCard },
    { id: 'expiry', label: 'Expiry Report', icon: AlertTriangle },
    { id: 'reorder', label: 'Reorder Report', icon: RefreshCw },
    { id: 'financial', label: 'Financial Report', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Generate Reports</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3"
              >
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">{report.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Weekly Usage Report</h3>
        <p className="text-gray-600">Generate detailed usage reports by date range and company.</p>
        {/* TODO: Implement report generation */}
      </div>
    </div>
  );
}
