import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      eventId,
      isTeamEvent,
      transactionId,
      teamMembers,
      finalFee,
    } = body;

    // Check if user already registered for this event
    const existingRegistration = await db.eventRegistration.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      );
    }

    // Create event registration
    const registration = await db.eventRegistration.create({
      data: {
        userId,
        eventId,
        isTeamEvent: Boolean(isTeamEvent),
        finalFee: parseInt(finalFee) || 0,
        transactionId: transactionId || null,
        status: transactionId ? 'PENDING' : 'APPROVED',
      },
    });

    // If team event, create team members
    if (isTeamEvent && teamMembers && teamMembers.length > 0) {
      for (const member of teamMembers) {
        await db.teamMember.create({
          data: {
            eventId,
            teamLeadId: userId,
            eventRegistrationId: registration.id,
            memberName: member.name,
            memberTicketNumber: member.ticketNumber,
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Event registration successful',
      registration: {
        id: registration.id,
        status: registration.status,
      },
    });
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}
