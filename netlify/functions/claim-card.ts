import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { getLinkedInSlug, sha256 } from './_lib/hash';
import { localStore } from './_lib/local-store';
import { checkRateLimit } from './_lib/ratelimit';
import { verifyTurnstileToken } from './_lib/turnstile';
import { getClientIp, makeId, nowIso, parseJsonBody } from './_lib/utils';

interface ClaimPayload {
    fullName?: string;
    linkedinUrl?: string;
    deliveryAddress?: string;
    aiRunId?: string | null;
    turnstileToken?: string;
}

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
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const body = parseJsonBody<ClaimPayload>(event.body);
        const fullName = String(body.fullName || '').trim();
        const linkedinUrl = String(body.linkedinUrl || '').trim();
        const deliveryAddress = String(body.deliveryAddress || '').trim();
        const aiRunId = body.aiRunId ? String(body.aiRunId) : null;
        const turnstileToken = String(body.turnstileToken || '').trim();

        if (!fullName || !linkedinUrl || !deliveryAddress) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }

        const headers = event.headers as Record<string, string | undefined>;
        const clientIp = getClientIp(headers);
        const userAgent = headers['user-agent'] || '';
        const linkedinSlug = getLinkedInSlug(linkedinUrl);
        const linkedinHash = sha256(linkedinSlug || linkedinUrl);
        const ipHash = sha256(clientIp);
        const uaHash = sha256(userAgent);

        const rateLimit = await checkRateLimit(`claim-card:${ipHash}`, 6, 60 * 10);
        if (!rateLimit.allowed) {
            return {
                statusCode: 429,
                body: JSON.stringify({ error: 'RATE_LIMITED', retryAfterSec: rateLimit.retryAfterSec })
            };
        }

        const turnstile = await verifyTurnstileToken(turnstileToken, clientIp);
        if (!turnstile.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'TURNSTILE_FAILED', details: turnstile.errors })
            };
        }

        const claimId = makeId('claim');
        const createdAt = nowIso();

        if (!isD1Configured()) {
            if (localStore.inventory.remaining <= 0) {
                localStore.claims.unshift({
                    id: claimId,
                    createdAt,
                    linkedinSlug,
                    linkedinHash,
                    aiRunId,
                    status: 'sold_out'
                });
                return {
                    statusCode: 409,
                    body: JSON.stringify({ error: 'SOLD_OUT', remainingCount: 0 })
                };
            }

            localStore.inventory.claimed += 1;
            localStore.inventory.remaining -= 1;
            localStore.inventory.updatedAt = createdAt;
            localStore.claims.unshift({
                id: claimId,
                createdAt,
                linkedinSlug,
                linkedinHash,
                aiRunId,
                status: 'accepted'
            });
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claimId, remainingCount: localStore.inventory.remaining })
            };
        }

        await ensureInventoryRow();
        const { rows: updatedRows } = await d1Query(
            `UPDATE inventory
             SET claimed = claimed + 1,
                 remaining = remaining - 1,
                 updated_at = ?
             WHERE key = 'physical_card' AND remaining > 0
             RETURNING remaining`,
            [createdAt]
        );

        if (updatedRows.length === 0) {
            await d1Query(
                `INSERT INTO claim_submissions
                 (id, created_at, full_name_enc, delivery_address_enc, linkedin_slug, linkedin_hash, ai_run_id, ip_hash, ua_hash, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'sold_out')`,
                [
                    claimId,
                    createdAt,
                    fullName,
                    deliveryAddress,
                    linkedinSlug,
                    linkedinHash,
                    aiRunId,
                    ipHash,
                    uaHash
                ]
            );
            return {
                statusCode: 409,
                body: JSON.stringify({ error: 'SOLD_OUT', remainingCount: 0 })
            };
        }

        await d1Query(
            `INSERT INTO claim_submissions
             (id, created_at, full_name_enc, delivery_address_enc, linkedin_slug, linkedin_hash, ai_run_id, ip_hash, ua_hash, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'accepted')`,
            [
                claimId,
                createdAt,
                fullName,
                deliveryAddress,
                linkedinSlug,
                linkedinHash,
                aiRunId,
                ipHash,
                uaHash
            ]
        );

        const remaining = Number(updatedRows[0]?.remaining ?? 0);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claimId, remainingCount: remaining })
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to submit claim', details: message })
        };
    }
};
