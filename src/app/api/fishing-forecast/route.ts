import { NextRequest, NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/apis/openWeatherMap';
import { getTideData } from '@/lib/apis/stormglass';
import { getMoonPhaseInfo } from '@/lib/apis/moonPhase';
import { calculateFishingScore } from '@/lib/fishingScore';
import { getCachedSearch, setCachedSearch } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const date = new Date(searchParams.get('date') || new Date().toISOString());
    const fisheryId = parseInt(searchParams.get('fisheryId') || '0');

    // Validar parâmetros
    if (!latitude || !longitude || !fisheryId) {
      return NextResponse.json(
        { error: 'Missing required parameters: latitude, longitude, fisheryId' },
        { status: 400 }
      );
    }

    // Verificar cache
    const cachedResult = getCachedSearch(fisheryId, date);
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        fromCache: true,
      });
    }

    // Buscar dados das APIs
    const [weatherData, tideData, moonPhaseData] = await Promise.all([
      getWeatherData(latitude, longitude),
      getTideData(latitude, longitude, date),
      Promise.resolve(getMoonPhaseInfo(date)),
    ]);

    // Calcular score de pesca
    const assessment = calculateFishingScore({
      weather: weatherData,
      tide: tideData,
      moonPhase: moonPhaseData,
    });

    const result = {
      id: 0,
      fisheryId,
      date,
      weather: weatherData,
      tide: tideData,
      moonPhase: moonPhaseData,
      assessment,
      createdAt: new Date(),
    };

    // Armazenar em cache
    setCachedSearch(fisheryId, date, result);

    return NextResponse.json({
      ...result,
      fromCache: false,
    });
  } catch (error) {
    console.error('Error in fishing forecast API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fishing forecast' },
      { status: 500 }
    );
  }
}
