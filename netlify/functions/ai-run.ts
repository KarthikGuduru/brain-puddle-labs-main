import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { getLinkedInSlug, sha256 } from './_lib/hash';
import { localStore } from './_lib/local-store';
import { clampScore, makeId, nowIso, parseJsonBody } from './_lib/utils';

interface AiRunPayload {
    inputType?: string;
    linkedinUrl?: string;
    inputCharCount?: number;
    score?: number;
    tier?: string;
    analysisLatencyMs?: number;
    imageSource?: string;
    r2_object_key?: string;
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const body = parseJsonBody<AiRunPayload>(event.body);
        const aiRunId = makeId('run');
        const createdAt = nowIso();
        const inputType = String(body.inputType || 'text');
        const linkedinUrl = String(body.linkedinUrl || '');
        const linkedinSlug = getLinkedInSlug(linkedinUrl);
        const linkedinHash = sha256(linkedinSlug || linkedinUrl);
        const inputCharCount = Math.max(0, Number(body.inputCharCount || 0));
        const score = clampScore(body.score);
        const tier = String(body.tier || '⚔️ AI-Resistant');
        const analysisLatencyMs = Math.max(0, Number(body.analysisLatencyMs || 0));
        const imageSource = String(body.imageSource || 'unknown');
        const r2ObjectKey = body.r2_object_key ? String(body.r2_object_key) : null;

        if (!isD1Configured()) {
            localStore.aiRuns.unshift({
                id: aiRunId,
                createdAt,
                inputType,
                linkedinSlug,
                linkedinHash,
                inputCharCount,
                score,
                tier,
                analysisLatencyMs,
                imageSource,
                shareClicked: 0,
                r2ObjectKey: r2ObjectKey
            });
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiRunId })
            };
        }

        await d1Query(
            `INSERT INTO ai_runs
             (id, created_at, input_type, linkedin_slug, linkedin_hash, input_char_count, score, tier, analysis_latency_ms, image_source, share_clicked, r2_object_key)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
            [
                aiRunId,
                createdAt,
                inputType,
                linkedinSlug,
                linkedinHash,
                inputCharCount,
                score,
                tier,
                analysisLatencyMs,
                imageSource,
                r2ObjectKey
            ]
        );

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aiRunId })
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to persist ai run', details: message })
        };
    }
};
