import { d1Query, isD1Configured } from './d1';
import { localStore } from './local-store';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSec: number;
}

export const checkRateLimit = async (
    key: string,
    maxPerWindow: number,
    windowSec: number
): Promise<RateLimitResult> => {
    const now = Date.now();
    const windowStartMs = Math.floor(now / (windowSec * 1000)) * windowSec * 1000;
    const windowStartIso = new Date(windowStartMs).toISOString();
    const cacheKey = `${key}:${windowStartMs}`;

    if (!isD1Configured()) {
        const existing = localStore.rateLimits.get(cacheKey);
        const count = (existing?.count || 0) + 1;
        localStore.rateLimits.set(cacheKey, { count, windowStartMs });
        const allowed = count <= maxPerWindow;
        return {
            allowed,
            remaining: Math.max(0, maxPerWindow - count),
            retryAfterSec: allowed ? 0 : Math.ceil((windowStartMs + windowSec * 1000 - now) / 1000)
        };
    }

    await d1Query(
        `INSERT INTO rate_limits (key, count, window_start, updated_at)
         VALUES (?, 1, ?, ?)
         ON CONFLICT(key) DO UPDATE SET
             count = count + 1,
             updated_at = excluded.updated_at`,
        [cacheKey, windowStartIso, new Date(now).toISOString()]
    );

    const { rows } = await d1Query(
        'SELECT count FROM rate_limits WHERE key = ? LIMIT 1',
        [cacheKey]
    );
    const count = Number(rows[0]?.count || 0);
    const allowed = count <= maxPerWindow;

    return {
        allowed,
        remaining: Math.max(0, maxPerWindow - count),
        retryAfterSec: allowed ? 0 : Math.ceil((windowStartMs + windowSec * 1000 - now) / 1000)
    };
};
