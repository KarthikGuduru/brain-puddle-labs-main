import React from "react";
import {
    AbsoluteFill,
    Sequence,
    Audio,
    staticFile,
    interpolate,
    useCurrentFrame,
    Easing,
} from "remotion";
import "./styles/typography.css";

/* ═══ CONSTANTS ═══ */
const BG = "#0A0E1A";
const CYAN = "#00C8FF";
const CYAN_DIM = "rgba(0,200,255,0.12)";
const CYAN_GLOW = "rgba(0,200,255,0.3)";
const AMBER = "#FFB347";
const AMBER_DIM = "rgba(255,179,71,0.15)";
const WHITE = "#FFFFFF";

const easeIO = Easing.bezier(0.42, 0, 0.58, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeSnap = Easing.bezier(0.68, -0.55, 0.27, 1.55); // bounce

/* ═══ TEXT STYLE ═══ */
const txt: React.CSSProperties = {
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: WHITE,
    letterSpacing: "0.08em",
    fontWeight: 600,
    textAlign: "center",
    margin: 0,
    lineHeight: 1.3,
};

/* ═══ HELPERS ═══ */
const Dot: React.FC<{
    x: number; y: number; r?: number; opacity?: number; color?: string;
}> = ({ x, y, r = 6, opacity = 1, color = CYAN }) => (
    <g>
        <circle cx={x} cy={y} r={r * 3} fill={color === CYAN ? CYAN_DIM : AMBER_DIM} opacity={opacity * 0.3} />
        <circle cx={x} cy={y} r={r * 1.3} fill={color === CYAN ? CYAN_GLOW : AMBER_DIM} opacity={opacity * 0.5} />
        <circle cx={x} cy={y} r={r} fill={color} opacity={opacity * 0.9} />
        <circle cx={x} cy={y} r={r * 0.35} fill={WHITE} opacity={opacity * 0.7} />
    </g>
);

const Line: React.FC<{
    x1: number; y1: number; x2: number; y2: number; opacity?: number; color?: string;
}> = ({ x1, y1, x2, y2, opacity = 1, color = CYAN }) => (
    <g opacity={opacity}>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color === CYAN ? CYAN_DIM : AMBER_DIM} strokeWidth={4} strokeLinecap="round" />
        <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
    </g>
);

const CENTER = { x: 960, y: 480 };

/* ═══════════════════════════════════════════════
   SCENE 1 — Confident intro (0–3 s / 90 frames)
   "So we decided to build an AI startup."
   ═══════════════════════════════════════════════ */
const Scene1: React.FC = () => {
    const f = useCurrentFrame();

    // 3 dots pop in fast
    const dots = [
        { x: 810, y: 400 }, { x: 1110, y: 400 }, { x: 960, y: 550 },
    ];
    const dotScale = (i: number) =>
        interpolate(f, [5 + i * 6, 12 + i * 6], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeSnap,
        });

    // Text pop-in
    const textOp = interpolate(f, [25, 35], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });
    const textScale = interpolate(f, [25, 35], [0.85, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeSnap,
    });
    const textFade = interpolate(f, [78, 88], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", width: "100%", height: "100%" }}>
                {dots.map((d, i) => (
                    <Dot key={i} x={d.x} y={d.y} r={8 * dotScale(i)} opacity={dotScale(i)} />
                ))}
            </svg>
            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                opacity: textOp * textFade,
                transform: `scale(${textScale})`,
            }}>
                <p style={{ ...txt, fontSize: 54 }}>
                    So we decided to build an AI startup.
                </p>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════
   SCENE 2 — Chaos builds (3–7 s / 120 frames)
   Rapid text + network explosion
   ═══════════════════════════════════════════════ */
const Scene2: React.FC = () => {
    const f = useCurrentFrame();

    const lines = [
        "Add a chatbot.",
        "Add automation.",
        "Add 47 dashboards.",
        "Add AI agents.",
        "Add more AI.",
    ];
    const INTERVAL = 18; // frames per line

    // Which line is active
    const activeIdx = Math.min(Math.floor(f / INTERVAL), lines.length - 1);

    // Per-line opacity + bounce
    const lineOp = (i: number) => {
        const start = i * INTERVAL;
        return interpolate(f, [start, start + 6, start + INTERVAL - 2, start + INTERVAL], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
    };
    const lineBounce = (i: number) => {
        const start = i * INTERVAL;
        return interpolate(f, [start, start + 8], [1.15, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeSnap,
        });
    };

    // Chaos network — nodes multiply
    const nodeCount = Math.min(3 + Math.floor(f / 5), 30);
    const chaosNodes: { x: number; y: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
        const seed = i * 137.508; // golden angle
        const angle = (seed % 360) * (Math.PI / 180);
        const dist = 80 + (i * 12) + Math.sin(f * 0.1 + i) * 20;
        chaosNodes.push({
            x: CENTER.x + Math.cos(angle) * dist,
            y: CENTER.y + Math.sin(angle) * dist,
        });
    }

    // Subtle shake
    const shakeX = Math.sin(f * 0.8) * (f > 40 ? 2 : 0);
    const shakeY = Math.cos(f * 1.1) * (f > 40 ? 1.5 : 0);

    return (
        <AbsoluteFill style={{
            backgroundColor: BG,
            transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", width: "100%", height: "100%" }}>
                {/* Tangled lines */}
                {chaosNodes.map((n, i) => {
                    if (i === 0) return null;
                    const target = chaosNodes[(i * 7 + 3) % Math.max(1, i)];
                    return (
                        <Line key={`cl-${i}`}
                            x1={n.x} y1={n.y} x2={target.x} y2={target.y}
                            opacity={0.4} color={i % 3 === 0 ? AMBER : CYAN} />
                    );
                })}
                {/* Chaos dots */}
                {chaosNodes.map((n, i) => (
                    <Dot key={`cd-${i}`} x={n.x} y={n.y} r={3 + (i < 3 ? 3 : 0)}
                        color={i % 4 === 0 ? AMBER : CYAN} opacity={0.8} />
                ))}
            </svg>

            {/* Rapid text flashes */}
            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "flex-end",
                paddingBottom: "15%",
            }}>
                {lines.map((line, i) => (
                    <p key={i} style={{
                        ...txt, fontSize: 48,
                        position: "absolute",
                        opacity: lineOp(i),
                        transform: `scale(${lineBounce(i)})`,
                        color: i >= 3 ? AMBER : WHITE,
                    }}>
                        {line}
                    </p>
                ))}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════
   SCENE 3 — Reality check (7–11 s / 120 frames)
   "Now it's intelligent." → glitch → "...is it though?"
   ═══════════════════════════════════════════════ */
const Scene3: React.FC = () => {
    const f = useCurrentFrame();

    // Text 1: "Now it's intelligent."
    const t1Op = interpolate(f, [5, 15, 40, 45], [0, 1, 1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Glitch flicker at frame 45-55
    const glitch = f >= 45 && f <= 55
        ? (Math.sin(f * 15) > 0.3 ? 1 : 0.1)
        : 1;

    // Text 2: "...is it though?"
    const t2Op = interpolate(f, [58, 70, 108, 118], [0, 1, 1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Network collapse
    const collapse = interpolate(f, [30, 100], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });

    // Collapsing nodes
    const nodeCount = 25;
    const nodes: { x: number; y: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i * 137.508 % 360) * (Math.PI / 180);
        const maxDist = 80 + i * 12;
        const dist = maxDist * collapse;
        nodes.push({
            x: CENTER.x + Math.cos(angle) * dist,
            y: CENTER.y + Math.sin(angle) * dist,
        });
    }

    return (
        <AbsoluteFill style={{ backgroundColor: BG, opacity: glitch }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", width: "100%", height: "100%" }}>
                {nodes.map((n, i) => {
                    if (i === 0) return null;
                    const t = nodes[(i * 7 + 3) % Math.max(1, i)];
                    return (
                        <Line key={`l-${i}`} x1={n.x} y1={n.y} x2={t.x} y2={t.y}
                            opacity={collapse * 0.3} color={i % 3 === 0 ? AMBER : CYAN} />
                    );
                })}
                {nodes.map((n, i) => (
                    <Dot key={`d-${i}`} x={n.x} y={n.y} r={2 + collapse * 3}
                        opacity={0.5 + collapse * 0.5} color={i % 4 === 0 ? AMBER : CYAN} />
                ))}
            </svg>
            {/* Text 1 */}
            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                opacity: t1Op,
            }}>
                <p style={{ ...txt, fontSize: 62 }}>Now it's intelligent.</p>
            </AbsoluteFill>
            {/* Text 2 */}
            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                opacity: t2Op,
            }}>
                <p style={{
                    ...txt, fontSize: 56, fontStyle: "italic", fontWeight: 400,
                    color: "rgba(255,255,255,0.8)"
                }}>
                    ...is it though?
                </p>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════
   SCENE 4 — Calm reset (11–15 s / 120 frames)
   "What if it actually thought?"
   Chaos → clean symmetrical network
   ═══════════════════════════════════════════════ */
const Scene4: React.FC = () => {
    const f = useCurrentFrame();

    // Single dot moves to center
    const heroOp = interpolate(f, [0, 20], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });

    // Clean network emergence
    const netOp = interpolate(f, [40, 70], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });

    // Symmetrical hex nodes
    const hexNodes: { x: number; y: number }[] = [CENTER];
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        hexNodes.push({
            x: CENTER.x + Math.cos(angle) * 180 * netOp,
            y: CENTER.y + Math.sin(angle) * 180 * netOp,
        });
    }

    // Text
    const textOp = interpolate(f, [30, 50], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });
    const textSlide = interpolate(f, [30, 50], [20, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", width: "100%", height: "100%" }}>
                {/* Lines from center to hex nodes */}
                {hexNodes.slice(1).map((n, i) => (
                    <Line key={`hl-${i}`}
                        x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y}
                        opacity={netOp * 0.6} />
                ))}
                {/* Outer ring connections */}
                {hexNodes.slice(1).map((n, i) => {
                    const next = hexNodes[1 + (i + 1) % 6];
                    return (
                        <Line key={`hr-${i}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y}
                            opacity={netOp * 0.4} />
                    );
                })}
                {/* Nodes */}
                {hexNodes.map((n, i) => (
                    <Dot key={`hn-${i}`} x={n.x} y={n.y}
                        r={i === 0 ? 10 : 5}
                        opacity={i === 0 ? heroOp : netOp} />
                ))}
            </svg>
            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "flex-end",
                paddingBottom: "16%",
                opacity: textOp,
                transform: `translateY(${textSlide}px)`,
            }}>
                <p style={{ ...txt, fontSize: 52, fontWeight: 500, letterSpacing: "0.1em" }}>
                    What if it actually thought?
                </p>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════
   SCENE 5 — Branding (15–20 s / 150 frames)
   Elegant network + "Brain Puddle"
   ═══════════════════════════════════════════════ */
const Scene5: React.FC = () => {
    const f = useCurrentFrame();

    // Background pulse
    const pulse = Math.sin(f * 0.06) * 0.02 + 0.98;

    // Elegant network fade
    const netOp = interpolate(f, [0, 20], [0.6, 0.25], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });

    // Hex nodes
    const hexNodes: { x: number; y: number }[] = [CENTER];
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        hexNodes.push({ x: CENTER.x + Math.cos(angle) * 160, y: CENTER.y + Math.sin(angle) * 160 });
    }

    // "Brain Puddle"
    const titleOp = interpolate(f, [15, 35], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });
    const titleSlide = interpolate(f, [15, 35], [30, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });



    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{
                    position: "absolute", width: "100%", height: "100%",
                    transform: `scale(${pulse})`, opacity: netOp,
                }}>
                {hexNodes.slice(1).map((n, i) => (
                    <Line key={`fl-${i}`} x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y} opacity={0.5} />
                ))}
                {hexNodes.slice(1).map((n, i) => {
                    const next = hexNodes[1 + (i + 1) % 6];
                    return <Line key={`fr-${i}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y} opacity={0.3} />;
                })}
                {hexNodes.map((n, i) => (
                    <Dot key={`fn-${i}`} x={n.x} y={n.y} r={i === 0 ? 8 : 4} />
                ))}
            </svg>

            <AbsoluteFill style={{
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center", gap: 16,
                paddingTop: 40,
            }}>
                <h1 style={{
                    ...txt, fontSize: 100, fontWeight: 600,
                    letterSpacing: "0.18em",
                    opacity: titleOp,
                    transform: `translateY(${titleSlide}px)`,
                }}>
                    Brain Puddle
                </h1>

            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════
   MAIN — 600 frames / 30 fps / 20 s
   ═══════════════════════════════════════════════ */
export const ChaosFilm: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            {/* Scene 1: 0–3s (90 frames) */}
            <Sequence from={0} durationInFrames={90}>
                <Scene1 />
            </Sequence>

            {/* Scene 2: 3–7s (120 frames) */}
            <Sequence from={90} durationInFrames={120}>
                <Scene2 />
            </Sequence>

            {/* Scene 3: 7–11s (120 frames) */}
            <Sequence from={210} durationInFrames={120}>
                <Scene3 />
            </Sequence>

            {/* Scene 4: 11–15s (120 frames) */}
            <Sequence from={330} durationInFrames={120}>
                <Scene4 />
            </Sequence>

            {/* Scene 5: 15–20s (150 frames) */}
            <Sequence from={450} durationInFrames={150}>
                <Scene5 />
            </Sequence>

            {/* ═══ AUDIO ═══ */}

            {/* Chrono Shift — full track */}
            <Sequence from={0}>
                <Audio
                    src={staticFile("Audio/Chrono_Shift.mp3")}
                    volume={(fr) =>
                        interpolate(fr,
                            [0, 15, 325, 335, 569, 600],
                            [0, 0.22, 0.22, 0.10, 0.10, 0],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                        )
                    }
                />
            </Sequence>

            {/* Narration — synced to text */}
            {/* Scene 1: "So we decided to build an AI startup." at text pop (frame 25) */}
            <Sequence from={25}>
                <Audio src={staticFile("Audio/narration/chaos_1.mp3")} volume={0.92} />
            </Sequence>

            {/* Scene 2: Rapid list (starts at frame 90) */}
            <Sequence from={92}>
                <Audio src={staticFile("Audio/narration/chaos_2.mp3")} volume={0.88} />
            </Sequence>

            {/* Scene 3: "Now it's intelligent." (frame 215) */}
            <Sequence from={215}>
                <Audio src={staticFile("Audio/narration/chaos_3a.mp3")} volume={0.9} />
            </Sequence>

            {/* Scene 3: "...is it though?" (frame 268) */}
            <Sequence from={268}>
                <Audio src={staticFile("Audio/narration/chaos_3b.mp3")} volume={0.9} />
            </Sequence>

            {/* Scene 4: "What if it actually thought?" (frame 360) */}
            <Sequence from={360}>
                <Audio src={staticFile("Audio/narration/chaos_4.mp3")} volume={0.9} />
            </Sequence>

            {/* Scene 5: Branding narration (frame 500) */}
            <Sequence from={500}>
                <Audio src={staticFile("Audio/narration/narration_4.mp3")} volume={0.85} />
            </Sequence>
        </AbsoluteFill>
    );
};
