import { Handler } from '@netlify/functions';

const getInitials = (name: string) =>
    String(name || "BrainPuddle User")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "BP";

/**
 * Generates a premium stylised SVG with centred initials.
 * Uses a seeded palette so the same name always gets the same colour combo.
 */
const buildStylisedInitialsImage = (name: string) => {
    const initials = getInitials(name).replace(/[^A-Z0-9]/g, "").slice(0, 2) || "BP";

    // Deterministic colour palette based on the name
    const palettes = [
        { bg1: '#667eea', bg2: '#764ba2', accent: '#a78bfa', text: '#ffffff', shadow: 'rgba(102,126,234,0.6)' },
        { bg1: '#f093fb', bg2: '#f5576c', accent: '#fda4af', text: '#ffffff', shadow: 'rgba(240,147,251,0.6)' },
        { bg1: '#4facfe', bg2: '#00f2fe', accent: '#7dd3fc', text: '#ffffff', shadow: 'rgba(79,172,254,0.6)' },
        { bg1: '#43e97b', bg2: '#38f9d7', accent: '#6ee7b7', text: '#ffffff', shadow: 'rgba(67,233,123,0.6)' },
        { bg1: '#fa709a', bg2: '#fee140', accent: '#fbbf24', text: '#ffffff', shadow: 'rgba(250,112,154,0.6)' },
        { bg1: '#a18cd1', bg2: '#fbc2eb', accent: '#c4b5fd', text: '#ffffff', shadow: 'rgba(161,140,209,0.6)' },
        { bg1: '#ffecd2', bg2: '#fcb69f', accent: '#fdba74', text: '#7c2d12', shadow: 'rgba(252,182,159,0.6)' },
        { bg1: '#89f7fe', bg2: '#66a6ff', accent: '#93c5fd', text: '#ffffff', shadow: 'rgba(137,247,254,0.6)' },
    ];
    const hash = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const p = palettes[hash % palettes.length];

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1024" viewBox="0 0 768 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="${p.shadow}" flood-opacity="0.8"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="768" height="1024" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="120" cy="180" r="120" fill="rgba(255,255,255,0.08)"/>
  <circle cx="650" cy="850" r="160" fill="rgba(255,255,255,0.06)"/>
  <circle cx="600" cy="200" r="80" fill="rgba(255,255,255,0.05)"/>
  <circle cx="180" cy="800" r="100" fill="rgba(255,255,255,0.04)"/>

  <!-- Glass card -->
  <rect x="84" y="212" width="600" height="600" rx="48" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <rect x="84" y="212" width="600" height="300" rx="48" fill="url(#shine)"/>

  <!-- Glow behind initials -->
  <text x="384" y="545" text-anchor="middle" dominant-baseline="central" font-size="240" font-family="'Inter','Helvetica Neue',Arial,sans-serif" font-weight="900" fill="${p.accent}" opacity="0.3" filter="url(#glow)">${initials}</text>

  <!-- Main initials with shadow -->
  <text x="384" y="545" text-anchor="middle" dominant-baseline="central" font-size="240" font-family="'Inter','Helvetica Neue',Arial,sans-serif" font-weight="900" fill="${p.text}" letter-spacing="12" filter="url(#shadow)">${initials}</text>

  <!-- Shine overlay on initials -->
  <text x="384" y="525" text-anchor="middle" dominant-baseline="central" font-size="240" font-family="'Inter','Helvetica Neue',Arial,sans-serif" font-weight="900" fill="rgba(255,255,255,0.15)" letter-spacing="12">${initials}</text>

  <!-- Subtitle -->
  <text x="384" y="680" text-anchor="middle" font-size="28" font-family="'Inter','Helvetica Neue',Arial,sans-serif" font-weight="500" fill="${p.text}" opacity="0.7" letter-spacing="6">BRAINPUDDLE</text>

  <!-- Decorative line -->
  <line x1="284" y1="720" x2="484" y2="720" stroke="${p.text}" stroke-opacity="0.2" stroke-width="2"/>
</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name, imagePromptBase64 } = JSON.parse(event.body || '{}');

        // If the user uploaded an image, pass it through unchanged
        if (imagePromptBase64) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: imagePromptBase64 })
            };
        }

        // No user image → return stylised initials SVG (no Flux tokens used)
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageUrl: buildStylisedInitialsImage(name),
                fallback: false
            })
        };

    } catch (error: any) {
        console.error("Generate card error:", error.message);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageUrl: buildStylisedInitialsImage("BrainPuddle User"),
                fallback: true
            })
        };
    }
};
