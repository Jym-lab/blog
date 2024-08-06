type CacheKey = string;
type CacheValue = any;

const cache: { [key: CacheKey]: CacheValue } = {};

export function resultCache<T>(key: CacheKey, fn: () => T): T {
    if (cache[key] !== undefined) {
        return cache[key];
    }

    const result = fn();
    cache[key] = result;
    return result;
}