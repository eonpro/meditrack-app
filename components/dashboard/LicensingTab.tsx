'use client';

export default function LicensingTab() {
  const myceliumLicenses = [
    'Florida', 'New Jersey', 'Georgia', 'North Carolina', 'Pennsylvania',
    'Colorado', 'Illinois', 'Tennessee', 'Arizona', 'New York'
  ];

  const angelLicenses = [
    'Florida', 'Ohio', 'North Carolina', 'Indiana', 'Pennsylvania',
    'Rhode Island', 'Illinois', 'Washington DC', 'Georgia', 'Alabama',
    'Arizona', 'Hawaii', 'Delaware', 'Wisconsin', 'New York',
    'Missouri', 'Connecticut', 'Washington', 'Colorado', 'Idaho',
    'Maryland', 'New Mexico', 'New Jersey'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Mycelium Pharmacy</h3>
        <p className="text-gray-600 mb-4">Licensed in {myceliumLicenses.length} states:</p>
        <div className="grid grid-cols-2 gap-2">
          {myceliumLicenses.map((state, index) => (
            <div key={state} className="bg-white p-2 rounded-md text-sm">
              {index + 1}. {state}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#efece7] border-2 border-[#e5e5e5] rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Angel Pharmacy</h3>
        <p className="text-gray-600 mb-4">Licensed in {angelLicenses.length} states:</p>
        <div className="grid grid-cols-2 gap-2">
          {angelLicenses.map((state, index) => (
            <div key={state} className="bg-white p-2 rounded-md text-sm">
              {index + 1}. {state}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
