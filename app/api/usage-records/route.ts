import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usageRecords = await prisma.usageRecord.findMany({
      include: {
        medication: true,
        pharmacy: true,
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Transform data for frontend
    const transformedRecords = usageRecords.map(record => ({
      id: record.id,
      date: record.date.toISOString().split('T')[0],
      time: record.createdAt.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
      medication: record.medication.name,
      quantity: record.quantity,
      company: record.company,
      unitCost: record.medication.unitCost,
      totalCost: record.quantity * record.medication.unitCost,
      pharmacy: record.pharmacy.name,
    }));

    return NextResponse.json(transformedRecords);
  } catch (error) {
    console.error('Error fetching usage records:', error);
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
    const { medicationId, quantity, company, date, pharmacy: pharmacyName } = body;

    // Validate input
    if (!medicationId || !quantity || !company || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the medication
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
    });

    if (!medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    // Find the pharmacy
    const pharmacy = await prisma.pharmacy.findFirst({
      where: { name: pharmacyName },
    });

    if (!pharmacy) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    // Check inventory availability
    const inventory = await prisma.inventory.findUnique({
      where: {
        medicationId_pharmacyId: {
          medicationId,
          pharmacyId: pharmacy.id,
        },
      },
    });

    if (!inventory || inventory.currentStock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Create usage record and update inventory in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create usage record
      const usageRecord = await tx.usageRecord.create({
        data: {
          medicationId,
          pharmacyId: pharmacy.id,
          quantity,
          company,
          date: new Date(date),
          userId: session.user.id,
          unitCost: medication.unitCost,
          totalCost: quantity * medication.unitCost,
        },
      });

      // Update inventory
      await tx.inventory.update({
        where: {
          medicationId_pharmacyId: {
            medicationId,
            pharmacyId: pharmacy.id,
          },
        },
        data: {
          currentStock: {
            decrement: quantity,
          },
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'CREATE',
          entity: 'UsageRecord',
          entityId: usageRecord.id,
          changes: {
            action: 'record_usage',
            medication: medication.name,
            quantity,
            company,
            pharmacy: pharmacyName,
          },
        },
      });

      return usageRecord;
    });

    return NextResponse.json({ success: true, usageRecord: result });
  } catch (error) {
    console.error('Error recording usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
