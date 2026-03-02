# PostHog Setup for Web Metrics and Tracking

## 1) Create PostHog Project
1. Go to `https://app.posthog.com`.
2. Create a project for `brainpuddle.com`.
3. Copy:
- `Project API Key` (public key)
- `Project API Host` (US: `https://us.i.posthog.com`, EU: `https://eu.i.posthog.com`)

## 2) Configure Frontend Environment
Set in Netlify (or local `.env`):

```bash
VITE_POSTHOG_KEY=phc_xxxxx
VITE_POSTHOG_HOST=https://us.i.posthog.com
# Optional, only if you want explicit UI host in links
VITE_POSTHOG_UI_HOST=https://us.posthog.com
```

Current analytics bootstrap is in [analytics.ts](/Users/rakeshreddy/Downloads/BrainpuddleWebsite/brainpuddle-website/src/lib/analytics.ts).

## 3) Events Already Instrumented
These events are already emitted in this codebase:

- `page_view`
- `nav_click`
- `ai_scan_submitted`
- `ai_scan_succeeded`
- `ai_scan_failed`
- `ai_card_generated`
- `ai_card_generation_failed`
- `ai_card_downloaded`
- `ai_card_download_failed`
- `ai_share_clicked`
- `ai_share_created`
- `ai_share_failed`
- `claim_form_viewed`
- `claim_form_submitted`
- `claim_form_success`
- `claim_form_failed`
- `claim_form_sold_out`

## 4) Recommended PostHog Dashboard Panels
1. **Traffic Overview**
- Trend of `page_view` by `path`

2. **Navigation Funnel**
- `nav_click` split by `tab`

3. **AI Score Funnel**
- `ai_scan_submitted` -> `ai_scan_succeeded` -> `ai_card_generated` -> `ai_share_created`

4. **Claim Funnel**
- `claim_form_viewed` -> `claim_form_submitted` -> `claim_form_success`
- Breakdown for `claim_form_failed` and `claim_form_sold_out`

5. **Share Quality**
- Trend and unique users for `ai_share_created`
- Breakdown by presence of `aiRunId`

## 5) Data Hygiene Rules
1. Do not send raw resume text, delivery address, or full LinkedIn URLs to PostHog.
2. Keep event properties minimal:
- `path`
- `tab`
- `score`
- `tier`
- `aiRunId` (opaque ID)
- failure reason enums only

## 6) Validation Checklist
1. Open site and navigate tabs:
- verify `page_view` and `nav_click`.
2. Complete one AI scan:
- verify `ai_scan_submitted` and `ai_scan_succeeded`.
3. Generate and share:
- verify `ai_card_generated` and `ai_share_created`.
4. Submit claim:
- verify `claim_form_submitted` and `claim_form_success`.

5. Verify PostHog web analytics checks:
- `$pageview`: should appear automatically (SDK `capture_pageview: 'history_change'`).
- `$pageleave`: should appear automatically (`capture_pageleave: true`).
- `Scroll depth`: enabled via `autocapture: true`.
- `Reverse proxy`: requests should go to `https://brainpuddle.com/ingest/*`.
- `$web_vitals`: emitted after real page load interactions.

## 7) PostHog UI Setup (Required)
1. In PostHog: **Project settings -> Authorized URLs**, add:
- `https://brainpuddle.com`
- `https://www.brainpuddle.com` (if live)
- Netlify production URL (if used directly)
- `http://localhost:5173` (optional for local testing)

2. No wildcards are allowed by PostHog in Authorized URLs.

## 8) Troubleshooting
1. No events visible:
- check `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`.
- ensure build/runtime env vars are present in deployed environment.
2. Events visible locally but not production:
- re-deploy after updating Netlify env vars.
3. CORS/network blocks:
- verify PostHog host region matches project.
4. Reverse proxy check still failing:
- confirm both rules exist in Netlify redirects:
  - `/ingest/static/* -> https://us.i.posthog.com/static/:splat`
  - `/ingest/* -> https://us.i.posthog.com/:splat`
5. Region mismatch (EU project):
- replace both redirect targets with `https://eu.i.posthog.com/...` and set `VITE_POSTHOG_HOST=https://eu.i.posthog.com`.
