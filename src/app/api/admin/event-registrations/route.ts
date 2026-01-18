import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    const eventRegistrations = await db.eventRegistration.findMany({
  where: {
    ...(eventId ? { eventId } : {}),
    status: 'APPROVED',
  },
  include: {
    user: true,
    event: true,
  },
});


    return NextResponse.json({ registrations: eventRegistrations });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event registrations' },
      { status: 500 }
    );
  }
}
