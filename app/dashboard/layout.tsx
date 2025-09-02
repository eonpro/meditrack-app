import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <img 
                src="https://static.wixstatic.com/media/c49a9b_ea9e6b716ac844ddbe9bce2485ba6198~mv2.png" 
                alt="Logo" 
                className="h-14 w-auto"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                <label className="text-sm font-medium">Viewing:</label>
                <select 
                  id="pharmacySelector" 
                  className="bg-white text-black border-none px-3 py-1 rounded-md text-sm font-semibold cursor-pointer"
                >
                  {session.user?.pharmacyAccess?.includes('PHARM01') && (
                    <option value="PHARM01">Mycelium Pharmacy</option>
                  )}
                  {session.user?.pharmacyAccess?.includes('PHARM02') && (
                    <option value="PHARM02">Angel Pharmacy</option>
                  )}
                  {session.user?.pharmacyAccess?.length === 2 && (
                    <option value="both">Both Pharmacies</option>
                  )}
                </select>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                <span className="text-sm">User: {session.user?.name || session.user?.email}</span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded">{session.user?.role}</span>
              </div>
              <div className="text-sm">
                Last Sync: <span className="text-blue-400">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}