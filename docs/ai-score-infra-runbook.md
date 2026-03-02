# AI Score Infra Runbook (Netlify + Cloudflare + PostHog)

## 1) Cloudflare setup (D1 + R2)

1. Install Wrangler and login:

```bash
npm i -g wrangler
wrangler login
```

2. Create D1:

```bash
wrangler d1 create brainpuddle-prod
```

Save the returned `database_id`.

3. Create R2 bucket:

```bash
wrangler r2 bucket create brainpuddle-cards-prod
```

4. Apply schema:

```bash
wrangler d1 execute brainpuddle-prod --remote --file ./infra/schema.sql
```

5. Seed inventory row:

```bash
wrangler d1 execute brainpuddle-prod --remote --command "INSERT INTO inventory (key,total,claimed,remaining,updated_at) VALUES ('physical_card',100,0,100,datetime('now')) ON CONFLICT(key) DO NOTHING;"
```

6. Create R2 API keys (Cloudflare Dashboard):
- Scope to `brainpuddle-cards-prod` only.
- Save access key + secret.

7. Create public image URL:
- Preferred: map custom domain `cards.brainpuddle.com` to the R2 bucket.
- Alternative: use default R2 public URL.

## 2) PostHog setup

1. Create a PostHog Cloud project.
2. Copy:
- `POSTHOG_KEY`
- `POSTHOG_HOST` (US or EU host for your project)
3. Build dashboard panels for:
- Page views / footfalls
- Navigation tab clicks
- AI scan funnel
- Share funnel
- Claim funnel

## 3) Netlify environment variables

Set these in Netlify site settings:

```bash
PUBLIC_SITE_URL=https://brainpuddle.com
VITE_SHARE_BASE_URL=https://brainpuddle.com

CF_ACCOUNT_ID=...
CF_D1_DATABASE_ID=...
CF_D1_API_TOKEN=...

CF_R2_ACCESS_KEY_ID=...
CF_R2_SECRET_ACCESS_KEY=...
CF_R2_BUCKET=brainpuddle-cards-prod
CF_R2_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
CF_R2_PUBLIC_BASE_URL=https://cards.brainpuddle.com

TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
CLAIMS_ENCRYPTION_KEY=<32-byte-base64-or-64-char-hex>

VITE_POSTHOG_KEY=...
VITE_POSTHOG_HOST=...
ADMIN_DASH_TOKEN=...

RETENTION_DAYS=180
```

Feature flags (optional, defaults to enabled):

```bash
VITE_FEATURE_CLAIM_FORM=true
VITE_FEATURE_PERSISTENT_SHARE=true
VITE_FEATURE_OPS_DASH=true
```

## 4) Netlify routing

`netlify.toml` is configured with:
- `/api/share-card/create -> /.netlify/functions/share-card-create`
- `/api/* -> /.netlify/functions/:splat`
- `/s/* -> /.netlify/functions/share-resolve?id=:splat`
- SPA fallback `/* -> /index.html`

## 5) Deployed endpoints

- `GET /api/claim-counter`
- `POST /api/claim-card`
- `POST /api/ai-run`
- `POST /api/share-card/create`
- `GET /api/shared-card?id={shareId}`
- `GET /s/{shareId}`
- `GET /api/ops-metrics`

## 6) Local testing

Run backend (Node 22 required):

```bash
npx -y node@22 server.js
```

Run frontend:

```bash
npx -y node@22 ./node_modules/vite/bin/vite.js
```

App URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## 7) Production validation checklist

1. `GET /api/claim-counter` returns remaining from D1.
2. `POST /api/claim-card` decrements inventory and stores encrypted claim fields.
3. `POST /api/share-card/create` returns `https://brainpuddle.com/s/{id}`.
4. `GET /s/{id}` HTML contains `og:image`, `og:title`, `og:url`.
5. Opening `/s/{id}` redirects to `/ai-score/shared/{id}` with exact stored card.
6. `GET /api/ops-metrics` returns counts and recent rows (token-protected if `ADMIN_DASH_TOKEN` set).
7. PostHog receives:
- `page_view`
- `nav_click`
- `ai_scan_submitted|succeeded|failed`
- `ai_card_generated`
- `ai_share_clicked|ai_share_created|ai_share_failed`
- `claim_form_viewed|submitted|success|failed|sold_out`

## 8) Notes

- LinkedIn image previews require a public HTTPS `og:image` URL, so R2 public URL/domain must be configured in production.
- If Cloudflare credentials are missing, local fallback still works but social crawlers may not show the image preview.
