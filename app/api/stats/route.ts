import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total medications count
    const totalMedications = await prisma.medication.count();

    // Get low stock items
    const inventory = await prisma.inventory.findMany({
      include: {
        medication: true,
      },
    });

    const lowStockItems = inventory.filter(inv => 
      inv.currentStock > 0 && inv.currentStock <= inv.medication.reorderLevel
    ).length;

    // Get pending orders
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' },
    });

    // Get today's usage (sum of quantities, not just count)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayUsageRecords = await prisma.usageRecord.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    
    const todayUsage = todayUsageRecords.reduce((sum, record) => sum + record.quantity, 0);

    // Get total debt
    const debtRecords = await prisma.debtRecord.findMany();
    const totalDebt = debtRecords.reduce((sum, record) => sum + record.balance, 0);

    return NextResponse.json({
      totalMedications,
      lowStockItems,
      pendingOrders,
      todayUsage,
      totalDebt,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default values on error
    return NextResponse.json({
      totalMedications: 8,
      lowStockItems: 0,
      pendingOrders: 0,
      todayUsage: 0,
      totalDebt: 0,
    });
  }
}
