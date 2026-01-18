import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, userId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Get user from localStorage if userId not provided (client-side)
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user already has a pending VIP registration
    const existingVIPRequest = await db.vIPRegistration.findUnique({
      where: { userId },
    });

    if (existingVIPRequest) {
      return NextResponse.json(
        { error: 'VIP upgrade request already exists' },
        { status: 400 }
      );
    }

    // Check user's current ticket type
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.ticketType === 'VIP') {
      return NextResponse.json(
        { error: 'User already has a VIP ticket' },
        { status: 400 }
      );
    }

    // Create VIP registration request
    const vipRegistration = await db.vIPRegistration.create({
      data: {
        userId,
        transactionId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'VIP upgrade request submitted successfully',
      registration: {
        id: vipRegistration.id,
        status: vipRegistration.status,
      },
    });
  } catch (error) {
    console.error('VIP upgrade error:', error);
    return NextResponse.json(
      { error: 'VIP upgrade failed' },
      { status: 500 }
    );
  }
}
