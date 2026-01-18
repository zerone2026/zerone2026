import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all sponsors
export async function GET(request: NextRequest) {
  try {
    const sponsors = await db.sponsor.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ sponsors });
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}

// POST - Create new sponsor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logoUrl, websiteUrl, type, eventName } = body;

    const sponsor = await db.sponsor.create({
      data: {
        name,
        logoUrl,
        websiteUrl,
        type,
        eventName: type === 'EVENT_SPONSOR' ? eventName : null,
      },
    });

    return NextResponse.json({
      message: 'Sponsor created successfully',
      sponsor,
    });
  } catch (error) {
    console.error('Error creating sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to create sponsor' },
      { status: 500 }
    );
  }
}

// PUT - Update sponsor
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, logoUrl, websiteUrl, type, eventName } = body;

    const sponsor = await db.sponsor.update({
      where: { id },
      data: {
        name,
        logoUrl,
        websiteUrl,
        type,
        eventName: type === 'EVENT_SPONSOR' ? eventName : null,
      },
    });

    return NextResponse.json({
      message: 'Sponsor updated successfully',
      sponsor,
    });
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to update sponsor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete sponsor
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Sponsor ID is required' },
        { status: 400 }
      );
    }

    await db.sponsor.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to delete sponsor' },
      { status: 500 }
    );
  }
}
