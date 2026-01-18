import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* =========================
   GET – Fetch attendees
========================= */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'zerone' | 'event'
    const eventId = searchParams.get('eventId');

    /* =========================
       ZERONE (FEST) ATTENDEES
    ========================= */
    if (type === 'zerone') {
      const festAttendees = await db.attendance.findMany({
        where: { isFestAttendance: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              ticketNumber: true,
              ticketType: true,
              institution: true,
              phone: true,
              email: true,
            },
          },
        },
        orderBy: { markedAt: 'desc' },
      });

      const formatted = festAttendees
        .filter(a => a.user)
        .map(a => ({
          id: a.id,
          name: a.user!.name,
          ticketNumber: a.user!.ticketNumber,
          ticketType: a.user!.ticketType,
          institution: a.user!.institution,
          phone: a.user!.phone,
          email: a.user!.email,
          markedAt: a.markedAt,
        }));

      return NextResponse.json({ attendees: formatted });
    }

    /* =========================
       EVENT ATTENDEES
    ========================= */
    /* =========================
   EVENT ATTENDEES
========================= */
if (type === 'event') {
  if (!eventId) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    );
  }

  // 1️⃣ Get attendance records
  const attendances = await db.attendance.findMany({
    where: { eventId },
    include: {
      user: true,
      event: true,
    },
    orderBy: { markedAt: 'desc' },
  });

  // 2️⃣ Get registrations for this event
  const registrations = await db.eventRegistration.findMany({
    where: { eventId },
    include: {
      teamMembers: true,
    },
  });

  // 3️⃣ Map registrationId -> team members
  const teamMap = new Map<string, any[]>();

  for (const reg of registrations) {
    if (!reg.isTeamEvent) continue;

    const members: {
  name: string;
  institution: string;
  email: string;
  ticketType: 'VIP' | 'REGULAR';
}[] = [];

    for (const m of reg.teamMembers) {
      const user = await db.user.findUnique({
        where: { ticketNumber: m.memberTicketNumber },
        select: {
          name: true,
          institution: true,
          email: true,
          ticketType: true,
        },
      });

      if (user) {
        members.push({
          name: user.name,
          institution: user.institution,
          email: user.email,
          ticketType: user.ticketType,
        });
      }
    }

    teamMap.set(reg.id, members);
  }

  // 4️⃣ Build final attendees list
  const formatted = await Promise.all(
    attendances
      .filter(a => a.user)
      .map(async a => {
        const reg = await db.eventRegistration.findFirst({
          where: {
            eventId,
            OR: [
              { userId: a.userId },
              {
                teamMembers: {
                  some: {
                    memberTicketNumber: a.user!.ticketNumber,
                  },
                },
              },
            ],
          },
        });

        return {
          id: a.id,
          name: a.user!.name,
          ticketNumber: a.user!.ticketNumber,
          ticketType: a.user!.ticketType,
          institution: a.user!.institution,
          phone: a.user!.phone,
          email: a.user!.email,
          eventName: a.event?.name || 'N/A',
          markedAt: a.markedAt,

          // ✅ FULL TEAM
          teamMembers: reg ? teamMap.get(reg.id) || [] : [],
        };
      })
  );

  return NextResponse.json({ attendees: formatted });
}


    return NextResponse.json(
      { error: 'Invalid type. Use "zerone" or "event"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error fetching attendees:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
}
