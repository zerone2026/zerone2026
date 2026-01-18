import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* =========================
   POST – Export CSV
========================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, eventId } = body;

    /* =========================
       FEST EXPORT (ZERONE 2026)
    ========================= */
    if (type === 'fest') {
      const users = await db.user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'asc' },
      });

      let csv =
        'S.No,Name,Phone,Institution,District,Ticket Type,Ticket Number\n';

      users.forEach((u, index) => {
        csv += `${index + 1},"${u.name}","${u.phone}","${u.institution}","${u.district}","${u.ticketType}","${u.ticketNumber}"\n`;
      });

      return NextResponse.json({
        filename: 'zerone_2026_registrations.csv',
        csv,
      });
    }

    /* =========================
       EVENT EXPORT
    ========================= */
    if (type === 'event' && eventId) {
      const registrations = await db.eventRegistration.findMany({
        where: {
          eventId,
          status: 'APPROVED',
        },
        include: {
          event: true,
          user: true, // team lead / solo user
          teamMembers: {
            include: {
              teamLead: true, // 👈 correct schema relation
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      let csv =
        'S.No,Event,Type,Names,Phones,Institutions\n';

      registrations.forEach((reg, index) => {
        // ================= SOLO EVENT =================
        if (!reg.isTeamEvent) {
          csv += `${index + 1},"${reg.event.name}","SOLO","${reg.user.name}","${reg.user.phone}","${reg.user.institution}"\n`;
          return;
        }

        // ================= TEAM EVENT =================
        const names = [
          reg.user.name,
          ...reg.teamMembers.map(m => m.memberName),
        ].join(', ');

        const phones = [
          reg.user.phone,
          ...reg.teamMembers.map(m => m.teamLead.phone),
        ].join(', ');

        const institutions = [
          reg.user.institution,
          ...reg.teamMembers.map(m => m.teamLead.institution),
        ].join(', ');

        csv += `${index + 1},"${reg.event.name}","TEAM","${names}","${phones}","${institutions}"\n`;
      });

      return NextResponse.json({
        filename: `${registrations[0]?.event.name || 'event'}_registrations.csv`,
        csv,
      });
    }

    return NextResponse.json(
      { error: 'Invalid export type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
