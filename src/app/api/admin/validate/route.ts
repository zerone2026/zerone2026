import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* =========================
   GET – Fetch pending validations
========================= */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'vip' | 'events'

    /* ---------- VIP VALIDATIONS ---------- */
    if (type === 'vip') {
      const pendingVIPs = await db.vIPRegistration.findMany({
        where: { status: 'PENDING' },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ validations: pendingVIPs });
    }

    /* ---------- EVENT VALIDATIONS ---------- */
    if (type === 'events') {
      const pendingEvents = await db.eventRegistration.findMany({
        where: {
          status: 'PENDING',
          transactionId: { not: null },
        },
        include: {
          user: true,
          event: true,
          teamMembers: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // ✅ Compute VIP / REGULAR counts CORRECTLY
      const enriched = await Promise.all(
        pendingEvents.map(async (reg) => {
          let vipCount = 0;
          let regularCount = 0;

          if (reg.isTeamEvent) {
            for (const member of reg.teamMembers) {
              const user = await db.user.findUnique({
                where: { ticketNumber: member.memberTicketNumber },
                select: { ticketType: true },
              });

              if (user?.ticketType === 'VIP') vipCount++;
              else regularCount++;
            }
          } else {
            if (reg.user.ticketType === 'VIP') vipCount = 1;
            else regularCount = 1;
          }

          return {
            ...reg,
            vipCount,
            regularCount,
          };
        })
      );

      return NextResponse.json({ validations: enriched });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching validations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validations' },
      { status: 500 }
    );
  }
}

/* =========================
   POST – Validate / Reject
========================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, status } = body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    /* ---------- VIP VALIDATION ---------- */
    if (type === 'vip') {
      const vipReg = await db.vIPRegistration.findUnique({ where: { id } });

      if (!vipReg) {
        return NextResponse.json(
          { error: 'VIP registration not found' },
          { status: 404 }
        );
      }

      await db.vIPRegistration.update({
        where: { id },
        data: { status },
      });

      if (status === 'APPROVED') {
        await db.user.update({
          where: { id: vipReg.userId },
          data: { ticketType: 'VIP' },
        });
      }

      return NextResponse.json({
        message:
          status === 'APPROVED'
            ? 'VIP upgrade approved'
            : 'VIP upgrade rejected',
      });
    }

    /* ---------- EVENT VALIDATION ---------- */
    if (type === 'events') {
      const eventReg = await db.eventRegistration.findUnique({
        where: { id },
      });

      if (!eventReg) {
        return NextResponse.json(
          { error: 'Event registration not found' },
          { status: 404 }
        );
      }

      await db.eventRegistration.update({
        where: { id },
        data: { status },
      });

      return NextResponse.json({
        message:
          status === 'APPROVED'
            ? 'Event registration approved'
            : 'Event registration rejected',
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
}
