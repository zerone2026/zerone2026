import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'fest' or 'events'

    if (type === 'fest') {
      // Get all registered users (fest registrations)
      const registrations = await db.user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' },
      });

      const formattedRegs = registrations.map((reg, index) => ({
        id: index + 1,
        name: reg.name,
        phone: reg.phone,
        institution: reg.institution,
        ticketType: reg.ticketType,
        ticketNumber: reg.ticketNumber,
      }));

      const vipCount = formattedRegs.filter(r => r.ticketType === 'VIP').length;
      const regularCount = formattedRegs.filter(r => r.ticketType === 'REGULAR').length;

      return NextResponse.json({
        registrations: formattedRegs,
        summary: {
          total: formattedRegs.length,
          vip: vipCount,
          regular: regularCount,
        },
      });
    }

    if (type === 'events') {
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    const events = await db.event.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ events });
  }

  const registrations = await db.eventRegistration.findMany({
  where: {
    eventId,
    status: 'APPROVED',
  },
  include: {
    event: true,     // ✅ REQUIRED
    user: true,      // ✅ team lead
    teamMembers: {
      include: {
        teamLead: true, // ✅ THIS EXISTS IN YOUR SCHEMA
      },
    },
  },
  orderBy: { createdAt: 'asc' },
});


  // ⚠️ DO NOT FLATTEN
  // Return ONE object per registration (team or solo)
  return NextResponse.json({
    registrations,
    eventId,
    eventName: registrations[0]?.event?.name || '',
  });
}


    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
