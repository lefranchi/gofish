import axios from 'axios';
import { WeatherData } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface OpenWeatherResponse {
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  weather: Array<{
    description: string;
  }>;
}

const degreeToDirection = (degree: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

export const getWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  if (!API_KEY) {
    console.warn('OpenWeatherMap API key not configured');
    return null;
  }

  try {
    const response = await axios.get<OpenWeatherResponse>(
      `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;

    return {
      temperature: Math.round(data.main.temp),
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: degreeToDirection(data.wind.deg),
      humidity: data.main.humidity,
      cloudCover: data.clouds.all,
      description: data.weather[0]?.description || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getWeatherForecast = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  if (!API_KEY) {
    console.warn('OpenWeatherMap API key not configured');
    return null;
  }

  try {
    const response = await axios.get<OpenWeatherResponse>(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    // Find the forecast closest to the requested date
    const forecasts = response.data;

    const data = forecasts as unknown as OpenWeatherResponse;

    return {
      temperature: Math.round(data.main.temp),
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6),
      windDirection: degreeToDirection(data.wind.deg),
      humidity: data.main.humidity,
      cloudCover: data.clouds.all,
      description: data.weather[0]?.description || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
};
