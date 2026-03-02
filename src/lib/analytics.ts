import posthog from 'posthog-js';

let initialized = false;

const getConfig = () => ({
    key: (import.meta.env.VITE_POSTHOG_KEY as string | undefined)?.trim() || '',
    // Use the ingest host (not the UI host). If unset, default to PostHog US ingest.
    host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined)?.trim() || 'https://us.i.posthog.com'
});

const getUiHost = () => {
    const explicit = (import.meta.env.VITE_POSTHOG_UI_HOST as string | undefined)?.trim();
    if (explicit) return explicit;
    const { host } = getConfig();
    if (host.includes('eu.i.posthog.com')) return 'https://eu.posthog.com';
    if (host.includes('us.i.posthog.com')) return 'https://us.posthog.com';
    return 'https://app.posthog.com';
};

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
        ui_host: getUiHost(),
        // Track SPA route changes and power web analytics checks.
        defaults: '2025-05-24',
        capture_pageview: 'history_change',
        capture_pageleave: true,
        // Enables scroll depth and other web analytics enrichment.
        autocapture: true,
        // Enable LCP/CLS/INP collection without waiting for server-side override.
        capture_performance: true,
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

// Keep a custom event for internal dashboards; PostHog handles $pageview automatically.
export const trackPageView = (path?: string) => {
    initAnalytics();
    const { key } = getConfig();
    if (!key) return;
    trackEvent('page_view', { ...(path ? { path } : {}) });
};
