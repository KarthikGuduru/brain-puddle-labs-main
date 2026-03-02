import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const tierColors: Record<string, string> = {
    '🛡️ AI-Resistant': '#2b5cff',
    '⚔️ AI-Resistant': '#ffeb3b',
    '⚠️ Automatable': '#ff4d4d',
    '🛡️ Irreplaceable': '#00E676'
};

const clampScore = (raw: string | number | null | undefined) => {
    const value = Number(raw);
    if (Number.isNaN(value)) return 50;
    return Math.max(0, Math.min(100, value));
};

const decodeSharePayload = (payload: string | undefined) => {
    if (!payload) return null;
    try {
        const normalized = payload.trim();
        const decodedToken = normalized.includes('%') ? decodeURIComponent(normalized) : normalized;
        const base64 = decodedToken.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const decodedJson = decodeURIComponent(escape(atob(padded)));
        const parsed = JSON.parse(decodedJson) as Record<string, string | number>;
        return parsed;
    } catch {
        return null;
    }
};

const getPayloadValue = (payload: Record<string, string | number> | null, keys: string[]) => {
    if (!payload) return '';
    for (const key of keys) {
        const value = payload[key];
        if (value !== undefined && value !== null && String(value).trim()) {
            return String(value);
        }
    }
    return '';
};

type SharedCardResponse = {
    shareId: string;
    name: string;
    title: string;
    score: number;
    tier: string;
    imageUrl: string;
    createdAt: string;
};

const AiScoreSharedPage: React.FC<{ onContactOpen?: () => void }> = ({ onContactOpen }) => {
    const { payload } = useParams<{ payload?: string }>();
    const [searchParams] = useSearchParams();
    const payloadToken = payload || searchParams.get('id') || searchParams.get('d') || undefined;
    const decodedPayload = useMemo(() => decodeSharePayload(payloadToken), [payloadToken]);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [remoteCard, setRemoteCard] = useState<SharedCardResponse | null>(null);
    const [loadingRemote, setLoadingRemote] = useState(false);
    const [imageCandidateIndex, setImageCandidateIndex] = useState(0);

    useEffect(() => {
        let canceled = false;
        const isShareIdPayload = Boolean(payloadToken) && !decodedPayload;
        if (!isShareIdPayload || !payloadToken) return;

        const loadSharedCard = async () => {
            setLoadingRemote(true);
            try {
                const response = await fetch(`/api/shared-card?id=${encodeURIComponent(payloadToken)}`);
                if (!response.ok) return;
                const json = await response.json() as SharedCardResponse;
                if (!canceled) {
                    setRemoteCard(json);
                    setImageLoadError(false);
                }
            } catch {
                // keep payload fallback rendering
            } finally {
                if (!canceled) setLoadingRemote(false);
            }
        };

        loadSharedCard();
        return () => {
            canceled = true;
        };
    }, [decodedPayload, payloadToken]);

    const name = remoteCard?.name || getPayloadValue(decodedPayload, ['n', 'name']) || searchParams.get('name') || 'Professional User';
    const title = remoteCard?.title || getPayloadValue(decodedPayload, ['t', 'title']) || searchParams.get('title') || 'Digital Professional';
    const tier = remoteCard?.tier || getPayloadValue(decodedPayload, ['r', 'tier']) || searchParams.get('tier') || '⚔️ AI-Resistant';
    const score = clampScore(
        remoteCard?.score ?? (getPayloadValue(decodedPayload, ['s', 'score']) || searchParams.get('score'))
    );
    const shareNote = getPayloadValue(decodedPayload, ['note']) || searchParams.get('note') || 'Shared from BrainPuddle AI Score';
    const cardImageUrl =
        getPayloadValue(decodedPayload, ['i', 'image', 'imageUrl']) ||
        searchParams.get('i') ||
        searchParams.get('image') ||
        searchParams.get('imageUrl') ||
        '';

    const imageCandidates = useMemo(() => {
        const list = [
            remoteCard?.shareId ? `/api/share-image?id=${encodeURIComponent(remoteCard.shareId)}` : '',
            remoteCard?.imageUrl || '',
            cardImageUrl
        ].filter(Boolean);
        return Array.from(new Set(list));
    }, [remoteCard?.shareId, remoteCard?.imageUrl, cardImageUrl]);

    useEffect(() => {
        setImageCandidateIndex(0);
        setImageLoadError(false);
    }, [imageCandidates.join('|')]);

    const resolvedImageUrl = imageCandidates[imageCandidateIndex] || '';
    const hasCardImage = Boolean(resolvedImageUrl) && !imageLoadError;

    const tierColor = tierColors[tier] || '#ffeb3b';
    const resilienceScore = Math.max(0, 100 - score);

    return (
        <main className="main-content" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        marginBottom: '2rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--accent-color)'
                    }}
                >
                    ← Back to Studio
                </Link>

                <section className="glass" style={{ borderRadius: '1.5rem', padding: '2rem', border: 'var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                        Shared AI Score Result
                    </p>
                    <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.1, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                        {name}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                        {title}
                    </p>

                    {loadingRemote && (
                        <p style={{ marginTop: '-0.3rem', marginBottom: '1rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                            Loading shared card...
                        </p>
                    )}

                    {hasCardImage && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <img
                                src={resolvedImageUrl}
                                alt={`${name} AI score card`}
                                onError={() => {
                                    if (imageCandidateIndex < imageCandidates.length - 1) {
                                        setImageCandidateIndex((index) => index + 1);
                                        return;
                                    }
                                    setImageLoadError(true);
                                }}
                                style={{
                                    width: '100%',
                                    maxWidth: '460px',
                                    borderRadius: '1rem',
                                    border: 'var(--glass-border)',
                                    boxShadow: 'var(--shadow-md)',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    )}

                    {!hasCardImage && (
                        <div style={{ marginBottom: '1.5rem', borderRadius: '1rem', border: 'var(--glass-border)', background: 'var(--bg-dark)', padding: '1rem 1.2rem' }}>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                Card image preview unavailable for this shared result, but the score details below are exact.
                            </p>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-dark)', border: 'var(--glass-border)', borderRadius: '1rem', padding: '1rem' }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                Replaceability Index
                            </p>
                            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{score}/100</p>
                        </div>

                        <div style={{ background: 'var(--bg-dark)', border: 'var(--glass-border)', borderRadius: '1rem', padding: '1rem' }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                AI Resilience Score
                            </p>
                            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{resilienceScore}/100</p>
                        </div>

                        <div style={{ background: 'var(--bg-dark)', border: 'var(--glass-border)', borderRadius: '1rem', padding: '1rem' }}>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                Tier
                            </p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: tierColor }}>{tier}</p>
                        </div>
                    </div>

                    {shareNote && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            {shareNote}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link to="/ai-score" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            Check Your AI Score
                        </Link>
                        <button
                            onClick={onContactOpen}
                            className="btn-secondary"
                            style={{ background: '#fff', borderColor: 'var(--accent-color)' }}
                        >
                            Talk to BrainPuddle
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AiScoreSharedPage;
