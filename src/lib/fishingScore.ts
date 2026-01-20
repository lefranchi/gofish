import { WeatherData, TideData, MoonPhaseData, FishingAssessment } from '@/types';

interface ScoringFactors {
  weather: WeatherData | null;
  tide: TideData | null;
  moonPhase: MoonPhaseData | null;
}

const PRESSURE_IDEAL_MIN = 1012;
const PRESSURE_IDEAL_MAX = 1017;
const WIND_IDEAL_MAX = 20; // km/h
const TEMPERATURE_IDEAL_MIN = 15; // °C
const TEMPERATURE_IDEAL_MAX = 28; // °C

const scorePressure = (pressure: number): { score: number; factor: string } => {
  // Pressão entre 1012-1017 mbar é ideal
  if (pressure >= PRESSURE_IDEAL_MIN && pressure <= PRESSURE_IDEAL_MAX) {
    return { score: 100, factor: 'Pressão ideal' };
  }

  // Pressão em queda é muito boa
  if (pressure < PRESSURE_IDEAL_MIN) {
    return { score: 90, factor: 'Pressão em queda (muito boa)' };
  }

  // Pressão muito alta é ruim
  if (pressure > 1025) {
    return { score: 40, factor: 'Pressão muito alta (ruim)' };
  }

  // Pressão alta é regular
  return { score: 60, factor: 'Pressão alta (regular)' };
};

const scoreWind = (windSpeed: number): { score: number; factor: string } => {
  // Vento calmo é ideal
  if (windSpeed <= 10) {
    return { score: 100, factor: 'Vento calmo' };
  }

  // Vento fraco a moderado é bom
  if (windSpeed <= WIND_IDEAL_MAX) {
    return { score: 85, factor: 'Vento moderado' };
  }

  // Vento forte é ruim
  if (windSpeed > 30) {
    return { score: 30, factor: 'Vento muito forte' };
  }

  // Vento moderadamente forte é regular
  return { score: 60, factor: 'Vento forte' };
};

const scoreTemperature = (temperature: number): { score: number; factor: string } => {
  // Temperatura ideal
  if (temperature >= TEMPERATURE_IDEAL_MIN && temperature <= TEMPERATURE_IDEAL_MAX) {
    return { score: 100, factor: 'Temperatura ideal' };
  }

  // Temperatura fria (mas aceitável)
  if (temperature >= 10 && temperature < TEMPERATURE_IDEAL_MIN) {
    return { score: 70, factor: 'Temperatura fria' };
  }

  // Temperatura quente (mas aceitável)
  if (temperature > TEMPERATURE_IDEAL_MAX && temperature <= 32) {
    return { score: 75, factor: 'Temperatura quente' };
  }

  // Temperatura muito fria
  if (temperature < 10) {
    return { score: 40, factor: 'Temperatura muito fria' };
  }

  // Temperatura muito quente
  return { score: 30, factor: 'Temperatura muito quente' };
};

const scoreMoonPhase = (moonPhase: MoonPhaseData | null): { score: number; factor: string } => {
  if (!moonPhase) {
    return { score: 50, factor: 'Dados da lua indisponíveis' };
  }

  // Usa o score solunar já calculado
  if (moonPhase.solunarScore >= 85) {
    return { score: 100, factor: `${moonPhase.phase} (excelente)` };
  }

  if (moonPhase.solunarScore >= 70) {
    return { score: 85, factor: `${moonPhase.phase} (boa)` };
  }

  if (moonPhase.solunarScore >= 60) {
    return { score: 70, factor: `${moonPhase.phase} (regular)` };
  }

  return { score: 50, factor: `${moonPhase.phase} (fraca)` };
};

const scoreTide = (tide: TideData | null): { score: number; factor: string } => {
  if (!tide) {
    return { score: 0, factor: 'Dados de maré indisponíveis' };
  }

  // Maré em movimento é melhor que maré parada
  // Maré alta é geralmente melhor para pesca
  if (tide.type === 'high') {
    return { score: 90, factor: 'Maré alta' };
  }

  return { score: 70, factor: 'Maré baixa' };
};

export const calculateFishingScore = (factors: ScoringFactors): FishingAssessment => {
  const scores: { score: number; factor: string }[] = [];
  const details: string[] = [];

  // Score de pressão (peso: 25%)
  if (factors.weather) {
    const pressureScore = scorePressure(factors.weather.pressure);
    scores.push({ score: pressureScore.score * 0.25, factor: pressureScore.factor });
    details.push(`Pressão: ${factors.weather.pressure} hPa - ${pressureScore.factor}`);
  }

  // Score de vento (peso: 20%)
  if (factors.weather) {
    const windScore = scoreWind(factors.weather.windSpeed);
    scores.push({ score: windScore.score * 0.2, factor: windScore.factor });
    details.push(`Vento: ${factors.weather.windSpeed} km/h ${factors.weather.windDirection} - ${windScore.factor}`);
  }

  // Score de temperatura (peso: 15%)
  if (factors.weather) {
    const tempScore = scoreTemperature(factors.weather.temperature);
    scores.push({ score: tempScore.score * 0.15, factor: tempScore.factor });
    details.push(`Temperatura: ${factors.weather.temperature}°C - ${tempScore.factor}`);
  }

  // Score de fase da lua (peso: 25%)
  const moonScore = scoreMoonPhase(factors.moonPhase);
  scores.push({ score: moonScore.score * 0.25, factor: moonScore.factor });
  details.push(`Lua: ${moonScore.factor}`);

  // Score de maré (peso: 15%, apenas se disponível)
  if (factors.tide) {
    const tideScore = scoreTide(factors.tide);
    scores.push({ score: tideScore.score * 0.15, factor: tideScore.factor });
    details.push(`Maré: ${tideScore.factor}`);
  }

  // Calcular score total
  const totalScore = Math.round(scores.reduce((acc, s) => acc + s.score, 0));

  // Determinar recomendação
  let recommendation: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
  if (totalScore >= 80) {
    recommendation = 'Excelente';
  } else if (totalScore >= 60) {
    recommendation = 'Boa';
  } else if (totalScore >= 40) {
    recommendation = 'Regular';
  } else {
    recommendation = 'Ruim';
  }

  return {
    score: totalScore,
    recommendation,
    factors: {
      pressure: factors.weather ? scorePressure(factors.weather.pressure).score : 0,
      wind: factors.weather ? scoreWind(factors.weather.windSpeed).score : 0,
      temperature: factors.weather ? scoreTemperature(factors.weather.temperature).score : 0,
      moonPhase: moonScore.score,
      tide: factors.tide ? scoreTide(factors.tide).score : undefined,
    },
    details,
  };
};

export const getRecommendationColor = (recommendation: string): string => {
  switch (recommendation) {
    case 'Excelente':
      return '#4caf50'; // Green
    case 'Boa':
      return '#2196f3'; // Blue
    case 'Regular':
      return '#ff9800'; // Orange
    case 'Ruim':
      return '#f44336'; // Red
    default:
      return '#9e9e9e'; // Gray
  }
};

export const getRecommendationEmoji = (recommendation: string): string => {
  switch (recommendation) {
    case 'Excelente':
      return '🎣✨';
    case 'Boa':
      return '🎣👍';
    case 'Regular':
      return '🎣😐';
    case 'Ruim':
      return '🎣❌';
    default:
      return '🎣';
  }
};
