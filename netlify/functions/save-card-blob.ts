import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { uploadCardImage } from './_lib/r2';
import { makeId, parseJsonBody } from './_lib/utils';

interface SaveBlobPayload {
    cardImageBase64?: string;
    aiRunId?: string;
}

/**
 * Receives the browser-rendered card blob (as a base64 data URL),
 * uploads it to R2, and links the object key to the ai_run row.
 * Called silently in the background — failure is non-critical.
 */
export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = parseJsonBody<SaveBlobPayload>(event.body);
        const cardImageBase64 = String(body.cardImageBase64 || '').trim();
        const aiRunId = body.aiRunId ? String(body.aiRunId).trim() : null;

        if (!cardImageBase64) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing cardImageBase64' }) };
        }

        const shareId = makeId('blob').replace(/^blob_/, '');
        const { objectKey } = await uploadCardImage(cardImageBase64, shareId);

        // Link to the specific ai_run if provided
        if (aiRunId && isD1Configured()) {
            try {
                await d1Query(
                    `UPDATE ai_runs SET r2_object_key = COALESCE(r2_object_key, ?) WHERE id = ?`,
                    [objectKey, aiRunId]
                );
            } catch {
                // Non-critical
            }
        }

        // Fallback: if no aiRunId, link to the most recent unlinked run
        if (!aiRunId && isD1Configured()) {
            try {
                await d1Query(
                    `UPDATE ai_runs SET r2_object_key = ?
                     WHERE id = (SELECT id FROM ai_runs WHERE r2_object_key IS NULL ORDER BY created_at DESC LIMIT 1)`,
                    [objectKey]
                );
            } catch {
                // Non-critical
            }
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: true, objectKey })
        };
    } catch (error: any) {
        console.error('save-card-blob error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save card blob' })
        };
    }
};
