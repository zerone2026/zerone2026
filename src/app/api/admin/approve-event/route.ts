import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId } = body;

    await db.eventRegistration.update({
      where: { id: registrationId },
      data: { status: 'APPROVED' },
    });

    return NextResponse.json({ message: 'Event registration approved' });
  } catch (error) {
    console.error('Error approving event:', error);
    return NextResponse.json(
      { error: 'Failed to approve event' },
      { status: 500 }
    );
  }
}
