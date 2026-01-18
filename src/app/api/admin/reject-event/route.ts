import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId } = body;

    await db.eventRegistration.update({
      where: { id: registrationId },
      data: { status: 'REJECTED' },
    });

    return NextResponse.json({ message: 'Event registration rejected' });
  } catch (error) {
    console.error('Error rejecting event:', error);
    return NextResponse.json(
      { error: 'Failed to reject event' },
      { status: 500 }
    );
  }
}
