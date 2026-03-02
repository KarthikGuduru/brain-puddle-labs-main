import posthog from 'posthog-js';

let initialized = false;

const getConfig = () => ({
    key: (import.meta.env.VITE_POSTHOG_KEY as string | undefined)?.trim() || '',
    // Use the ingest host (not the UI host). If unset, default to PostHog US ingest.
    host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined)?.trim() || 'https://us.i.posthog.com'
});

const getApiHost = () => {
    const { host } = getConfig();
    // In production we prefer reverse-proxying through our own domain to reduce adblock impact.
    // In local dev, Netlify redirects are not present, so use the direct host.
    const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '[::1]');
    return isLocal ? host : '/ingest';
};

export const initAnalytics = () => {
    if (initialized) return;
    const { key } = getConfig();
    if (!key) return;

    posthog.init(key, {
        api_host: getApiHost(),
        // SPA: we emit $pageview manually on route changes.
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: false,
        person_profiles: 'identified_only'
    });
    initialized = true;
};

export const trackEvent = (event: string, properties?: Record<string, unknown>) => {
    initAnalytics();
    const { key } = getConfig();
    if (!key) return;
    posthog.capture(event, properties || {});
};

// PostHog Web Analytics expects $pageview. For SPA route changes, emit it manually.
export const trackPageView = (path?: string) => {
    initAnalytics();
    const { key } = getConfig();
    if (!key) return;
    posthog.capture('$pageview', {
        ...(path ? { path } : {}),
        $current_url: typeof window !== 'undefined' ? window.location.href : undefined
    });
    // Keep a stable custom event for internal dashboards.
    trackEvent('page_view', { ...(path ? { path } : {}) });
};
