import { getEnv } from './env';

interface TurnstileVerifyResult {
    success: boolean;
    skipped: boolean;
    errors: string[];
}

export const verifyTurnstileToken = async (
    token: string,
    remoteIp?: string
): Promise<TurnstileVerifyResult> => {
    const secret = getEnv('TURNSTILE_SECRET_KEY');
    if (!secret) {
        return { success: true, skipped: true, errors: [] };
    }

    if (!token) {
        return { success: false, skipped: false, errors: ['missing-token'] };
    }

    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);
    if (remoteIp) {
        body.set('remoteip', remoteIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });

    if (!response.ok) {
        return { success: false, skipped: false, errors: [`http-${response.status}`] };
    }

    const payload = await response.json().catch(() => ({} as Record<string, unknown>));
    return {
        success: Boolean(payload?.success),
        skipped: false,
        errors: Array.isArray(payload?.['error-codes']) ? payload['error-codes'] : []
    };
};
