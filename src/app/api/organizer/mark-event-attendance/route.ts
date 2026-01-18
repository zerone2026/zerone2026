import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { ticketNumber } = body;

    // Find user by ticket number
    const user = await db.user.findUnique({
      where: { ticketNumber },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        institution: true,
        ticketType: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is registered for this event
    const registration = await db.eventRegistration.findFirst({
      where: {
        userId: user.id,
        eventId,
        status: 'APPROVED',
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'User not registered for this event' },
        { status: 404 }
      );
    }

    // Check if already marked attendance for this event
    const existingAttendance = await db.attendance.findFirst({
      where: {
        userId: user.id,
        eventId,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already marked for this event', user },
        { status: 400 }
      );
    }

    // Create attendance record
    await db.attendance.create({
      data: {
        userId: user.id,
        eventId,
      },
    });

    return NextResponse.json({
      message: 'Event attendance marked successfully',
      user,
    });
  } catch (error) {
    console.error('Error marking event attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
