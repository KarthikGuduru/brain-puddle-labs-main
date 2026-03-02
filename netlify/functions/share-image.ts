import { Handler } from '@netlify/functions';
import { d1Query, isD1Configured } from './_lib/d1';
import { localStore } from './_lib/local-store';
import { downloadCardImage, isR2Configured } from './_lib/r2';

const parseShareId = (event: Parameters<Handler>[0]) => {
    const fromQuery = String(event.queryStringParameters?.id || '').trim();
    const fromPath = (() => {
        const p = String(event.path || '');
        const marker = '/.netlify/functions/share-image/';
        const idx = p.indexOf(marker);
        if (idx === -1) return '';
        return decodeURIComponent(p.slice(idx + marker.length)).trim();
    })();
    return (fromQuery || fromPath).replace(/^\/+/, '');
};

const parseDataUrl = (dataUrl: string) => {
    const match = String(dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return null;
    return {
        contentType: match[1],
        body: Buffer.from(match[2], 'base64')
    };
};

const fetchImage = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Image fetch failed: ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return {
        body: buffer,
        contentType: response.headers.get('content-type') || 'image/png',
        cacheControl: response.headers.get('cache-control') || 'public, max-age=86400'
    };
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const shareId = parseShareId(event);
        if (!shareId) {
            return { statusCode: 400, body: 'Missing share id' };
        }

        if (!isD1Configured()) {
            const local = localStore.sharedCards.get(shareId);
            if (!local) {
                return { statusCode: 404, body: 'Not found' };
            }
            const data = parseDataUrl(local.imageUrl);
            if (data) {
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': data.contentType,
                        'Cache-Control': 'public, max-age=86400'
                    },
                    body: data.body.toString('base64'),
                    isBase64Encoded: true
                };
            }
            const fetched = await fetchImage(local.imageUrl);
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': fetched.contentType,
                    'Cache-Control': fetched.cacheControl
                },
                body: fetched.body.toString('base64'),
                isBase64Encoded: true
            };
        }

        const { rows } = await d1Query(
            `SELECT id, r2_object_key, public_image_url FROM shared_cards WHERE id = ? LIMIT 1`,
            [shareId]
        );
        const row = rows[0];
        if (!row) {
            return { statusCode: 404, body: 'Not found' };
        }

        const objectKey = String(row.r2_object_key || '').trim();
        const publicUrl = String(row.public_image_url || '').trim();

        if (isR2Configured() && objectKey) {
            const file = await downloadCardImage(objectKey);
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': file.contentType,
                    'Cache-Control': file.cacheControl
                },
                body: file.body.toString('base64'),
                isBase64Encoded: true
            };
        }

        if (!publicUrl) {
            return { statusCode: 404, body: 'Image unavailable' };
        }

        const data = parseDataUrl(publicUrl);
        if (data) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': data.contentType,
                    'Cache-Control': 'public, max-age=86400'
                },
                body: data.body.toString('base64'),
                isBase64Encoded: true
            };
        }

        const fetched = await fetchImage(publicUrl);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': fetched.contentType,
                'Cache-Control': fetched.cacheControl
            },
            body: fetched.body.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to resolve share image', details: message })
        };
    }
};

