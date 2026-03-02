export const getEnv = (key: string): string => (process.env[key] || '').trim();

export const getRequiredEnv = (key: string): string => {
    const value = getEnv(key);
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const resolveSiteOrigin = (headers?: Record<string, string | undefined>) => {
    const explicit = getEnv('PUBLIC_SITE_URL') || getEnv('SITE_URL') || getEnv('URL');
    if (explicit) {
        try {
            return new URL(explicit).origin;
        } catch {
            return explicit.replace(/\/+$/, '');
        }
    }

    const proto = headers?.['x-forwarded-proto'] || 'https';
    const host = headers?.['x-forwarded-host'] || headers?.host || 'brainpuddle.com';
    return `${proto}://${host}`;
};
