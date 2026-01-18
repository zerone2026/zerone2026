import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { ticketNumber: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const registrations = await db.eventRegistration.findMany({
      where: {
        status: 'APPROVED',
        OR: [
          { userId }, // team lead / solo
          {
            teamMembers: {
              some: {
                memberTicketNumber: user.ticketNumber, // team member
              },
            },
          },
        ],
      },
      include: {
        event: true,
        teamMembers: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json({ error: 'Failed to fetch user events' }, { status: 500 });
  }
}
