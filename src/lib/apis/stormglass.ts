import axios from 'axios';
import { TideData } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_STORMGLASS_API_KEY;
const BASE_URL = 'https://api.stormglass.io/v2';

interface StormglassTideResponse {
  data: Array<{
    time: string;
    tide: number;
    type: string;
  }>;
}

export const getTideData = async (
  latitude: number,
  longitude: number,
  date: Date
): Promise<TideData | null> => {
  if (!API_KEY) {
    console.warn('Stormglass API key not configured');
    return null;
  }

  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const response = await axios.get<StormglassTideResponse>(
      `${BASE_URL}/tide/extremes/point`,
      {
        params: {
          lat: latitude,
          lng: longitude,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    if (!response.data.data || response.data.data.length === 0) {
      return null;
    }

    // Get the first tide event of the day
    const tideEvent = response.data.data[0];
    const tideType = tideEvent.type === 'high' ? 'high' : 'low';

    return {
      height: tideEvent.tide,
      type: tideType,
      time: new Date(tideEvent.time),
    };
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return null;
  }
};

export const getTideDataForDay = async (
  latitude: number,
  longitude: number,
  date: Date
): Promise<TideData[]> => {
  if (!API_KEY) {
    console.warn('Stormglass API key not configured');
    return [];
  }

  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const response = await axios.get<StormglassTideResponse>(
      `${BASE_URL}/tide/extremes/point`,
      {
        params: {
          lat: latitude,
          lng: longitude,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    if (!response.data.data) {
      return [];
    }

    return response.data.data.map((event) => ({
      height: event.tide,
      type: event.type === 'high' ? 'high' : 'low',
      time: new Date(event.time),
    }));
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return [];
  }
};
