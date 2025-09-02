'use client';

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';

interface Medication {
  id: string;
  code: string;
  name: string;
  category: string;
  myceliumStock: number;
  angelStock: number;
  reorderLevel: number;
  unitCost: number;
  primaryPharmacy: string;
}

export default function InventoryTab() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      // TODO: Replace with actual API call
      setMedications([
        {
          id: '1',
          code: 'SEM25',
          name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 2.5mg',
          category: 'GLP-1 Agonist',
          myceliumStock: 50,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 30.0,
          primaryPharmacy: 'Mycelium Pharmacy',
        },
        {
          id: '2',
          code: 'SEM5',
          name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 5mg',
          category: 'GLP-1 Agonist',
          myceliumStock: 50,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 40.0,
          primaryPharmacy: 'Mycelium Pharmacy',
        },
        {
          id: '3',
          code: 'TIRZ10',
          name: 'TIRZEPATIDE/CYANOCOBALAMIN (10MG/1 MG/ML) - 10mg',
          category: 'GLP-1/GIP Agonist',
          myceliumStock: 0,
          angelStock: 50,
          reorderLevel: 15,
          unitCost: 60.0,
          primaryPharmacy: 'Angel Pharmacy',
        },
      ]);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-700' };
    if (stock <= reorderLevel) return { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-700' };
    return { label: 'In Stock', className: 'bg-green-100 text-green-700' };
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          med.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search medications..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="GLP-1 Agonist">GLP-1 Agonist (Semaglutide)</option>
          <option value="GLP-1/GIP Agonist">GLP-1/GIP Agonist (Tirzepatide)</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Stock
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mycelium Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Angel Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedications.map((med) => {
                const totalStock = med.myceliumStock + med.angelStock;
                const status = getStockStatus(totalStock, med.reorderLevel);
                
                return (
                  <tr key={med.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">{med.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{med.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600">{med.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{med.myceliumStock}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{med.angelStock}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">{totalStock}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600">{med.reorderLevel}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">${med.unitCost.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {totalStock <= med.reorderLevel && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Reorder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
