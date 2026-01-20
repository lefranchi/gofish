import { SearchResult } from '@/types';

// Interface para cache em memória (para desenvolvimento)
interface CacheEntry {
  data: SearchResult;
  timestamp: number;
}

// Cache em memória com TTL de 24 horas
const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas em ms

const generateCacheKey = (fisheryId: number, date: Date): string => {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `fishing-${fisheryId}-${dateStr}`;
};

export const getCachedSearch = (fisheryId: number, date: Date): SearchResult | null => {
  const key = generateCacheKey(fisheryId, date);
  const entry = memoryCache.get(key);

  if (!entry) {
    return null;
  }

  // Verificar se o cache expirou
  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCachedSearch = (
  fisheryId: number,
  date: Date,
  result: SearchResult
): void => {
  const key = generateCacheKey(fisheryId, date);
  memoryCache.set(key, {
    data: result,
    timestamp: Date.now(),
  });
};

export const clearCache = (): void => {
  memoryCache.clear();
};

export const clearExpiredCache = (): void => {
  const now = Date.now();
  const expiredKeys: string[] = [];

  memoryCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      expiredKeys.push(key);
    }
  });

  expiredKeys.forEach((key) => memoryCache.delete(key));
};

// Função para serializar dados para armazenamento
export const serializeSearchResult = (result: SearchResult): string => {
  return JSON.stringify(result);
};

// Função para desserializar dados do armazenamento
export const deserializeSearchResult = (data: string): SearchResult => {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    date: new Date(parsed.date),
    createdAt: new Date(parsed.createdAt),
  };
};
