import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can directly update stock
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { medicationId, myceliumStock, angelStock } = body;

    if (!medicationId || myceliumStock === undefined || angelStock === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get pharmacies
    const myceliumPharmacy = await prisma.pharmacy.findFirst({
      where: { name: 'Mycelium Pharmacy' },
    });

    const angelPharmacy = await prisma.pharmacy.findFirst({
      where: { name: 'Angel Pharmacy' },
    });

    if (!myceliumPharmacy || !angelPharmacy) {
      return NextResponse.json({ error: 'Pharmacies not found' }, { status: 404 });
    }

    // Update both inventory records in a transaction
    await prisma.$transaction(async (tx) => {
      // Update Mycelium inventory
      await tx.inventory.upsert({
        where: {
          medicationId_pharmacyId: {
            medicationId,
            pharmacyId: myceliumPharmacy.id,
          },
        },
        update: {
          currentStock: myceliumStock,
          lastRestocked: new Date(),
        },
        create: {
          medicationId,
          pharmacyId: myceliumPharmacy.id,
          currentStock: myceliumStock,
          lastRestocked: new Date(),
        },
      });

      // Update Angel inventory
      await tx.inventory.upsert({
        where: {
          medicationId_pharmacyId: {
            medicationId,
            pharmacyId: angelPharmacy.id,
          },
        },
        update: {
          currentStock: angelStock,
          lastRestocked: new Date(),
        },
        create: {
          medicationId,
          pharmacyId: angelPharmacy.id,
          currentStock: angelStock,
          lastRestocked: new Date(),
        },
      });

      // Create audit log for admin action
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'UPDATE',
          entity: 'Inventory',
          entityId: medicationId,
          changes: {
            action: 'admin_stock_update',
            myceliumStock,
            angelStock,
            updatedBy: session.user.name || session.user.email,
          },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
