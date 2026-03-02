import crypto from 'crypto';

export const nowIso = () => new Date().toISOString();

export const makeId = (prefix: string) => {
    const random = crypto.randomBytes(9).toString('base64url');
    return `${prefix}_${random}`;
};

export const getClientIp = (headers: Record<string, string | undefined>) => {
    const forwarded = headers['x-forwarded-for'] || '';
    const first = forwarded.split(',').map((s) => s.trim()).find(Boolean);
    return first || headers['client-ip'] || '';
};

export const clampScore = (value: unknown) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return 50;
    return Math.max(0, Math.min(100, Math.round(parsed)));
};

export const parseJsonBody = <T = Record<string, unknown>>(raw: string | null): T => {
    if (!raw) return {} as T;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return {} as T;
    }
};

export const escapeHtml = (value: string) =>
    String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
