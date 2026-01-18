import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    const events = await db.event.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      isTeamEvent,
      teamSize,
      rewardPool,
      registrationFee,
      time,
      venue,
      description,
      coordinator1Name,
      coordinator1Phone,
      coordinator2Name,
      coordinator2Phone,
    } = body;

    const event = await db.event.create({
      data: {
        name,
        isTeamEvent: Boolean(isTeamEvent),
        teamSize: teamSize ? parseInt(teamSize) : null,
        rewardPool,
        registrationFee: parseInt(registrationFee) || 0,
        time,
        venue,
        description,
        coordinator1Name,
        coordinator1Phone,
        coordinator2Name,
        coordinator2Phone,
      },
    });

    return NextResponse.json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
