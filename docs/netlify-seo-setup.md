# Netlify SEO Setup Instructions

## 1) Domain and Canonical Host
1. Ensure production domain is connected in Netlify:
- `brainpuddle.com`
- `www.brainpuddle.com` (optional redirect to apex)
2. Set canonical env var in Netlify:

```bash
PUBLIC_SITE_URL=https://brainpuddle.com
```

This ensures server-generated shared OG pages resolve to canonical origin.

## 2) Required Public SEO Assets
These files are present and must stay published from `public/`:

- [robots.txt](/Users/rakeshreddy/Downloads/BrainpuddleWebsite/brainpuddle-website/public/robots.txt)
- [sitemap.xml](/Users/rakeshreddy/Downloads/BrainpuddleWebsite/brainpuddle-website/public/sitemap.xml)
- [llms.txt](/Users/rakeshreddy/Downloads/BrainpuddleWebsite/brainpuddle-website/public/llms.txt)

## 3) Netlify Redirect Rules
Ensure [netlify.toml](/Users/rakeshreddy/Downloads/BrainpuddleWebsite/brainpuddle-website/netlify.toml) includes:

1. `/api/share-card/create -> /.netlify/functions/share-card-create`
2. `/api/* -> /.netlify/functions/:splat`
3. `/s/* -> /.netlify/functions/share-resolve?id=:splat`
4. SPA fallback `/* -> /index.html`

This is required for share-page OG metadata resolution.

## 4) Route-Level Metadata
Dynamic route SEO is handled in:
- [seo.ts](/Users/rakeshreddy/Downloads/BrainpuddleWebsite/brainpuddle-website/src/lib/seo.ts)
- [App.tsx](/Users/rakeshreddy/Downloads/BrainpuddleWebsite/brainpuddle-website/src/App.tsx)

This injects:
- `title`
- `description`
- `canonical`
- `og:*`
- `twitter:*`
- `robots`
- JSON-LD structured data

## 5) Recommended Netlify Environment Variables

```bash
PUBLIC_SITE_URL=https://brainpuddle.com
```

Optional but recommended for sharing:

```bash
CF_R2_PUBLIC_BASE_URL=https://cards.brainpuddle.com
```

## 6) Post-Deploy SEO Validation
Run after each production deploy:

1. `curl -s https://brainpuddle.com/robots.txt`
2. `curl -s https://brainpuddle.com/sitemap.xml`
3. `curl -s https://brainpuddle.com/llms.txt`
4. `curl -s https://brainpuddle.com/s/<shareId> | rg \"og:title|og:description|og:url|og:image\"`

Expected:
- canonical host is `https://brainpuddle.com`
- OG tags present on shared pages
- no indexing on `/internal/*`

## 7) Search Console + Bing Submission
1. Submit sitemap:
- `https://brainpuddle.com/sitemap.xml`
2. Verify domain property in:
- Google Search Console
- Bing Webmaster Tools
3. Re-submit URL inspection for:
- `/`
- `/ai-score`
- `/voice-agents`
- `/consultation`
- `/content-creation`

## 8) Ongoing SEO Operations
Weekly:
1. Check indexed pages and crawl errors.
2. Monitor query impressions/clicks for:
- `AI Resilience Score`
- `Replaceability Index`
- `AI-Resistant Tier`
3. Verify `/s/*` link previews still render with image and metadata.
