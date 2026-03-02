import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

type OpsMetricsPayload = {
    counters: {
        visits: number | null;
        aiRuns: number;
        shares: number;
        claims: number;
        remaining: number;
    };
    recentClaims: Array<{ id: string; createdAt: string; linkedin: string; status: string }>;
    recentShares: Array<{ id: string; createdAt: string; name: string; score: number; tier: string }>;
};

const defaultPayload: OpsMetricsPayload = {
    counters: { visits: null, aiRuns: 0, shares: 0, claims: 0, remaining: 100 },
    recentClaims: [],
    recentShares: []
};

const OpsDashboardPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [payload, setPayload] = useState<OpsMetricsPayload>(defaultPayload);
    const [token, setToken] = useState(searchParams.get('token') || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const statCards = useMemo(() => [
        { label: 'AI Runs', value: payload.counters.aiRuns },
        { label: 'Shares Created', value: payload.counters.shares },
        { label: 'Claims Accepted', value: payload.counters.claims },
        { label: 'Cards Remaining', value: payload.counters.remaining }
    ], [payload]);
    const resourceLinks = useMemo(() => [
        {
            label: 'Google Search Console',
            desc: 'Organic search clicks, page indexing, and query-level CTR.',
            href: 'https://search.google.com/search-console'
        },
        {
            label: 'Bing Webmaster Tools',
            desc: 'Bing indexing, crawl diagnostics, and keyword visibility.',
            href: 'https://www.bing.com/webmasters/about'
        },
        {
            label: 'PostHog Dashboard',
            desc: 'Product funnel analytics for AI score, share, and claim events.',
            href: 'https://app.posthog.com'
        }
    ], []);

    const loadMetrics = async (adminToken?: string) => {
        setLoading(true);
        setError('');
        try {
            const query = adminToken ? `?token=${encodeURIComponent(adminToken)}` : '';
            const response = await fetch(`/api/ops-metrics${query}`, {
                headers: adminToken ? { 'x-admin-token': adminToken } : undefined
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({} as { error?: string }));
                throw new Error(body?.error || `Request failed (${response.status})`);
            }
            const json = await response.json() as OpsMetricsPayload;
            setPayload(json);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load metrics';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadMetrics(token);
        } else {
            loadMetrics();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="main-content" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        marginBottom: '1.6rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--accent-color)'
                    }}
                >
                    ← Back to Studio
                </Link>

                <section className="glass" style={{ borderRadius: '1.5rem', padding: '1.5rem', border: 'var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                                Internal
                            </p>
                            <h1 style={{ margin: '0.4rem 0 0 0', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>Ops Dashboard</h1>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                            <input
                                type="password"
                                value={token}
                                onChange={(event) => setToken(event.target.value)}
                                placeholder="Admin token"
                                style={{ padding: '0.7rem 0.8rem', borderRadius: '0.7rem', border: 'var(--glass-border)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                            />
                            <button
                                onClick={() => loadMetrics(token)}
                                style={{ border: 'none', borderRadius: '0.7rem', padding: '0.7rem 1rem', background: 'var(--accent-color)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                            >
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>

                    {error && <p style={{ color: '#d14343', marginTop: '0.9rem' }}>{error}</p>}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.8rem', marginTop: '1.2rem' }}>
                        {statCards.map((item) => (
                            <div key={item.label} style={{ border: 'var(--glass-border)', borderRadius: '1rem', background: 'var(--bg-dark)', padding: '1rem' }}>
                                <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    {item.label}
                                </p>
                                <p style={{ margin: '0.35rem 0 0 0', fontSize: '1.9rem', fontWeight: 700 }}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem', marginTop: '1.2rem' }}>
                        <div style={{ border: 'var(--glass-border)', borderRadius: '1rem', background: 'var(--bg-dark)', padding: '1rem', overflowX: 'auto' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '0.8rem' }}>Recent Claims</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-tertiary)', paddingBottom: '0.5rem' }}>Time</th>
                                        <th style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-tertiary)', paddingBottom: '0.5rem' }}>LinkedIn</th>
                                        <th style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-tertiary)', paddingBottom: '0.5rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payload.recentClaims.map((claim) => (
                                        <tr key={claim.id}>
                                            <td style={{ fontSize: '0.86rem', padding: '0.35rem 0' }}>{new Date(claim.createdAt).toLocaleString()}</td>
                                            <td style={{ fontSize: '0.86rem', padding: '0.35rem 0' }}>{claim.linkedin || 'n/a'}</td>
                                            <td style={{ fontSize: '0.86rem', padding: '0.35rem 0' }}>{claim.status}</td>
                                        </tr>
                                    ))}
                                    {payload.recentClaims.length === 0 && (
                                        <tr><td colSpan={3} style={{ color: 'var(--text-tertiary)', fontSize: '0.86rem' }}>No claims yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ border: 'var(--glass-border)', borderRadius: '1rem', background: 'var(--bg-dark)', padding: '1rem', overflowX: 'auto' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '0.8rem' }}>Recent Shared Cards</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-tertiary)', paddingBottom: '0.5rem' }}>Time</th>
                                        <th style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-tertiary)', paddingBottom: '0.5rem' }}>Name</th>
                                        <th style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-tertiary)', paddingBottom: '0.5rem' }}>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payload.recentShares.map((share) => (
                                        <tr key={share.id}>
                                            <td style={{ fontSize: '0.86rem', padding: '0.35rem 0' }}>{new Date(share.createdAt).toLocaleString()}</td>
                                            <td style={{ fontSize: '0.86rem', padding: '0.35rem 0' }}>{share.name}</td>
                                            <td style={{ fontSize: '0.86rem', padding: '0.35rem 0' }}>{share.score}/100</td>
                                        </tr>
                                    ))}
                                    {payload.recentShares.length === 0 && (
                                        <tr><td colSpan={3} style={{ color: 'var(--text-tertiary)', fontSize: '0.86rem' }}>No shared cards yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>SEO and Discovery Console Links</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                            {resourceLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    style={{ textDecoration: 'none', border: 'var(--glass-border)', borderRadius: '0.9rem', background: 'var(--bg-dark)', padding: '0.9rem' }}
                                >
                                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</p>
                                    <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        {item.desc}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>

                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        Track weekly AI citation checks manually and reconcile with Search Console query growth for AI Resilience Score and Replaceability Index terms.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default OpsDashboardPage;
