import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Confetti from 'react-confetti';
import TurnstileWidget from '../TurnstileWidget';
import { trackEvent } from '../../lib/analytics';

interface ClaimPhysicalCardProps {
    aiRunId: string | null;
    defaultLinkedinUrl: string;
}

type CounterResponse = {
    total: number;
    claimed: number;
    remaining: number;
    updatedAt: string;
};

const initialCounter: CounterResponse = {
    total: 100,
    claimed: 0,
    remaining: 100,
    updatedAt: new Date().toISOString()
};

const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() || '';

const ClaimPhysicalCard: React.FC<ClaimPhysicalCardProps> = ({ aiRunId, defaultLinkedinUrl }) => {
    const [counter, setCounter] = useState<CounterResponse>(initialCounter);
    const [loadingCounter, setLoadingCounter] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fullName, setFullName] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState(defaultLinkedinUrl || '');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isSoldOut = counter.remaining <= 0;

    useEffect(() => {
        if (defaultLinkedinUrl) {
            setLinkedinUrl(defaultLinkedinUrl);
        }
    }, [defaultLinkedinUrl]);

    useEffect(() => {
        let canceled = false;
        const loadCounter = async () => {
            setLoadingCounter(true);
            try {
                const response = await fetch('/api/claim-counter');
                if (!response.ok) return;
                const payload = await response.json() as CounterResponse;
                if (!canceled) {
                    setCounter(payload);
                }
            } catch {
                // keep default value on failure
            } finally {
                if (!canceled) setLoadingCounter(false);
            }
        };

        loadCounter();
        trackEvent('claim_form_viewed', { aiRunId: aiRunId || null });
        return () => {
            canceled = true;
        };
    }, [aiRunId]);

    const badgeText = useMemo(() => {
        if (loadingCounter) return 'Checking availability...';
        if (isSoldOut) return 'Sold Out';
        return `Limited Edition: ${counter.remaining} Available`;
    }, [counter.remaining, isSoldOut, loadingCounter]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (isSoldOut) {
            setError('The free physical card drop is sold out.');
            return;
        }

        setSubmitting(true);
        trackEvent('claim_form_submitted', { aiRunId: aiRunId || null });

        try {
            const response = await fetch('/api/claim-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    linkedinUrl,
                    deliveryAddress,
                    aiRunId,
                    turnstileToken
                })
            });

            const payload = await response.json().catch(() => ({} as Record<string, unknown>));

            if (!response.ok) {
                if (payload?.error === 'SOLD_OUT') {
                    setCounter((prev) => ({ ...prev, remaining: 0, claimed: prev.total }));
                    setError('The free physical card drop is now sold out.');
                    trackEvent('claim_form_sold_out', { aiRunId: aiRunId || null });
                    return;
                }

                const message = payload?.error || 'Failed to submit claim. Please try again.';
                setError(message);
                trackEvent('claim_form_failed', { aiRunId: aiRunId || null, reason: message });
                return;
            }

            const remainingCount = Number(payload?.remainingCount);
            if (!Number.isNaN(remainingCount)) {
                setCounter((prev) => ({
                    ...prev,
                    claimed: Math.min(prev.total, prev.total - remainingCount),
                    remaining: remainingCount,
                    updatedAt: new Date().toISOString()
                }));
            }
            setSuccess('Claim submitted. We will contact you with delivery details.');
            setFullName('');
            setDeliveryAddress('');
            if (turnstileSiteKey) {
                setTurnstileToken('');
            }
            trackEvent('claim_form_success', { aiRunId: aiRunId || null });
        } catch (submitError: unknown) {
            const message = submitError instanceof Error ? submitError.message : 'network';
            setError('Network error while submitting claim.');
            trackEvent('claim_form_failed', { aiRunId: aiRunId || null, reason: message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="glass claim-physical-card" style={{ width: '100%', maxWidth: '760px', borderRadius: '1.6rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                    <h3 style={{ margin: 0, fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)', lineHeight: 1.1 }}>
                        Claim Physical Card
                    </h3>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '999px',
                        padding: '0.45rem 0.95rem',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: '#fff',
                        background: isSoldOut ? '#A6A6A6' : 'var(--accent-color)'
                    }}>
                        {badgeText}
                    </span>
                </div>

                <p style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5 }}>
                    First 100 users get a premium holographic physical print of their card delivered for free.
                </p>

                <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'grid', gap: '0.95rem' }}>
                    <input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Full Name"
                        required
                        disabled={submitting || isSoldOut}
                        style={{ width: '100%', padding: '1rem 1.1rem', borderRadius: '0.9rem', border: 'var(--glass-border)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '1.02rem' }}
                    />

                    <input
                        value={linkedinUrl}
                        onChange={(event) => setLinkedinUrl(event.target.value)}
                        placeholder="LinkedIn Profile URL"
                        type="url"
                        required
                        disabled={submitting || isSoldOut}
                        style={{ width: '100%', padding: '1rem 1.1rem', borderRadius: '0.9rem', border: 'var(--glass-border)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '1.02rem' }}
                    />

                    <textarea
                        value={deliveryAddress}
                        onChange={(event) => setDeliveryAddress(event.target.value)}
                        placeholder="Delivery Address"
                        required
                        rows={3}
                        disabled={submitting || isSoldOut}
                        style={{ width: '100%', padding: '1rem 1.1rem', borderRadius: '0.9rem', border: 'var(--glass-border)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '1.02rem', resize: 'vertical' }}
                    />

                    {turnstileSiteKey && (
                        <div>
                            <TurnstileWidget siteKey={turnstileSiteKey} onTokenChange={setTurnstileToken} />
                        </div>
                    )}

                    {error && (
                        <p style={{ margin: 0, color: '#d14343', fontSize: '0.9rem' }}>{error}</p>
                    )}
                    {success && (
                        <p style={{ margin: 0, color: '#0f8b4b', fontSize: '0.9rem' }}>{success}</p>
                    )}

                    <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                        {success && (
                            <div style={{ position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%, 50%)', width: '300px', height: '300px', pointerEvents: 'none', zIndex: 10 }}>
                                <Confetti width={300} height={300} recycle={false} numberOfPieces={250} gravity={0.25} initialVelocityY={15} />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={submitting || isSoldOut}
                            style={{
                                width: '100%',
                                border: 'none',
                                borderRadius: '999px',
                                background: isSoldOut ? '#A6A6A6' : 'var(--accent-color)',
                                color: '#fff',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                padding: '1rem',
                                cursor: submitting || isSoldOut ? 'not-allowed' : 'pointer',
                                position: 'relative',
                                zIndex: 2
                            }}
                        >
                            {isSoldOut ? 'Sold Out' : submitting ? 'Submitting...' : 'Claim My Free Card'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ClaimPhysicalCard;
