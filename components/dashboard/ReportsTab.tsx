'use client';

import { useState, useEffect } from 'react';
import { FileText, TrendingUp, AlertTriangle, DollarSign, Package, RefreshCw, Calculator } from 'lucide-react';
import { usePharmacy } from '@/contexts/PharmacyContext';

interface PharmacyBalance {
  pharmacy: string;
  medicationCosts: number;
  eonMedsUsage: number;
  fulfillmentFees: number;
  netBalance: number;
}

export default function ReportsTab() {
  const { selectedPharmacy } = usePharmacy();
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [pharmacyBalances, setPharmacyBalances] = useState<PharmacyBalance[]>([]);
  const [loading, setLoading] = useState(false);

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
      icon: Calculator,
      title: 'Pharmacy Balance',
      description: 'Net balance with fulfillment fees',
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

  const calculatePharmacyBalances = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usage-records?pharmacy=${selectedPharmacy}`);
      const records = await response.json();
      
      // Filter by date range
      const filteredRecords = records.filter((record: any) => {
        const recordDate = new Date(record.date);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });

      // Calculate balances for each pharmacy
      const balancesByPharmacy: { [key: string]: PharmacyBalance } = {};

      filteredRecords.forEach((record: any) => {
        if (!balancesByPharmacy[record.pharmacy]) {
          balancesByPharmacy[record.pharmacy] = {
            pharmacy: record.pharmacy,
            medicationCosts: 0,
            eonMedsUsage: 0,
            fulfillmentFees: 0,
            netBalance: 0,
          };
        }

        const balance = balancesByPharmacy[record.pharmacy];
        
        // Add medication costs
        balance.medicationCosts += record.totalCost;

        // If EONMeds used the medication, track fulfillment fees
        if (record.company === 'EONMeds') {
          balance.eonMedsUsage += record.quantity;
          balance.fulfillmentFees += record.fulfillmentFee || 0;
        }
      });

      // Calculate net balance for each pharmacy
      Object.values(balancesByPharmacy).forEach(balance => {
        balance.netBalance = balance.medicationCosts - balance.fulfillmentFees;
      });

      setPharmacyBalances(Object.values(balancesByPharmacy));
    } catch (error) {
      console.error('Error calculating balances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePharmacyBalances();
  }, [startDate, endDate, selectedPharmacy]); // Re-calculate when selected pharmacy changes

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

      {/* Pharmacy Balance Report with Fulfillment Fees */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Pharmacy Balance Report</h2>
        <p className="text-gray-600 mb-6">View pharmacy balances with EONMeds fulfillment fee deductions.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Pharmacy Balance Cards */}
        <div className="space-y-4">
          {pharmacyBalances.map((balance) => (
            <div key={balance.pharmacy} className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">{balance.pharmacy}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                  <span className="text-gray-700">Total Medication Costs:</span>
                  <span className="font-semibold text-gray-900">${balance.medicationCosts.toFixed(2)}</span>
                </div>
                
                {balance.eonMedsUsage > 0 && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span className="text-gray-700">EONMeds Usage (items):</span>
                      <span className="font-semibold text-gray-900">{balance.eonMedsUsage}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-300">
                      <span className="text-gray-700">Fulfillment Fees ({balance.eonMedsUsage} × $15):</span>
                      <span className="font-semibold text-red-600">-${balance.fulfillmentFees.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center py-2 bg-white rounded-lg px-3">
                  <span className="font-bold text-gray-900">Net Balance Due:</span>
                  <span className="font-bold text-xl text-blue-600">${balance.netBalance.toFixed(2)}</span>
                </div>
              </div>

              {balance.fulfillmentFees > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> EONMeds fulfillment fees have been deducted from the total balance. 
                    The pharmacy earned ${balance.fulfillmentFees.toFixed(2)} for fulfilling {balance.eonMedsUsage} EONMeds orders.
                  </p>
                </div>
              )}
            </div>
          ))}

          {pharmacyBalances.length === 0 && !loading && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No usage records found for the selected date range.</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Usage Report Section */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Detailed Usage Report</h2>
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
            <option value="EONMeds">EONMeds</option>
            <option value="Mycelium">Mycelium</option>
            <option value="Angel">Angel</option>
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