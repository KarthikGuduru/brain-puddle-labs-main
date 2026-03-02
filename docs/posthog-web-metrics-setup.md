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

## 7) Troubleshooting
1. No events visible:
- check `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`.
- ensure build/runtime env vars are present in deployed environment.
2. Events visible locally but not production:
- re-deploy after updating Netlify env vars.
3. CORS/network blocks:
- verify PostHog host region matches project.
