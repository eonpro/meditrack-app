import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">MediTrack</h1>
            </div>
            <div className="flex items-center gap-6">
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
