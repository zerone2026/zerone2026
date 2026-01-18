import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch contact info
export async function GET(request: NextRequest) {
  try {
    // Get first contact info record or create default
    let contactInfo = await db.contactInfo.findFirst();

    if (!contactInfo) {
      // Create default contact info
      contactInfo = await db.contactInfo.create({
        data: {
          studentCoordinatorName: 'Coming soon',
          studentCoordinatorPhone: '',
          studentCoordinatorEmail: '',
          facultyCoordinatorName: 'Coming soon',
          facultyCoordinatorPhone: '',
          facultyCoordinatorEmail: '',
          festEmail: 'zerone@mesponnani.ac.in',
          collegeEmail: 'info@mesponnani.ac.in',
          collegeAddress: 'MES Ponnani College, Ponnani, Kerala',
        },
      });
    }

    return NextResponse.json({ contactInfo });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// POST - Update contact info
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentCoordinatorName,
      studentCoordinatorPhone,
      studentCoordinatorEmail,
      facultyCoordinatorName,
      facultyCoordinatorPhone,
      facultyCoordinatorEmail,
      festEmail,
      collegeEmail,
      collegeAddress,
    } = body;

    // Get first contact info record
    let contactInfo = await db.contactInfo.findFirst();

    if (contactInfo) {
      // Update existing
      contactInfo = await db.contactInfo.update({
        where: { id: contactInfo.id },
        data: {
          studentCoordinatorName,
          studentCoordinatorPhone,
          studentCoordinatorEmail,
          facultyCoordinatorName,
          facultyCoordinatorPhone,
          facultyCoordinatorEmail,
          festEmail,
          collegeEmail,
          collegeAddress,
        },
      });
    } else {
      // Create new
      contactInfo = await db.contactInfo.create({
        data: {
          studentCoordinatorName,
          studentCoordinatorPhone,
          studentCoordinatorEmail,
          facultyCoordinatorName,
          facultyCoordinatorPhone,
          facultyCoordinatorEmail,
          festEmail,
          collegeEmail,
          collegeAddress,
        },
      });
    }

    return NextResponse.json({
      message: 'Contact info updated successfully',
      contactInfo,
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}
