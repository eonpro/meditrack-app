'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar, Edit, Trash2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePharmacy } from '@/contexts/PharmacyContext';

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
  medicationId: string;
  quantity: number;
  company: string;
  unitCost: number;
  totalCost: number;
  fulfillmentFee?: number;
  pharmacy: string;
}

export default function DailyUsageTab() {
  const { data: session } = useSession();
  const { selectedPharmacy } = usePharmacy();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [selectedMedicationName, setSelectedMedicationName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('EONMeds');
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [usagePharmacy, setUsagePharmacy] = useState(''); // Which pharmacy to deduct from
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UsageRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editMedication, setEditMedication] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editPharmacy, setEditPharmacy] = useState('');
  const [showEditMedicationDropdown, setShowEditMedicationDropdown] = useState(false);
  const [showEditCompanyDropdown, setShowEditCompanyDropdown] = useState(false);
  
  const medicationDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const editMedicationDropdownRef = useRef<HTMLDivElement>(null);
  const editCompanyDropdownRef = useRef<HTMLDivElement>(null);

  const companies = [
    'EONMeds',
    'Mycelium',
    'Angel',
  ];

  useEffect(() => {
    fetchMedications();
    fetchUsageRecords();
    // Set default usage pharmacy based on selected view
    if (selectedPharmacy === 'PHARM01') {
      setUsagePharmacy('Mycelium Pharmacy');
    } else if (selectedPharmacy === 'PHARM02') {
      setUsagePharmacy('Angel Pharmacy');
    } else {
      setUsagePharmacy(''); // User must select when viewing both
    }
  }, [selectedPharmacy]); // Re-fetch when selected pharmacy changes

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (medicationDropdownRef.current && !medicationDropdownRef.current.contains(event.target as Node)) {
        setShowMedicationDropdown(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
      if (editMedicationDropdownRef.current && !editMedicationDropdownRef.current.contains(event.target as Node)) {
        setShowEditMedicationDropdown(false);
      }
      if (editCompanyDropdownRef.current && !editCompanyDropdownRef.current.contains(event.target as Node)) {
        setShowEditCompanyDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await fetch(`/api/medications?pharmacy=${selectedPharmacy}`);
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
      const response = await fetch(`/api/usage-records?pharmacy=${selectedPharmacy}`);
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

    // If viewing both pharmacies, user must select which pharmacy to use
    if (selectedPharmacy === 'both' && !usagePharmacy) {
      alert('Please select which pharmacy to use');
      return;
    }

    setLoading(true);
    try {
      const medication = medications.find(m => m.id === selectedMedication);
      if (!medication) return;

      // Use the selected pharmacy
      const pharmacy = usagePharmacy;
      
      // Check if the selected pharmacy has stock
      const hasStock = (pharmacy === 'Mycelium Pharmacy' && medication.myceliumStock >= parseInt(quantity)) ||
                       (pharmacy === 'Angel Pharmacy' && medication.angelStock >= parseInt(quantity));
      
      if (!hasStock) {
        alert(`Insufficient stock in ${pharmacy}`);
        setLoading(false);
        return;
      }

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
        // Only reset pharmacy selection if viewing both
        if (selectedPharmacy === 'both') {
          setUsagePharmacy('');
        }
        
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

  const handleEditClick = (record: UsageRecord) => {
    setEditingRecord(record);
    setEditDate(record.date);
    setEditMedication(record.medicationId);
    setEditQuantity(record.quantity.toString());
    setEditCompany(record.company);
    setEditPharmacy(record.pharmacy);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingRecord) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/usage-records/${editingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationId: editMedication,
          quantity: parseInt(editQuantity),
          company: editCompany,
          date: editDate,
          pharmacy: editPharmacy,
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingRecord(null);
        await fetchMedications();
        await fetchUsageRecords();
      } else {
        const error = await response.json();
        alert(error.error || 'Error updating usage record');
      }
    } catch (error) {
      console.error('Error updating usage:', error);
      alert('Error updating usage record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this usage record? The inventory will be restored.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/usage-records/${recordId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMedications();
        await fetchUsageRecords();
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting usage record');
      }
    } catch (error) {
      console.error('Error deleting usage:', error);
      alert('Error deleting usage record');
    } finally {
      setLoading(false);
    }
  };

  const canEditDelete = session?.user?.role === 'ADMIN' || session?.user?.role === 'PHARMACY_MANAGER';

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
                          {selectedPharmacy === 'both' 
                            ? `(M: ${med.myceliumStock} | A: ${med.angelStock})`
                            : `(Stock: ${totalStock})`
                          }
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

          {/* Pharmacy Selector (only when viewing both) */}
          {selectedPharmacy === 'both' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Use From</label>
              <select
                value={usagePharmacy}
                onChange={(e) => setUsagePharmacy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Pharmacy</option>
                <option value="Mycelium Pharmacy">Mycelium Pharmacy</option>
                <option value="Angel Pharmacy">Angel Pharmacy</option>
              </select>
            </div>
          )}

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
                {canEditDelete && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usageRecords.length === 0 ? (
                <tr>
                  <td colSpan={canEditDelete ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
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
                    {canEditDelete && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(record)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Usage Record</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRecord(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Medication */}
              <div className="relative" ref={editMedicationDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
                <button
                  onClick={() => setShowEditMedicationDropdown(!showEditMedicationDropdown)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-left flex justify-between items-center"
                >
                  <span className="text-sm pr-2">
                    {medications.find(m => m.id === editMedication)?.name || 'Select Medication'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
                
                {showEditMedicationDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {medications.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => {
                          setEditMedication(med.id);
                          setShowEditMedicationDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                          editMedication === med.id ? 'bg-orange-100' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-sm flex-1">{med.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Company */}
              <div className="relative" ref={editCompanyDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <button
                  onClick={() => setShowEditCompanyDropdown(!showEditCompanyDropdown)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-left flex justify-between items-center"
                >
                  <span>{editCompany}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {showEditCompanyDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {companies.map((company) => (
                      <button
                        key={company}
                        onClick={() => {
                          setEditCompany(company);
                          setShowEditCompanyDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                          editCompany === company ? 'bg-blue-100' : ''
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pharmacy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy</label>
                <select
                  value={editPharmacy}
                  onChange={(e) => setEditPharmacy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="Mycelium Pharmacy">Mycelium Pharmacy</option>
                  <option value="Angel Pharmacy">Angel Pharmacy</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRecord(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={loading || !editMedication || !editQuantity}
                className="px-4 py-2 bg-[#0e88e9] text-white rounded-lg hover:bg-[#0c70c0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}