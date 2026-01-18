import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketNumber = searchParams.get('ticketNumber');

    if (!ticketNumber) {
      return NextResponse.json({ valid: false });
    }

    const user = await db.user.findUnique({
      where: { ticketNumber },
      select: { ticketType: true },
    });

    if (!user) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      ticketType: user.ticketType, // VIP or REGULAR
    });
  } catch (error) {
    console.error('Ticket check error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
