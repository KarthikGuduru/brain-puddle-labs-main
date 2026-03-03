import crypto from 'crypto';
import { getEnv, getRequiredEnv } from './env';

const normalizeKey = (rawKey: string) => {
    const trimmed = rawKey.trim();

    if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
        return Buffer.from(trimmed, 'hex');
    }

    try {
        const decoded = Buffer.from(trimmed, 'base64');
        if (decoded.length === 32) return decoded;
    } catch {
        // Fallback hash below.
    }

    // Deterministic fallback so any non-empty key still produces a valid 32-byte secret.
    return crypto.createHash('sha256').update(trimmed).digest();
};

const getKey = () => {
    const envKey = getEnv('CLAIMS_ENCRYPTION_KEY');
    return normalizeKey(envKey || 'fallback-brainpuddle-encryption-key-for-claims');
};

export const encryptText = (value: string) => {
    const key = getKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
        cipher.update(String(value || ''), 'utf8'),
        cipher.final()
    ]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
};

export const decryptText = (payload: string) => {
    const [ivB64, tagB64, bodyB64] = String(payload || '').split('.');
    if (!ivB64 || !tagB64 || !bodyB64) {
        throw new Error('Invalid encrypted payload format');
    }
    const key = getKey();
    const iv = Buffer.from(ivB64, 'base64url');
    const tag = Buffer.from(tagB64, 'base64url');
    const body = Buffer.from(bodyB64, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
};
