type SharedCard = {
    id: string;
    createdAt: string;
    aiRunId: string | null;
    name: string;
    title: string;
    score: number;
    tier: string;
    imageUrl: string;
    expiresAt: string;
};

type ClaimSubmission = {
    id: string;
    createdAt: string;
    linkedinSlug: string;
    linkedinHash: string;
    aiRunId: string | null;
    status: string;
};

type AiRun = {
    id: string;
    createdAt: string;
    inputType: string;
    linkedinSlug: string;
    linkedinHash: string;
    inputCharCount: number;
    score: number;
    tier: string;
    analysisLatencyMs: number;
    imageSource: string;
    shareClicked: number;
};

interface LocalStoreState {
    inventory: { total: number; claimed: number; remaining: number; updatedAt: string };
    sharedCards: Map<string, SharedCard>;
    claims: ClaimSubmission[];
    aiRuns: AiRun[];
    rateLimits: Map<string, { count: number; windowStartMs: number }>;
}

const g = globalThis as typeof globalThis & { __brainPuddleLocalStore?: LocalStoreState };

if (!g.__brainPuddleLocalStore) {
    g.__brainPuddleLocalStore = {
        inventory: { total: 100, claimed: 0, remaining: 100, updatedAt: new Date().toISOString() },
        sharedCards: new Map(),
        claims: [],
        aiRuns: [],
        rateLimits: new Map()
    };
}

export const localStore = g.__brainPuddleLocalStore;
