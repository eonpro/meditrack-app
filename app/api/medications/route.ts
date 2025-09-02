import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const medications = await prisma.medication.findMany({
      include: {
        inventory: {
          include: {
            pharmacy: true,
          },
        },
      },
    });

    // Transform data to match frontend expectations
    const transformedMedications = medications.map((med) => {
      const myceliumInv = med.inventory.find(inv => inv.pharmacy.name === 'Mycelium Pharmacy');
      const angelInv = med.inventory.find(inv => inv.pharmacy.name === 'Angel Pharmacy');
      
      return {
        id: med.id,
        code: med.code,
        name: med.name,
        category: med.category,
        myceliumStock: myceliumInv?.currentStock || 0,
        angelStock: angelInv?.currentStock || 0,
        reorderLevel: med.reorderLevel,
        unitCost: med.unitCost,
        primaryPharmacy: med.primaryPharmacy === 'PHARM01' ? 'Mycelium Pharmacy' : 'Angel Pharmacy',
      };
    });

    return NextResponse.json(transformedMedications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { medicationId, pharmacyName, quantity } = body;

    // Find the pharmacy
    const pharmacy = await prisma.pharmacy.findFirst({
      where: { name: pharmacyName },
    });

    if (!pharmacy) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    // Update or create inventory record
    const inventory = await prisma.inventory.upsert({
      where: {
        medicationId_pharmacyId: {
          medicationId,
          pharmacyId: pharmacy.id,
        },
      },
      update: {
        currentStock: { increment: quantity },
        lastRestocked: new Date(),
      },
      create: {
        medicationId,
        pharmacyId: pharmacy.id,
        currentStock: quantity,
        lastRestocked: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'Inventory',
        entityId: inventory.id,
        changes: {
          action: 'add_stock',
          quantity,
          pharmacyName,
        },
      },
    });

    return NextResponse.json({ success: true, inventory });
  } catch (error) {
    console.error('Error adding stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
