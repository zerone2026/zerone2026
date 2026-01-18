import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId } = body;

    // Get the VIP registration
    const vipRegistration = await db.vIPRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!vipRegistration) {
      return NextResponse.json(
        { error: 'VIP registration not found' },
        { status: 404 }
      );
    }

    // Update VIP registration status
    await db.vIPRegistration.update({
      where: { id: registrationId },
      data: { status: 'APPROVED' },
    });

    // Update user's ticket type to VIP
    await db.user.update({
      where: { id: vipRegistration.userId },
      data: { ticketType: 'VIP' },
    });

    return NextResponse.json({ message: 'VIP approved successfully' });
  } catch (error) {
    console.error('Error approving VIP:', error);
    return NextResponse.json(
      { error: 'Failed to approve VIP' },
      { status: 500 }
    );
  }
}
