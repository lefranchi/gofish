export interface WeatherData {
  temperature: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  cloudCover: number;
  description: string;
}

export interface TideData {
  height: number;
  type: 'high' | 'low';
  time: Date;
}

export interface MoonPhaseData {
  phase: string;
  illumination: number;
  solunarScore: number;
}

export interface FishingAssessment {
  score: number;
  recommendation: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
  factors: {
    pressure: number;
    wind: number;
    temperature: number;
    moonPhase: number;
    tide?: number;
  };
  details: string[];
}

export interface Fishery {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  id: number;
  fisheryId: number;
  date: Date;
  weather: WeatherData | null;
  tide: TideData | null;
  moonPhase: MoonPhaseData | null;
  assessment: FishingAssessment | null;
  createdAt: Date;
}
