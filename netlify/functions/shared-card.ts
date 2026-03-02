import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { localStore } from './_lib/local-store';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const shareId = String(event.queryStringParameters?.id || '').trim();
        if (!shareId) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing share id' }) };
        }

        if (!isD1Configured()) {
            const entry = localStore.sharedCards.get(shareId);
            if (!entry) {
                return { statusCode: 404, body: JSON.stringify({ error: 'Shared card not found' }) };
            }
            if (new Date(entry.expiresAt).getTime() < Date.now()) {
                return { statusCode: 410, body: JSON.stringify({ error: 'Shared card expired' }) };
            }
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shareId: entry.id,
                    name: entry.name,
                    title: entry.title,
                    score: entry.score,
                    tier: entry.tier,
                    imageUrl: entry.imageUrl,
                    createdAt: entry.createdAt
                })
            };
        }

        const { rows } = await d1Query(
            `SELECT id, name, title, score, tier, public_image_url, created_at, expires_at
             FROM shared_cards WHERE id = ? LIMIT 1`,
            [shareId]
        );
        const row = rows[0];
        if (!row) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Shared card not found' }) };
        }
        if (new Date(String(row.expires_at || '')).getTime() < Date.now()) {
            return { statusCode: 410, body: JSON.stringify({ error: 'Shared card expired' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shareId: String(row.id),
                name: String(row.name),
                title: String(row.title),
                score: Number(row.score || 0),
                tier: String(row.tier),
                imageUrl: String(row.public_image_url),
                createdAt: String(row.created_at)
            })
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch shared card', details: message })
        };
    }
};
