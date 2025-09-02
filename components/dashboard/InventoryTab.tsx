'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, X, Edit2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState('Mycelium Pharmacy');
  const [quantity, setQuantity] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [editMyceliumStock, setEditMyceliumStock] = useState('');
  const [editAngelStock, setEditAngelStock] = useState('');
  
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    fetchMedications();
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
      // Use placeholder data if API fails - all stock at 0 for initial setup
      setMedications([
        {
          id: '1',
          code: 'SEM25',
          name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 2.5mg',
          category: 'GLP-1 Agonist',
          myceliumStock: 0,
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
          myceliumStock: 0,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 40.0,
          primaryPharmacy: 'Mycelium Pharmacy',
        },
        {
          id: '3',
          code: 'SEM10',
          name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 10mg',
          category: 'GLP-1 Agonist',
          myceliumStock: 0,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 70.0,
          primaryPharmacy: 'Mycelium Pharmacy',
        },
        {
          id: '4',
          code: 'SEM125',
          name: 'SEMAGLUTIDE/CYANOCOBALAMIN (2.5mg/1mL) - 12.5mg',
          category: 'GLP-1 Agonist',
          myceliumStock: 0,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 90.0,
          primaryPharmacy: 'Mycelium Pharmacy',
        },
        {
          id: '5',
          code: 'TIRZ10',
          name: 'TIRZEPATIDE/CYANOCOBALAMIN (10MG/1 MG/ML) - 10mg',
          category: 'GLP-1/GIP Agonist',
          myceliumStock: 0,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 60.0,
          primaryPharmacy: 'Angel Pharmacy',
        },
        {
          id: '6',
          code: 'TIRZ20',
          name: 'TIRZEPATIDE/CYANOCOBALAMIN (10MG/2MG/ML) - 20mg',
          category: 'GLP-1/GIP Agonist',
          myceliumStock: 0,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 80.0,
          primaryPharmacy: 'Angel Pharmacy',
        },
        {
          id: '7',
          code: 'TIRZ30',
          name: 'TIRZEPATIDE/CYANOCOBALAMIN (15MG/1 MG/ML) - 30mg',
          category: 'GLP-1/GIP Agonist',
          myceliumStock: 0,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 90.0,
          primaryPharmacy: 'Angel Pharmacy',
        },
        {
          id: '8',
          code: 'TIRZ60',
          name: 'TIRZEPATIDE/CYANOCOBALAMIN (15MG/1 MG/ML) - 60mg',
          category: 'GLP-1/GIP Agonist',
          myceliumStock: 0,
          angelStock: 0,
          reorderLevel: 15,
          unitCost: 130.0,
          primaryPharmacy: 'Angel Pharmacy',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    if (!selectedMedication || !quantity) return;
    
    setAdding(true);
    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationId: selectedMedication,
          pharmacyName: selectedPharmacy,
          quantity: parseInt(quantity),
        }),
      });

      if (response.ok) {
        await fetchMedications();
        setShowAddModal(false);
        setSelectedMedication('');
        setQuantity('');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleEditClick = (med: Medication) => {
    setEditingMed(med);
    setEditMyceliumStock(med.myceliumStock.toString());
    setEditAngelStock(med.angelStock.toString());
    setShowEditModal(true);
  };

  const handleUpdateStock = async () => {
    if (!editingMed) return;
    
    setAdding(true);
    try {
      const response = await fetch('/api/medications/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationId: editingMed.id,
          myceliumStock: parseInt(editMyceliumStock) || 0,
          angelStock: parseInt(editAngelStock) || 0,
        }),
      });

      if (response.ok) {
        await fetchMedications();
        setShowEditModal(false);
        setEditingMed(null);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setAdding(false);
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
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#0e88e9] text-white rounded-lg hover:bg-[#0c70c0] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Stock
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-[#e5e5e5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#efece7] border-b-2 border-[#e5e5e5]">
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
                  Primary Pharmacy
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
                      <span className="text-gray-600">{med.primaryPharmacy}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            onClick={() => handleEditClick(med)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Edit Stock"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {totalStock <= med.reorderLevel && (
                          <button className="text-[#0e88e9] hover:text-[#0c70c0] text-sm font-medium">
                            Reorder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border-2 border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Medication Stock</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication
                </label>
                <select
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={selectedMedication}
                  onChange={(e) => setSelectedMedication(e.target.value)}
                >
                  <option value="">Select Medication</option>
                  {medications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pharmacy Location
                </label>
                <select
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={selectedPharmacy}
                  onChange={(e) => setSelectedPharmacy(e.target.value)}
                >
                  <option value="Mycelium Pharmacy">Mycelium Pharmacy</option>
                  <option value="Angel Pharmacy">Angel Pharmacy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStock}
                  disabled={!selectedMedication || !quantity || adding}
                  className="flex-1 px-4 py-2 bg-[#0e88e9] text-white rounded-lg hover:bg-[#0c70c0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? 'Adding...' : 'Add Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stock Modal (Admin Only) */}
      {showEditModal && editingMed && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border-2 border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Stock Levels</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMed(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{editingMed.name}</p>
                  <p className="text-xs text-gray-500">{editingMed.code}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mycelium Pharmacy Stock
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={editMyceliumStock}
                  onChange={(e) => setEditMyceliumStock(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Angel Pharmacy Stock
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={editAngelStock}
                  onChange={(e) => setEditAngelStock(e.target.value)}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Admin Action:</strong> This will directly set the stock levels. Changes are logged for audit purposes.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMed(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStock}
                  disabled={adding}
                  className="flex-1 px-4 py-2 bg-[#0e88e9] text-white rounded-lg hover:bg-[#0c70c0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? 'Updating...' : 'Update Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}