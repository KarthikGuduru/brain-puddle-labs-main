import posthog from 'posthog-js';

let initialized = false;

const getConfig = () => ({
    key: (import.meta.env.VITE_POSTHOG_KEY as string | undefined)?.trim() || '',
    host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined)?.trim() || 'https://us.i.posthog.com'
});

export const initAnalytics = () => {
    if (initialized) return;
    const { key, host } = getConfig();
    if (!key) return;

    posthog.init(key, {
        api_host: host,
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
