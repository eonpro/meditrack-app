'use client';

import { ExternalLink, FileText } from 'lucide-react';

export default function OrdersTab() {
  return (
    <div className="bg-white border-2 border-[#e5e5e5] rounded-xl p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Purchase Orders</h2>
          <p className="text-gray-600">Manage and track medication reorders.</p>
        </div>
        <a
          href="https://invoice.breakthroughtelemed.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
        >
          <FileText className="h-5 w-5" />
          Generate PDF Purchase Order
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="bg-[#efece7] rounded-lg p-6 border border-[#e5e5e5]">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="text-gray-600">
          <p>No recent orders to display.</p>
          <p className="text-sm mt-2">Use the button above to create a new purchase order.</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <FileText className="h-5 w-5" />
          <span className="font-medium">Quick Tip:</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Click "Generate PDF Purchase Order" to access the Breakthrough Telemed invoice system for creating and managing purchase orders.
        </p>
      </div>
    </div>
  );
}
