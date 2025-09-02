'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Medication {
  id: string;
  code: string;
  name: string;
  category: string;
  myceliumStock: number;
  angelStock: number;
  unitCost: number;
}

interface UsageRecord {
  id: string;
  date: string;
  time: string;
  medication: string;
  quantity: number;
  company: string;
  unitCost: number;
  totalCost: number;
  fulfillmentFee?: number;
  pharmacy: string;
}

export default function DailyUsageTab() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [selectedMedicationName, setSelectedMedicationName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('EONMeds');
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [loading, setLoading] = useState(false);
  
  const medicationDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const companies = [
    'EONMeds',
    'Mycelium',
    'Angel',
  ];

  useEffect(() => {
    fetchMedications();
    fetchUsageRecords();
  }, []);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (medicationDropdownRef.current && !medicationDropdownRef.current.contains(event.target as Node)) {
        setShowMedicationDropdown(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await fetch('/api/medications');
      if (response.ok) {
        const data = await response.json();
        setMedications(data);
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      // Fallback data
      setMedications([
        { id: '1', code: 'SEM25', name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 2.5mg', category: 'GLP-1 Agonist', myceliumStock: 0, angelStock: 0, unitCost: 30 },
        { id: '2', code: 'SEM5', name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 5mg', category: 'GLP-1 Agonist', myceliumStock: 0, angelStock: 0, unitCost: 40 },
        { id: '3', code: 'SEM10', name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 10mg', category: 'GLP-1 Agonist', myceliumStock: 0, angelStock: 0, unitCost: 70 },
        { id: '4', code: 'SEM125', name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 12.5mg', category: 'GLP-1 Agonist', myceliumStock: 0, angelStock: 0, unitCost: 90 },
        { id: '5', code: 'TIRZ10', name: 'TIRZEPATIDE/CYANOCOBALAMIN (10MG/1 MG/ML) - 10mg', category: 'GLP-1/GIP Agonist', myceliumStock: 0, angelStock: 0, unitCost: 60 },
        { id: '6', code: 'TIRZ20', name: 'TIRZEPATIDE/CYANOCOBALAMIN (10MG/2MG/ML) - 20mg', category: 'GLP-1/GIP Agonist', myceliumStock: 0, angelStock: 0, unitCost: 80 },
        { id: '7', code: 'TIRZ30', name: 'TIRZEPATIDE/CYANOCOBALAMIN (15MG/1 MG/ML) - 30mg', category: 'GLP-1/GIP Agonist', myceliumStock: 0, angelStock: 0, unitCost: 90 },
        { id: '8', code: 'TIRZ60', name: 'TIRZEPATIDE/CYANOCOBALAMIN (15MG/1 MG/ML) - 60mg', category: 'GLP-1/GIP Agonist', myceliumStock: 0, angelStock: 0, unitCost: 130 },
      ]);
    }
  };

  const fetchUsageRecords = async () => {
    try {
      const response = await fetch('/api/usage-records');
      if (response.ok) {
        const data = await response.json();
        setUsageRecords(data);
      }
    } catch (error) {
      console.error('Error fetching usage records:', error);
    }
  };

  const handleRecordUsage = async () => {
    if (!selectedMedication || !quantity || !selectedCompany) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const medication = medications.find(m => m.id === selectedMedication);
      if (!medication) return;

      // Determine which pharmacy has stock
      const pharmacy = medication.myceliumStock > 0 ? 'Mycelium Pharmacy' : 'Angel Pharmacy';

      const response = await fetch('/api/usage-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationId: selectedMedication,
          quantity: parseInt(quantity),
          company: selectedCompany,
          date: selectedDate,
          pharmacy,
        }),
      });

      if (response.ok) {
        // Reset form
        setQuantity('');
        setSelectedMedication('');
        setSelectedMedicationName('');
        
        // Refresh data
        await fetchMedications();
        await fetchUsageRecords();
      }
    } catch (error) {
      console.error('Error recording usage:', error);
      alert('Error recording usage');
    } finally {
      setLoading(false);
    }
  };

  const getTotalStock = (med: Medication) => med.myceliumStock + med.angelStock;

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Daily Usage Tracking</h2>
        <p className="text-gray-600">Record and track daily medication usage across pharmacies.</p>
      </div>

      {/* Quick Usage Entry Form */}
      <div className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Usage Entry</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Date Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Medication Dropdown */}
          <div className="relative md:col-span-4" ref={medicationDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
            <button
              onClick={() => setShowMedicationDropdown(!showMedicationDropdown)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-left flex justify-between items-center"
            >
              <span className="text-sm pr-2">
                {selectedMedicationName || 'Select Medication'}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
            
            {showMedicationDropdown && (
              <div className="absolute z-50 w-full min-w-[400px] mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {medications.map((med) => {
                  const totalStock = getTotalStock(med);
                  const stockClass = totalStock === 0 ? 'text-red-600' : 'text-gray-600';
                  
                  return (
                    <button
                      key={med.id}
                      onClick={() => {
                        setSelectedMedication(med.id);
                        setSelectedMedicationName(med.name);
                        setShowMedicationDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                        selectedMedication === med.id ? 'bg-orange-100' : ''
                      }`}
                      disabled={totalStock === 0}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-sm flex-1">{med.name}</span>
                        <span className={`text-sm font-medium whitespace-nowrap ${stockClass}`}>
                          (Stock: {totalStock})
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quantity Field */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Qty</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Company Dropdown */}
          <div className="relative md:col-span-3" ref={companyDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <button
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-left flex justify-between items-center"
            >
              <span>{selectedCompany}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
            
            {showCompanyDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {companies.map((company) => (
                  <button
                    key={company}
                    onClick={() => {
                      setSelectedCompany(company);
                      setShowCompanyDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedCompany === company ? 'bg-blue-100' : ''
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Record Usage Button */}
          <button
            onClick={handleRecordUsage}
            disabled={loading || !selectedMedication || !quantity}
            className="md:col-span-2 px-6 py-2 bg-[#0e88e9] text-white rounded-lg hover:bg-[#0c70c0] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Recording...' : 'Record Usage'}
          </button>
        </div>
      </div>

      {/* Usage Records Table */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#efece7] border-b-2 border-[#e5e5e5]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fulfillment Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Pharmacy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usageRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No usage records yet. Record your first medication usage above.
                  </td>
                </tr>
              ) : (
                usageRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.time}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.medication}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${record.unitCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${record.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.company === 'EONMeds' ? (
                        <span className="text-green-600 font-semibold">
                          +${(record.fulfillmentFee || 0).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.pharmacy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}