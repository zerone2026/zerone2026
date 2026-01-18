import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone, password } = body;

    // Hardcoded admin credentials as per requirements
    const ADMIN_EMAIL = 'zerone2026@gmail.com';
    const ADMIN_PASSWORD = 'Zerone@678';

    // Check if it's the admin email
    if (emailOrPhone !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Return admin user data
    return NextResponse.json({
      message: 'Admin login successful',
      user: {
        id: 'admin',
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'ADMIN',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Admin login failed' },
      { status: 500 }
    );
  }
}
