import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* =======================
   UPDATE EVENT (EDIT)
======================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await req.json();

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

    const updatedEvent = await db.event.update({
      where: { id: eventId },
      data: {
        name,
        isTeamEvent: Boolean(isTeamEvent),
        teamSize: isTeamEvent ? Number(teamSize) : null,
        rewardPool,
        registrationFee: Number(registrationFee),
        time,
        venue,
        description,
        coordinator1Name,
        coordinator1Phone,
        coordinator2Name: coordinator2Name || null,
        coordinator2Phone: coordinator2Phone || null,
      },
    });

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE EVENT
======================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    await db.teamMember.deleteMany({
      where: { eventId },
    });

    await db.eventRegistration.deleteMany({
      where: { eventId },
    });

    await db.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
