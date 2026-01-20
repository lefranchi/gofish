import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fisheries = await prisma.fishery.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(fisheries);
  } catch (error) {
    console.error('Error fetching fisheries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fisheries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, latitude, longitude } = body;

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fishery = await prisma.fishery.create({
      data: {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId: parseInt(userId),
      },
    });

    return NextResponse.json(fishery, { status: 201 });
  } catch (error) {
    console.error('Error creating fishery:', error);
    return NextResponse.json(
      { error: 'Failed to create fishery' },
      { status: 500 }
    );
  }
}
