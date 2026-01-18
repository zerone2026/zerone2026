import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const vipRequests = await db.vIPRegistration.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests: vipRequests });
  } catch (error) {
    console.error('Error fetching VIP requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VIP requests' },
      { status: 500 }
    );
  }
}
