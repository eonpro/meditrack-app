import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, role, pharmacyAccess } = body;

    // Don't allow changing super admin role
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.email === 'admin@meditrack.com' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Cannot change super admin role' }, { status: 400 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name,
        role,
        pharmacyAccess,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        pharmacyAccess: true,
        createdAt: true,
        isActive: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: params.userId,
        changes: {
          action: 'update_user',
          name,
          role,
          pharmacyAccess,
          updatedBy: session.user.email,
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Don't allow deleting super admin
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.email === 'admin@meditrack.com') {
      return NextResponse.json({ error: 'Cannot delete super admin' }, { status: 400 });
    }

    // Don't allow self-deletion
    if (targetUser.id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Soft delete - just mark as inactive
    await prisma.user.update({
      where: { id: params.userId },
      data: {
        isActive: false,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        entity: 'User',
        entityId: params.userId,
        changes: {
          action: 'delete_user',
          email: targetUser.email,
          deletedBy: session.user.email,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
