import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT: Update a usage record
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only ADMIN and PHARMACY_MANAGER can edit records
    if (session.user.role !== 'ADMIN' && session.user.role !== 'PHARMACY_MANAGER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { recordId } = await params;
    const body = await request.json();
    const { medicationId, quantity, company, date, pharmacy: pharmacyName } = body;

    // Validate input
    if (!medicationId || !quantity || !company || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the existing usage record
    const existingRecord = await prisma.usageRecord.findUnique({
      where: { id: recordId },
      include: {
        pharmacy: true,
        medication: true,
      },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: 'Usage record not found' }, { status: 404 });
    }

    // Check if user has access to the existing pharmacy
    const userPharmacyAccess = session.user?.pharmacyAccess || [];
    if (!userPharmacyAccess.includes(existingRecord.pharmacyId)) {
      return NextResponse.json({ error: 'You do not have access to this pharmacy' }, { status: 403 });
    }

    // Find the medication
    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
    });

    if (!medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    // Find the new pharmacy
    const newPharmacy = await prisma.pharmacy.findFirst({
      where: { name: pharmacyName },
    });

    if (!newPharmacy) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    // Check if user has access to the new pharmacy
    if (!userPharmacyAccess.includes(newPharmacy.id)) {
      return NextResponse.json({ error: 'You do not have access to the target pharmacy' }, { status: 403 });
    }

    // Calculate fulfillment fee
    const fulfillmentFee = company === 'EONMeds' ? quantity * 15 : 0;

    // Update the record and adjust inventory in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // If pharmacy or medication changed, restore old inventory
      if (existingRecord.pharmacyId !== newPharmacy.id || existingRecord.medicationId !== medicationId) {
        // Restore old inventory
        await tx.inventory.update({
          where: {
            medicationId_pharmacyId: {
              medicationId: existingRecord.medicationId,
              pharmacyId: existingRecord.pharmacyId,
            },
          },
          data: {
            currentStock: {
              increment: existingRecord.quantity,
            },
          },
        });

        // Check new inventory availability
        const newInventory = await tx.inventory.findUnique({
          where: {
            medicationId_pharmacyId: {
              medicationId,
              pharmacyId: newPharmacy.id,
            },
          },
        });

        if (!newInventory || newInventory.currentStock < quantity) {
          throw new Error('Insufficient stock in target pharmacy');
        }

        // Deduct from new inventory
        await tx.inventory.update({
          where: {
            medicationId_pharmacyId: {
              medicationId,
              pharmacyId: newPharmacy.id,
            },
          },
          data: {
            currentStock: {
              decrement: quantity,
            },
          },
        });
      } else {
        // Same pharmacy and medication, just adjust the difference
        const quantityDiff = quantity - existingRecord.quantity;

        if (quantityDiff > 0) {
          // Need more stock - check availability
          const inventory = await tx.inventory.findUnique({
            where: {
              medicationId_pharmacyId: {
                medicationId,
                pharmacyId: newPharmacy.id,
              },
            },
          });

          if (!inventory || inventory.currentStock < quantityDiff) {
            throw new Error('Insufficient stock for increased quantity');
          }
        }

        // Update inventory
        await tx.inventory.update({
          where: {
            medicationId_pharmacyId: {
              medicationId,
              pharmacyId: newPharmacy.id,
            },
          },
          data: {
            currentStock: {
              decrement: quantityDiff,
            },
          },
        });
      }

      // Update the usage record
      const updatedRecord = await tx.usageRecord.update({
        where: { id: recordId },
        data: {
          medicationId,
          pharmacyId: newPharmacy.id,
          quantity,
          company,
          date: new Date(date),
          unitCost: medication.unitCost,
          totalCost: quantity * medication.unitCost,
          fulfillmentFee,
        },
        include: {
          medication: true,
          pharmacy: true,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'UPDATE',
          entity: 'UsageRecord',
          entityId: recordId,
          changes: {
            action: 'update_usage',
            oldValues: {
              medication: existingRecord.medication.name,
              quantity: existingRecord.quantity,
              company: existingRecord.company,
              pharmacy: existingRecord.pharmacy.name,
            },
            newValues: {
              medication: medication.name,
              quantity,
              company,
              pharmacy: pharmacyName,
            },
          },
        },
      });

      return updatedRecord;
    });

    return NextResponse.json({ success: true, usageRecord: result });
  } catch (error: any) {
    console.error('Error updating usage record:', error);
    if (error.message?.includes('Insufficient stock')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a usage record and restore inventory
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only ADMIN and PHARMACY_MANAGER can delete records
    if (session.user.role !== 'ADMIN' && session.user.role !== 'PHARMACY_MANAGER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { recordId } = await params;

    // Find the usage record
    const usageRecord = await prisma.usageRecord.findUnique({
      where: { id: recordId },
      include: {
        pharmacy: true,
        medication: true,
      },
    });

    if (!usageRecord) {
      return NextResponse.json({ error: 'Usage record not found' }, { status: 404 });
    }

    // Check if user has access to this pharmacy
    const userPharmacyAccess = session.user?.pharmacyAccess || [];
    if (!userPharmacyAccess.includes(usageRecord.pharmacyId)) {
      return NextResponse.json({ error: 'You do not have access to this pharmacy' }, { status: 403 });
    }

    // Delete record and restore inventory in a transaction
    await prisma.$transaction(async (tx) => {
      // Restore inventory
      await tx.inventory.update({
        where: {
          medicationId_pharmacyId: {
            medicationId: usageRecord.medicationId,
            pharmacyId: usageRecord.pharmacyId,
          },
        },
        data: {
          currentStock: {
            increment: usageRecord.quantity,
          },
        },
      });

      // Delete the usage record
      await tx.usageRecord.delete({
        where: { id: recordId },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'DELETE',
          entity: 'UsageRecord',
          entityId: recordId,
          changes: {
            action: 'delete_usage',
            medication: usageRecord.medication.name,
            quantity: usageRecord.quantity,
            company: usageRecord.company,
            pharmacy: usageRecord.pharmacy.name,
            restoredStock: usageRecord.quantity,
          },
        },
      });
    });

    return NextResponse.json({ success: true, message: 'Usage record deleted and inventory restored' });
  } catch (error) {
    console.error('Error deleting usage record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
