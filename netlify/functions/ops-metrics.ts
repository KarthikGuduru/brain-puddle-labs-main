import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { getEnv } from './_lib/env';
import { maskLinkedIn } from './_lib/hash';
import { localStore } from './_lib/local-store';

const requireAdmin = (event: Parameters<Handler>[0]) => {
    const expected = getEnv('ADMIN_DASH_TOKEN');
    if (!expected) return true;
    const header = event.headers['x-admin-token'] || event.headers['authorization']?.replace(/^Bearer\s+/i, '');
    const query = event.queryStringParameters?.token;
    return [header, query].some((value) => String(value || '') === expected);
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    if (!requireAdmin(event)) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    try {
        if (!isD1Configured()) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    counters: {
                        visits: null,
                        aiRuns: localStore.aiRuns.length,
                        shares: localStore.sharedCards.size,
                        claims: localStore.claims.length,
                        remaining: localStore.inventory.remaining
                    },
                    recentClaims: localStore.claims.slice(0, 20).map((claim) => ({
                        id: claim.id,
                        createdAt: claim.createdAt,
                        linkedin: maskLinkedIn(claim.linkedinSlug),
                        status: claim.status
                    })),
                    recentShares: Array.from(localStore.sharedCards.values()).slice(0, 20).map((item) => ({
                        id: item.id,
                        createdAt: item.createdAt,
                        name: item.name,
                        score: item.score,
                        tier: item.tier
                    }))
                })
            };
        }

        const [inventory, aiRuns, shares, claims, recentClaims, recentShares] = await Promise.all([
            d1Query('SELECT remaining FROM inventory WHERE key = ? LIMIT 1', ['physical_card']),
            d1Query('SELECT COUNT(*) AS count FROM ai_runs'),
            d1Query('SELECT COUNT(*) AS count FROM shared_cards'),
            d1Query('SELECT COUNT(*) AS count FROM claim_submissions WHERE status = ?', ['accepted']),
            d1Query(
                `SELECT id, created_at, linkedin_slug, status
                 FROM claim_submissions
                 ORDER BY created_at DESC
                 LIMIT 20`
            ),
            d1Query(
                `SELECT id, created_at, name, score, tier
                 FROM shared_cards
                 ORDER BY created_at DESC
                 LIMIT 20`
            )
        ]);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                counters: {
                    visits: null,
                    aiRuns: Number(aiRuns.rows[0]?.count || 0),
                    shares: Number(shares.rows[0]?.count || 0),
                    claims: Number(claims.rows[0]?.count || 0),
                    remaining: Number(inventory.rows[0]?.remaining || 100)
                },
                recentClaims: recentClaims.rows.map((row) => ({
                    id: String(row.id),
                    createdAt: String(row.created_at),
                    linkedin: maskLinkedIn(String(row.linkedin_slug || '')),
                    status: String(row.status || '')
                })),
                recentShares: recentShares.rows.map((row) => ({
                    id: String(row.id),
                    createdAt: String(row.created_at),
                    name: String(row.name),
                    score: Number(row.score || 0),
                    tier: String(row.tier)
                }))
            })
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load ops metrics', details: message })
        };
    }
};
