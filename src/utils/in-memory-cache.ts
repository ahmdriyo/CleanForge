type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const DEFAULT_CACHE_TTL_MS = 60_000;
const cacheStore = new Map<string, CacheEntry<unknown>>();

export const setCache = <T>(key: string, data: T, ttl = DEFAULT_CACHE_TTL_MS) => {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + Math.max(0, ttl),
  });
};

export const getCache = <T>(key: string): T | undefined => {
  const entry = cacheStore.get(key);

  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt <= Date.now()) {
    cacheStore.delete(key);
    return undefined;
  }

  return entry.data as T;
};

export const deleteCache = (key: string) => {
  cacheStore.delete(key);
};

export const deleteCacheByPrefix = (prefix: string) => {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
};
