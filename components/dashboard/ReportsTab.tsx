'use client';

import { FileText, TrendingUp, AlertTriangle, DollarSign, Package, RefreshCw } from 'lucide-react';

export default function ReportsTab() {
  const reportTypes = [
    {
      icon: FileText,
      title: 'Inventory Report',
      description: 'Complete inventory status across all pharmacies',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      title: 'Usage Analysis',
      description: 'Medication usage patterns and trends',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: DollarSign,
      title: 'Debt Summary',
      description: 'Outstanding debts by company and period',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: AlertTriangle,
      title: 'Expiry Report',
      description: 'Medications approaching expiration dates',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: RefreshCw,
      title: 'Reorder Report',
      description: 'Items below reorder threshold',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Package,
      title: 'Financial Report',
      description: 'Revenue, costs, and profit analysis',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Generate Reports Section */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.title}
                className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div className={`${report.bgColor} ${report.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Usage Report Section */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Weekly Usage Report</h2>
        <p className="text-gray-600 mb-6">Generate detailed usage reports by date range and company.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Filter</label>
          <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
            <option value="">All Companies</option>
            <option value="Eon Health">Eon Health</option>
            <option value="WellCare">WellCare</option>
            <option value="HealthFirst">HealthFirst</option>
          </select>
        </div>

        <button className="px-6 py-2 bg-[#0e88e9] text-white rounded-lg hover:bg-[#0c70c0] font-medium">
          Generate Report
        </button>
      </div>

      {/* Recent Reports */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">Weekly Usage Report</h4>
                <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <button className="text-[#0e88e9] hover:text-[#0c70c0] text-sm font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}