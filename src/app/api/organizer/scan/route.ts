import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrCode, type, eventId } = body;

    /* =========================
       1. FIND USER BY TICKET
    ========================= */
    const scannedUser = await db.user.findUnique({
      where: { ticketNumber: qrCode },
    });

    if (!scannedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    /* =========================
       2. FEST ATTENDANCE
    ========================= */
    if (type !== 'event') {
      const alreadyMarked = await db.attendance.findFirst({
        where: {
          userId: scannedUser.id,
          isFestAttendance: true,
        },
      });

      if (!alreadyMarked) {
        await db.attendance.create({
          data: {
            userId: scannedUser.id,
            isFestAttendance: true,
          },
        });
      }

      return NextResponse.json({
        message: 'Fest attendance marked',
        user: {
          name: scannedUser.name,
          ticketNumber: scannedUser.ticketNumber,
          institution: scannedUser.institution,
        },
      });
    }

    /* =========================
       3. EVENT ATTENDANCE
    ========================= */
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID required' },
        { status: 400 }
      );
    }

    /* 3.1 Find approved registration where scanned user
           is either team lead OR team member */
    const registration = await db.eventRegistration.findFirst({
      where: {
        eventId,
        status: 'APPROVED',
        OR: [
          { userId: scannedUser.id }, // team lead
          {
            teamMembers: {
              some: {
                memberTicketNumber: scannedUser.ticketNumber,
              },
            },
          },
        ],
      },
      include: {
        user: true,        // team lead
        teamMembers: true // team members
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'No approved registration found' },
        { status: 404 }
      );
    }

    /* =========================
       4. BUILD FULL TEAM
    ========================= */
    const ticketNumbers = new Set<string>();

    // Team lead
    ticketNumbers.add(registration.user.ticketNumber);

    // Team members
    registration.teamMembers.forEach(member => {
      ticketNumbers.add(member.memberTicketNumber);
    });

    /* =========================
       5. FETCH ALL USERS
    ========================= */
    const teamUsers = await db.user.findMany({
      where: {
        ticketNumber: { in: Array.from(ticketNumbers) },
      },
    });

    /* =========================
       6. MARK ATTENDANCE (ALL)
    ========================= */
    for (const member of teamUsers) {
      const alreadyMarked = await db.attendance.findFirst({
        where: {
          userId: member.id,
          eventId,
        },
      });

      if (!alreadyMarked) {
        await db.attendance.create({
          data: {
            userId: member.id,
            eventId,
            isFestAttendance: false,
          },
        });
      }
    }

    /* =========================
       7. RESPONSE
    ========================= */
    return NextResponse.json({
      message: 'Team attendance marked successfully',
      teamSize: teamUsers.length,
      members: teamUsers.map(u => ({
        name: u.name,
        ticketNumber: u.ticketNumber,
        institution: u.institution,
        email: u.email,
        ticketType: u.ticketType,
      })),
    });

  } catch (error) {
    console.error('QR scan error:', error);
    return NextResponse.json(
      { error: 'Scan failed' },
      { status: 500 }
    );
  }
}
