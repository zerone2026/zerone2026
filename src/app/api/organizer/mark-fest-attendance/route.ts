import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
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

    // Check if already marked attendance for fest
    const existingAttendance = await db.attendance.findFirst({
      where: {
        userId: user.id,
        isFestAttendance: true,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already marked for this user', user },
        { status: 400 }
      );
    }

    // Create attendance record
    await db.attendance.create({
      data: {
        userId: user.id,
        isFestAttendance: true,
      },
    });

    return NextResponse.json({
      message: 'Attendance marked successfully',
      user,
    });
  } catch (error) {
    console.error('Error marking fest attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
