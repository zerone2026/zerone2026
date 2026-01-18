import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId } = body;

    await db.vIPRegistration.update({
      where: { id: registrationId },
      data: { status: 'REJECTED' },
    });

    return NextResponse.json({ message: 'VIP rejected' });
  } catch (error) {
    console.error('Error rejecting VIP:', error);
    return NextResponse.json(
      { error: 'Failed to reject VIP' },
      { status: 500 }
    );
  }
}
