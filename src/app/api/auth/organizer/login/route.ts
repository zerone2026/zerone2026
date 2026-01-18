import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone, password } = body;

    // Hardcoded organizer credentials as per requirements
    const ORGANIZER_EMAIL = 'zeroneorg2026@gmail.com';
    const ORGANIZER_PASSWORD = 'Zerone@987';

    // Check if it's the organizer email
    if (emailOrPhone !== ORGANIZER_EMAIL) {
      return NextResponse.json(
        { error: 'Invalid organizer credentials' },
        { status: 401 }
      );
    }

    // Verify password
    if (password !== ORGANIZER_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid organizer credentials' },
        { status: 401 }
      );
    }

    // Return organizer user data
    return NextResponse.json({
      message: 'Organizer login successful',
      user: {
        id: 'organizer',
        name: 'Organizer',
        email: ORGANIZER_EMAIL,
        role: 'ORGANIZER',
      },
    });
  } catch (error) {
    console.error('Organizer login error:', error);
    return NextResponse.json(
      { error: 'Organizer login failed' },
      { status: 500 }
    );
  }
}
