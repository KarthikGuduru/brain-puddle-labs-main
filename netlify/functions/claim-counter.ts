import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { localStore } from './_lib/local-store';
import { nowIso } from './_lib/utils';

const DEFAULT_TOTAL = 100;

const ensureInventoryRow = async () => {
    await d1Query(
        `INSERT INTO inventory (key, total, claimed, remaining, updated_at)
         VALUES ('physical_card', ?, 0, ?, ?)
         ON CONFLICT(key) DO NOTHING`,
        [DEFAULT_TOTAL, DEFAULT_TOTAL, nowIso()]
    );
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        if (!isD1Configured()) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total: localStore.inventory.total,
                    claimed: localStore.inventory.claimed,
                    remaining: localStore.inventory.remaining,
                    updatedAt: localStore.inventory.updatedAt
                })
            };
        }

        await ensureInventoryRow();
        const { rows } = await d1Query(
            'SELECT total, claimed, remaining, updated_at FROM inventory WHERE key = ? LIMIT 1',
            ['physical_card']
        );
        const row = rows[0] || {};
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                total: Number(row.total || DEFAULT_TOTAL),
                claimed: Number(row.claimed || 0),
                remaining: Number(row.remaining ?? DEFAULT_TOTAL),
                updatedAt: String(row.updated_at || nowIso())
            })
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch claim counter', details: message })
        };
    }
};
