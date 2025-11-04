const cityCache: { data: NPCity[] | null; expiresAt: number } = { data: null, expiresAt: 0 };
const warehouseCache = new Map<string, { data: NPWarehouse[]; expiresAt: number }>();

export interface NPCity {
  Ref: string;
  Description: string;
}

export interface NPWarehouse {
  Ref: string;
  Description: string;
  TypeOfWarehouse?: string;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getCachedCities(): NPCity[] | null {
  if (Date.now() > cityCache.expiresAt) {
    cityCache.data = null;
  }
  return cityCache.data;
}

export function setCachedCities(cities: NPCity[]) {
  cityCache.data = cities;
  cityCache.expiresAt = Date.now() + DAY_IN_MS;
}

export function getCachedWarehouses(cacheKey: string): NPWarehouse[] | null {
  const entry = warehouseCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    warehouseCache.delete(cacheKey);
    return null;
  }
  return entry.data;
}

export function setCachedWarehouses(cacheKey: string, data: NPWarehouse[]) {
  warehouseCache.set(cacheKey, { data, expiresAt: Date.now() + DAY_IN_MS });
}
