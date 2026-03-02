import { Handler } from '@netlify/functions';

const decodeSharePayload = (token: string) => {
    if (!token) return null;
    try {
        const normalized = token.trim();
        const base64 = normalized.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4 || 4)) % 4);
        const jsonString = Buffer.from(padded, 'base64').toString('utf8');
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed as Record<string, string | number>;
    } catch {
        return null;
    }
};

const clampScore = (rawValue: string | number) => {
    const value = Number(rawValue);
    if (Number.isNaN(value)) return 50;
    return Math.max(0, Math.min(100, Math.round(value)));
};

const getPayloadValue = (
    payload: Record<string, string | number> | null,
    keys: string[],
    fallback = ''
) => {
    if (!payload) return fallback;
    for (const key of keys) {
        const value = payload[key];
        if (value !== undefined && value !== null && String(value).trim()) {
            return String(value).trim();
        }
    }
    return fallback;
};

const escapeHtml = (value: string) =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const resolveSiteOrigin = (headers: Record<string, string | undefined>) => {
    const configuredOrigin = (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || process.env.URL || '').trim();
    if (configuredOrigin) {
        try {
            return new URL(configuredOrigin).origin;
        } catch {
            return configuredOrigin.replace(/\/+$/, '');
        }
    }

    const forwardedProto = headers['x-forwarded-proto'] || 'https';
    const forwardedHost = headers['x-forwarded-host'] || headers.host || '';
    if (forwardedHost) {
        return `${forwardedProto}://${forwardedHost}`;
    }

    return 'https://brainpuddle.com';
};

const sanitizeOgImageUrl = (imageUrl: string, origin: string) => {
    const fallbackImage = `${origin}/consultation-hero.png`;
    if (!imageUrl) return fallbackImage;
    try {
        const parsed = new URL(String(imageUrl));
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.toString();
        }
    } catch {
        return fallbackImage;
    }
    return fallbackImage;
};

const buildShareCardHtml = ({
    token,
    origin,
    payload
}: {
    token: string;
    origin: string;
    payload: Record<string, string | number> | null;
}) => {
    const name = getPayloadValue(payload, ['n', 'name'], 'Professional User');
    const roleTitle = getPayloadValue(payload, ['t', 'title'], 'Digital Professional');
    const tier = getPayloadValue(payload, ['r', 'tier'], '⚔️ AI-Resistant');
    const replaceabilityScore = clampScore(getPayloadValue(payload, ['s', 'score'], '50'));
    const resilienceScore = Math.max(0, 100 - replaceabilityScore);
    const imageUrl = sanitizeOgImageUrl(getPayloadValue(payload, ['i', 'image', 'imageUrl'], ''), origin);

    const encodedToken = encodeURIComponent(token);
    const destinationPath = `/ai-score/shared/${encodedToken}`;
    const shareUrl = `${origin}/api/share-card?d=${encodedToken}`;
    const ogTitle = `${name} | BrainPuddle AI Score`;
    const ogDescription = `${name} (${roleTitle}) scored ${replaceabilityScore}/100 Replaceability Index and ${resilienceScore}/100 AI Resilience (${tier}).`;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(ogTitle)}</title>
  <meta name="description" content="${escapeHtml(ogDescription)}" />
  <link rel="canonical" href="${escapeHtml(shareUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="BrainPuddle" />
  <meta property="og:title" content="${escapeHtml(ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(ogDescription)}" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  <meta http-equiv="refresh" content="0; url=${escapeHtml(destinationPath)}" />
</head>
<body style="font-family: Inter, Arial, sans-serif; background: #f9f9f9; color: #111; padding: 2rem;">
  <h1 style="font-size: 1.3rem; margin-bottom: 0.6rem;">Opening shared AI Score...</h1>
  <p>If you are not redirected, <a href="${escapeHtml(destinationPath)}">open the exact shared result</a>.</p>
  <script>
    (function () {
      var destination = ${JSON.stringify(destinationPath)};
      window.location.replace(destination);
    })();
  </script>
</body>
</html>`;
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    const token = String(event.queryStringParameters?.d || '').trim();
    const origin = resolveSiteOrigin(event.headers as Record<string, string | undefined>);

    if (!token) {
        return {
            statusCode: 302,
            headers: {
                Location: `${origin}/ai-score/shared`
            },
            body: ''
        };
    }

    const payload = decodeSharePayload(token);
    const html = buildShareCardHtml({ token, origin, payload });

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300, s-maxage=300'
        },
        body: html
    };
};
