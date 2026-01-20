import { MoonPhaseData } from '@/types';

// Algoritmo para calcular a fase da lua
// Baseado no ciclo lunar de 29.53 dias
const LUNAR_CYCLE = 29.53058867;
const KNOWN_NEW_MOON = new Date(2000, 0, 6); // 6 de janeiro de 2000 foi lua nova

const getMoonAge = (date: Date): number => {
  const timeDiff = date.getTime() - KNOWN_NEW_MOON.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  return daysDiff % LUNAR_CYCLE;
};

const getMoonPhaseData = (moonAge: number): { phase: string; illumination: number } => {
  const illuminationValue = (Math.cos(Math.PI * (2 * moonAge) / LUNAR_CYCLE) + 1) / 2;
  const phasePercentage = (moonAge / LUNAR_CYCLE) * 100;

  let phase: string;

  if (phasePercentage < 6.25) {
    phase = 'Lua Nova';
  } else if (phasePercentage < 18.75) {
    phase = 'Crescente';
  } else if (phasePercentage < 31.25) {
    phase = 'Quarto Crescente';
  } else if (phasePercentage < 43.75) {
    phase = 'Crescente';
  } else if (phasePercentage < 56.25) {
    phase = 'Lua Cheia';
  } else if (phasePercentage < 68.75) {
    phase = 'Minguante';
  } else if (phasePercentage < 81.25) {
    phase = 'Quarto Minguante';
  } else if (phasePercentage < 93.75) {
    phase = 'Minguante';
  } else {
    phase = 'Lua Nova';
  }

  return {
    phase,
    illumination: Math.round(illuminationValue * 100),
  };
};

const calculateSolunarScore = (moonAge: number): number => {
  // Períodos maiores: quando a lua está no zênite (acima) ou nadir (abaixo)
  // Períodos menores: no nascer e pôr da lua
  
  // Simplificado: score baseado na iluminação e fase
  
  // Lua nova e lua cheia têm scores mais altos
  const phasePercentage = (moonAge / LUNAR_CYCLE) * 100;
  
  let baseScore = 0;
  
  if (phasePercentage < 6.25 || phasePercentage > 93.75) {
    // Lua nova
    baseScore = 90;
  } else if (phasePercentage > 43.75 && phasePercentage < 56.25) {
    // Lua cheia
    baseScore = 85;
  } else if (phasePercentage > 18.75 && phasePercentage < 31.25) {
    // Quarto crescente
    baseScore = 70;
  } else if (phasePercentage > 68.75 && phasePercentage < 81.25) {
    // Quarto minguante
    baseScore = 70;
  } else {
    // Fases intermediárias
    baseScore = 60;
  }
  
  return baseScore;
};

export const getMoonPhaseInfo = (date: Date): MoonPhaseData => {
  const moonAge = getMoonAge(date);
  const { phase, illumination } = getMoonPhaseData(moonAge);
  const solunarScore = calculateSolunarScore(moonAge);

  return {
    phase,
    illumination,
    solunarScore,
  };
};

export const isSolunarPeak = (date: Date): boolean => {
  // Verifica se é um período maior de atividade solunar
  // Simplificado: retorna true para lua nova e lua cheia
  const moonAge = getMoonAge(date);
  const phasePercentage = (moonAge / LUNAR_CYCLE) * 100;

  // Períodos maiores: 2 horas antes e depois do zênite/nadir
  // Aproximadamente 12 horas de diferença entre zênite e nadir
  
  return (
    (phasePercentage < 6.25 || phasePercentage > 93.75) || // Lua nova
    (phasePercentage > 43.75 && phasePercentage < 56.25) // Lua cheia
  );
};

export const getSolunarTimes = (date: Date): { peak1: Date; peak2: Date } => {
  // Retorna os dois períodos maiores de atividade solunar do dia
  // Aproximadamente 12 horas de diferença
  
  const peak1 = new Date(date);
  peak1.setHours(6, 0, 0, 0); // Primeiro pico (aproximado)
  
  const peak2 = new Date(date);
  peak2.setHours(18, 0, 0, 0); // Segundo pico (aproximado)
  
  return { peak1, peak2 };
};
