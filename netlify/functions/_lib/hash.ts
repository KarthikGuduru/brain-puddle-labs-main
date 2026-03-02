import crypto from 'crypto';

export const sha256 = (value: string) =>
    crypto.createHash('sha256').update(value || '').digest('hex');

export const getLinkedInSlug = (url: string) => {
    const raw = String(url || '').trim();
    if (!raw) return '';

    try {
        const parsed = new URL(raw);
        const segments = parsed.pathname.split('/').filter(Boolean);
        const inIndex = segments.indexOf('in');
        const slug = inIndex >= 0 ? segments[inIndex + 1] : segments[segments.length - 1];
        return (slug || '').toLowerCase();
    } catch {
        const match = raw.match(/linkedin\.com\/in\/([^/?#]+)/i);
        return (match?.[1] || '').toLowerCase();
    }
};

export const maskLinkedIn = (slug: string) => {
    const normalized = String(slug || '').trim();
    if (!normalized) return '';
    if (normalized.length <= 4) return `${normalized[0] || ''}***`;
    return `${normalized.slice(0, 2)}***${normalized.slice(-2)}`;
};
