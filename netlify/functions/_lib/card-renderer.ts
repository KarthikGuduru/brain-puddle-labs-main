/**
 * Server-side full card SVG renderer for print-ready physical cards.
 * Replicates the PokemonCard front-face design as a standalone SVG.
 * Output: 750×1050 px (2.5" × 3.5" trading card at 300 DPI).
 */

interface CardData {
    name: string;
    title: string;
    type: string;
    photoDataUrl: string;
    hp: number;
    score: number;
    tier: string;
    stage: string;
    primaryDomain: string;
    operatingMode: string;
    humanLeverage: string;
    skills: string[];
    powerUps: { name: string; desc: string }[];
    stats: {
        cognitiveDepth: number;
        decisionAutonomy: number;
        adaptability: number;
        systemLeverage: number;
    };
}

const escSvg = (s: string) =>
    String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const getTypeColors = (type: string) => {
    switch (type.toLowerCase()) {
        case 'creative':
            return { g1: '#ff9a9e', g2: '#fecfef', icon: '✨', bar: '#d94a7b' };
        case 'engineering':
            return { g1: '#84fab0', g2: '#8fd3f4', icon: '⚙️', bar: '#2b9a6e' };
        case 'strategy':
            return { g1: '#fa709a', g2: '#fee140', icon: '🧠', bar: '#c75a30' };
        default:
            return { g1: '#cfd9df', g2: '#e2ebf0', icon: '💼', bar: '#5a6a78' };
    }
};

const truncate = (s: string, max: number) =>
    s.length > max ? s.slice(0, max - 1) + '…' : s;

export const buildFullCardSvg = (data: CardData): string => {
    const W = 750;
    const H = 1050;
    const c = getTypeColors(data.type);
    const resilience = data.score != null ? 100 - data.score : data.hp;
    const tierLabel = (data.tier || data.stage || '')
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
        .trim()
        .toUpperCase();

    const nameFontSize = data.name.length > 20 ? 28 : data.name.length > 12 ? 34 : 42;

    const skills = (data.skills || []).slice(0, 4);
    const powerUps = (data.powerUps || []).slice(0, 2);

    const statEntries = [
        { label: 'Cognitive Depth', value: data.stats.cognitiveDepth },
        { label: 'Decision Autonomy', value: data.stats.decisionAutonomy },
        { label: 'Adaptability', value: data.stats.adaptability },
        { label: 'System Leverage', value: data.stats.systemLeverage },
    ];

    const statBarColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];

    // Skills chips SVG
    const skillChips = skills.map((sk, i) => {
        const chipW = Math.min(160, sk.length * 12 + 24);
        const x = 30 + i * (chipW + 8);
        return `<rect x="${x}" y="618" width="${chipW}" height="28" rx="14" fill="rgba(255,255,255,0.35)"/>
        <text x="${x + chipW / 2}" y="636" text-anchor="middle" font-size="13" font-weight="600" fill="#333">${escSvg(truncate(sk, 14))}</text>`;
    }).join('\n');

    // Power-ups SVG
    const puSvg = powerUps.map((pu, i) => {
        const y = 665 + i * 72;
        const stars = i === 0 ? '⭐' : '⭐⭐';
        const dmg = (pu.name.length * 7 % 40) + 20;
        return `
        <text x="30" y="${y + 20}" font-size="18" fill="#333">${stars}</text>
        <text x="80" y="${y + 16}" font-size="20" font-weight="700" fill="#222">${escSvg(truncate(pu.name, 28))}</text>
        <text x="80" y="${y + 38}" font-size="13" fill="#555">${escSvg(truncate(pu.desc, 60))}</text>
        <text x="${W - 30}" y="${y + 22}" text-anchor="end" font-size="24" font-weight="800" fill="#222">${dmg}</text>
        <line x1="30" y1="${y + 55}" x2="${W - 30}" y2="${y + 55}" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>`;
    }).join('\n');

    // Stat bars SVG
    const statsSvg = statEntries.map((st, i) => {
        const y = 830 + i * 42;
        const barW = 380;
        const fillW = Math.round(barW * Math.min(st.value, 100) / 100);
        return `
        <text x="30" y="${y + 14}" font-size="13" font-weight="700" fill="#444">${escSvg(st.label)}</text>
        <rect x="${W - barW - 30}" y="${y + 2}" width="${barW}" height="14" rx="7" fill="rgba(0,0,0,0.08)"/>
        <rect x="${W - barW - 30}" y="${y + 2}" width="${fillW}" height="14" rx="7" fill="${statBarColors[i]}"/>
        <text x="${W - 25}" y="${y + 14}" text-anchor="end" font-size="12" font-weight="600" fill="#555">${st.value}</text>`;
    }).join('\n');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.g1}"/>
      <stop offset="100%" stop-color="${c.g2}"/>
    </linearGradient>
    <clipPath id="photoClip">
      <rect x="30" y="120" width="${W - 60}" height="380" rx="16"/>
    </clipPath>
    <linearGradient id="photoFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="70%" stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <mask id="photoMask">
      <rect x="30" y="120" width="${W - 60}" height="380" fill="url(#photoFade)"/>
    </mask>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.15)"/>
    </filter>
  </defs>

  <!-- Card body -->
  <rect width="${W}" height="${H}" rx="32" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" rx="32" fill="rgba(255,255,255,0.15)"/>

  <!-- Foil shimmer -->
  <rect width="${W}" height="${H}" rx="32" fill="url(#bg)" opacity="0.08"/>

  <!-- HEADER -->
  <rect x="30" y="20" width="auto" height="26" rx="13" fill="rgba(0,0,0,0.12)"/>
  <text x="44" y="39" font-size="13" font-weight="800" fill="#fff" letter-spacing="1">${escSvg(tierLabel)}</text>

  <text x="30" y="${72 + nameFontSize * 0.3}" font-size="${nameFontSize}" font-weight="900" fill="#222" font-family="'Inter','Helvetica Neue',Arial,sans-serif">${escSvg(truncate(data.name, 24))}</text>

  <!-- Resilience + type icon -->
  <text x="${W - 30}" y="42" text-anchor="end" font-size="14" font-weight="700" fill="#555" letter-spacing="1">RESILIENCE</text>
  <text x="${W - 30}" y="80" text-anchor="end" font-size="48" font-weight="900" fill="#222">${resilience}</text>
  <text x="${W - 90}" y="80" text-anchor="end" font-size="28">${c.icon}</text>

  <!-- PHOTO -->
  <rect x="30" y="120" width="${W - 60}" height="380" rx="16" fill="url(#bg)" filter="url(#cardShadow)"/>
  ${data.photoDataUrl ? `<image x="30" y="120" width="${W - 60}" height="380" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice" href="${escSvg(data.photoDataUrl)}"/>` : ''}

  <!-- Title bar overlay -->
  <rect x="30" y="440" width="${W - 60}" height="60" rx="0" fill="rgba(255,255,255,0.85)"/>
  <text x="${W / 2}" y="462" text-anchor="middle" font-size="15" font-weight="800" font-style="italic" fill="#222">${escSvg(data.title.toUpperCase())}</text>
  <text x="${W / 2}" y="486" text-anchor="middle" font-size="11" fill="#666">${escSvg(data.primaryDomain.toUpperCase())} · ${escSvg(data.operatingMode.toUpperCase())} · ${escSvg(data.humanLeverage.toUpperCase())}</text>

  <!-- Rounded bottom for photo area -->
  <rect x="30" y="490" width="${W - 60}" height="12" fill="url(#bg)"/>

  <!-- SKILLS -->
  ${skillChips}

  <!-- POWER-UPS -->
  ${puSvg}

  <!-- STAT BARS -->
  ${statsSvg}

  <!-- FOOTER -->
  <text x="${W / 2}" y="${H - 18}" text-anchor="middle" font-size="11" fill="rgba(0,0,0,0.3)" font-weight="700">brainpuddle.com © 2026</text>
</svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};
