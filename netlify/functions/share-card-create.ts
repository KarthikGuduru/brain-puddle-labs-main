import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { getEnv, resolveSiteOrigin } from './_lib/env';
import { localStore } from './_lib/local-store';
import { checkRateLimit } from './_lib/ratelimit';
import { uploadCardImage } from './_lib/r2';
import { verifyTurnstileToken } from './_lib/turnstile';
import { clampScore, getClientIp, makeId, nowIso, parseJsonBody } from './_lib/utils';

interface ShareCreatePayload {
    aiRunId?: string | null;
    name?: string;
    title?: string;
    score?: number;
    tier?: string;
    cardImageBase64?: string;
    turnstileToken?: string;
}

const retentionDays = () => Math.max(1, Number(getEnv('RETENTION_DAYS') || 180));

const toExpiry = () => {
    const ms = retentionDays() * 24 * 60 * 60 * 1000;
    return new Date(Date.now() + ms).toISOString();
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const body = parseJsonBody<ShareCreatePayload>(event.body);
        const aiRunId = body.aiRunId ? String(body.aiRunId) : null;
        const name = String(body.name || '').trim() || 'Professional User';
        const title = String(body.title || '').trim() || 'Digital Professional';
        const score = clampScore(body.score);
        const tier = String(body.tier || '').trim() || '⚔️ AI-Resistant';
        const cardImageBase64 = String(body.cardImageBase64 || '').trim();
        const turnstileToken = String(body.turnstileToken || '').trim();

        if (!cardImageBase64) {
            return { statusCode: 400, body: JSON.stringify({ error: 'cardImageBase64 is required' }) };
        }

        const headers = event.headers as Record<string, string | undefined>;
        const clientIp = getClientIp(headers);
        const rateLimit = await checkRateLimit(`share-card-create:${clientIp}`, 20, 60 * 10);
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

        const shareId = makeId('sh').replace(/^sh_/, '');
        const createdAt = nowIso();
        const expiresAt = toExpiry();
        const { objectKey, publicUrl } = await uploadCardImage(cardImageBase64, shareId);
        const origin = resolveSiteOrigin(headers);
        const shareUrl = `${origin}/s/${shareId}`;

        if (!isD1Configured()) {
            localStore.sharedCards.set(shareId, {
                id: shareId,
                createdAt,
                aiRunId,
                name,
                title,
                score,
                tier,
                imageUrl: publicUrl,
                expiresAt
            });
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shareId, shareUrl })
            };
        }

        await d1Query(
            `INSERT INTO shared_cards
             (id, created_at, ai_run_id, name, title, score, tier, r2_object_key, public_image_url, expires_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [shareId, createdAt, aiRunId, name, title, score, tier, objectKey, publicUrl, expiresAt]
        );

        if (aiRunId) {
            try {
                await d1Query(
                    `UPDATE ai_runs SET share_clicked = 1, r2_object_key = COALESCE(r2_object_key, ?) WHERE id = ?`,
                    [objectKey, aiRunId]
                );
            } catch {
                // r2_object_key column may not exist yet — still update share_clicked
                await d1Query(
                    `UPDATE ai_runs SET share_clicked = 1 WHERE id = ?`,
                    [aiRunId]
                );
            }
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shareId, shareUrl })
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create shared card', details: message })
        };
    }
};
