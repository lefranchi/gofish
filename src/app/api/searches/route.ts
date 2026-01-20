import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const fisheryId = request.nextUrl.searchParams.get('fisheryId');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where: any = { userId: parseInt(userId) };
    if (fisheryId) {
      where.fisheryId = parseInt(fisheryId);
    }

    const searches = await prisma.search.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 50,
    });

    return NextResponse.json(searches);
  } catch (error) {
    console.error('Error fetching searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch searches' },
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
    const {
      fisheryId,
      date,
      temperature,
      pressure,
      windSpeed,
      windDirection,
      humidity,
      cloudCover,
      tideHeight,
      tideType,
      moonPhase,
      solunarScore,
      fishingScore,
      recommendation,
    } = body;

    if (!fisheryId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const search = await prisma.search.create({
      data: {
        fisheryId: parseInt(fisheryId),
        userId: parseInt(userId),
        date: new Date(date),
        temperature: temperature ? parseFloat(temperature) : null,
        pressure: pressure ? parseFloat(pressure) : null,
        windSpeed: windSpeed ? parseFloat(windSpeed) : null,
        windDirection,
        humidity: humidity ? parseFloat(humidity) : null,
        cloudCover: cloudCover ? parseFloat(cloudCover) : null,
        tideHeight: tideHeight ? parseFloat(tideHeight) : null,
        tideType,
        moonPhase,
        solunarScore: solunarScore ? parseFloat(solunarScore) : null,
        fishingScore: fishingScore ? parseFloat(fishingScore) : null,
        recommendation,
      },
    });

    return NextResponse.json(search, { status: 201 });
  } catch (error) {
    console.error('Error creating search:', error);
    return NextResponse.json(
      { error: 'Failed to create search' },
      { status: 500 }
    );
  }
}
