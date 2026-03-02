export type PageSeoConfig = {
    title: string;
    description: string;
    canonical: string;
    ogImage: string;
    robots?: 'index,follow' | 'noindex,nofollow';
    schema?: Array<Record<string, unknown>>;
};

const SITE_ORIGIN = 'https://brainpuddle.com';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/consultation-hero.png`;

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BrainPuddle',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo.png`
};

const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BrainPuddle',
    url: SITE_ORIGIN,
    description: 'Applied AI studio for voice agents, AI consultation, content systems, and AI resilience scoring.'
};

const serviceSchema = (
    name: string,
    description: string,
    path: string
) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType: name,
    description,
    provider: {
        '@type': 'Organization',
        name: 'BrainPuddle',
        url: SITE_ORIGIN
    },
    areaServed: {
        '@type': 'Place',
        name: 'Global'
    },
    url: `${SITE_ORIGIN}${path}`
});

const aiScoreFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is the AI Resilience Score?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The AI Resilience Score estimates how strongly your work profile can resist automation by analyzing role depth, decision autonomy, adaptability, and system leverage.'
            }
        },
        {
            '@type': 'Question',
            name: 'What is the Replaceability Index?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Replaceability Index is a 0-100 score where higher means easier to automate. BrainPuddle pairs it with your AI Resilience Score and AI-Resistant Tier.'
            }
        },
        {
            '@type': 'Question',
            name: 'Who should use the AI score tool?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Professionals, students, founders, and teams can use it to identify automation risk, understand strengths, and choose practical upskilling actions.'
            }
        }
    ]
};

const upsertMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
    const selector = `meta[${attr}="${key}"]`;
    let meta = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, key);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
};

const replaceStructuredData = (schemas: Array<Record<string, unknown>>) => {
    const previous = document.head.querySelectorAll('script[data-brainpuddle-seo-schema="true"]');
    previous.forEach((node) => node.remove());

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-brainpuddle-seo-schema', 'true');
        script.setAttribute('data-schema-index', String(index));
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
};

const withOrganization = (schemas: Array<Record<string, unknown>> = []) => [
    organizationSchema,
    ...schemas
];

export const getPageSeoConfig = (pathname: string): PageSeoConfig => {
    const path = pathname || '/';
    const canonicalPath = path.startsWith('/ai-score/shared/') ? '/ai-score/shared' : path;
    const canonical = `${SITE_ORIGIN}${canonicalPath}`;

    if (path.startsWith('/internal/')) {
        return {
            title: 'Internal Ops Dashboard | BrainPuddle',
            description: 'Internal analytics and operations dashboard for BrainPuddle teams.',
            canonical,
            ogImage: DEFAULT_OG_IMAGE,
            robots: 'noindex,nofollow',
            schema: withOrganization()
        };
    }

    if (path.startsWith('/voice-agents')) {
        return {
            title: 'AI Voice Agents for Sales and Support | BrainPuddle',
            description: 'Deploy multilingual AI voice agents that qualify leads, handle support, and book meetings 24/7.',
            canonical,
            ogImage: `${SITE_ORIGIN}/voice-agents-hero.png`,
            robots: 'index,follow',
            schema: withOrganization([
                serviceSchema(
                    'AI Voice Agents',
                    'Multilingual AI voice agents for lead qualification, customer support, booking, and payment follow-ups.',
                    '/voice-agents'
                )
            ])
        };
    }

    if (path.startsWith('/consultation')) {
        return {
            title: 'AI Consultation for Enterprise Execution | BrainPuddle',
            description: 'Get practical AI strategy and execution support to identify the highest-impact use cases and ship in production.',
            canonical,
            ogImage: `${SITE_ORIGIN}/consultation-hero.png`,
            robots: 'index,follow',
            schema: withOrganization([
                serviceSchema(
                    'AI Consultation',
                    'AI strategy and implementation services for enterprise and growth-stage teams.',
                    '/consultation'
                )
            ])
        };
    }

    if (path.startsWith('/content-creation')) {
        return {
            title: 'AI Content Engine for Brand Teams | BrainPuddle',
            description: 'Scale high-quality blogs, social content, emails, and campaign copy with AI systems tuned to your brand voice.',
            canonical,
            ogImage: `${SITE_ORIGIN}/content-creation-hero.png`,
            robots: 'index,follow',
            schema: withOrganization([
                serviceSchema(
                    'AI Content Creation',
                    'AI-powered content systems for blogs, social media, email, and marketing assets.',
                    '/content-creation'
                )
            ])
        };
    }

    if (path.startsWith('/ai-score/shared')) {
        return {
            title: 'Shared AI Resilience Score Result | BrainPuddle',
            description: 'View a shared BrainPuddle AI Resilience Score and Replaceability Index result.',
            canonical,
            ogImage: DEFAULT_OG_IMAGE,
            robots: 'index,follow',
            schema: withOrganization()
        };
    }

    if (path.startsWith('/ai-score')) {
        return {
            title: 'AI Resilience Score and Replaceability Index | BrainPuddle',
            description: 'Run the BrainPuddle AI Resilience Score to measure your Replaceability Index, AI-Resistant Tier, and practical next steps.',
            canonical,
            ogImage: DEFAULT_OG_IMAGE,
            robots: 'index,follow',
            schema: withOrganization([aiScoreFaqSchema])
        };
    }

    return {
        title: 'BrainPuddle | Applied AI Studio for Real Business Outcomes',
        description: 'BrainPuddle builds production-ready AI systems: voice agents, AI consultation, content engines, and the AI Resilience Score.',
        canonical: `${SITE_ORIGIN}/`,
        ogImage: `${SITE_ORIGIN}/logo_horizontal.png`,
        robots: 'index,follow',
        schema: withOrganization([webSiteSchema])
    };
};

export const applySeoForPath = (pathname: string) => {
    if (typeof document === 'undefined') return;
    const config = getPageSeoConfig(pathname);

    document.title = config.title;
    upsertCanonical(config.canonical);

    upsertMetaTag('name', 'description', config.description);
    upsertMetaTag('name', 'robots', config.robots || 'index,follow');

    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:site_name', 'BrainPuddle');
    upsertMetaTag('property', 'og:title', config.title);
    upsertMetaTag('property', 'og:description', config.description);
    upsertMetaTag('property', 'og:url', config.canonical);
    upsertMetaTag('property', 'og:image', config.ogImage);

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', config.title);
    upsertMetaTag('name', 'twitter:description', config.description);
    upsertMetaTag('name', 'twitter:image', config.ogImage);

    replaceStructuredData(config.schema || withOrganization());
};
