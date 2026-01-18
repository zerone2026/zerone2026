import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventRegistrations = await db.eventRegistration.findMany({
      where: {
        status: 'PENDING',
        transactionId: { not: null },
      },
      include: {
        user: true,
        event: true,
        teamMembers: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ registrations: eventRegistrations });
  } catch (error) {
    console.error('Error fetching event validations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event validations' },
      { status: 500 }
    );
  }
}
