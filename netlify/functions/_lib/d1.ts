import { getEnv } from './env';

export interface D1ResultRow {
    [key: string]: unknown;
}

interface D1QueryResult {
    rows: D1ResultRow[];
    meta: Record<string, unknown>;
}

const getD1Config = () => ({
    accountId: getEnv('CF_ACCOUNT_ID'),
    databaseId: getEnv('CF_D1_DATABASE_ID'),
    apiToken: getEnv('CF_D1_API_TOKEN')
});

export const isD1Configured = () => {
    const cfg = getD1Config();
    return Boolean(cfg.accountId && cfg.databaseId && cfg.apiToken);
};

const buildD1Endpoint = () => {
    const { accountId, databaseId } = getD1Config();
    return `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
};

const extractResult = (payload: unknown): D1QueryResult => {
    const data = (payload && typeof payload === 'object') ? payload as { result?: unknown } : {};
    const resultBlock = data.result;
    const first = Array.isArray(resultBlock) ? resultBlock[0] : resultBlock;
    const firstObj = (first && typeof first === 'object') ? first as { results?: unknown; meta?: unknown } : {};
    return {
        rows: Array.isArray(firstObj.results) ? firstObj.results as D1ResultRow[] : [],
        meta: (firstObj.meta && typeof firstObj.meta === 'object') ? firstObj.meta as Record<string, unknown> : {}
    };
};

export const d1Query = async (sql: string, params: unknown[] = []): Promise<D1QueryResult> => {
    if (!isD1Configured()) {
        throw new Error('D1 is not configured.');
    }

    const { apiToken } = getD1Config();
    const response = await fetch(buildD1Endpoint(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiToken}`
        },
        body: JSON.stringify({ sql, params })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.success === false) {
        const errors = Array.isArray(payload?.errors) ? payload.errors as Array<{ message?: string }> : [];
        const msg = errors.map((e) => e?.message || '').filter(Boolean).join('; ') || response.statusText;
        throw new Error(`D1 query failed: ${msg}`);
    }

    return extractResult(payload);
};

export const d1Execute = async (sql: string, params: unknown[] = []) => {
    const result = await d1Query(sql, params);
    return {
        changes: Number(result.meta?.changes || 0),
        lastRowId: result.meta?.last_row_id,
        rows: result.rows
    };
};
