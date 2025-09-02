'use client';

export default function SuppliersTab() {
  return (
    <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-4">Pharmacies</h2>
      <p className="text-gray-600">Manage pharmacy information and contacts.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Mycelium Pharmacy</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Contact:</strong> George French</p>
            <p><strong>Email:</strong> admin@myceliumpharmacy.com</p>
            <p><strong>Phone:</strong> (786) 282-7349</p>
            <p><strong>Payment Terms:</strong> Net 7</p>
            <p><strong>Licensed States:</strong> 10</p>
          </div>
        </div>
        
        <div className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Angel Pharmacy</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Contact:</strong> Michael Ibrahim</p>
            <p><strong>Email:</strong> management@angelpharmacy.org</p>
            <p><strong>Phone:</strong> (646) 280-9084</p>
            <p><strong>Payment Terms:</strong> Net 7</p>
            <p><strong>Licensed States:</strong> 23</p>
          </div>
        </div>
      </div>
    </div>
  );
}
