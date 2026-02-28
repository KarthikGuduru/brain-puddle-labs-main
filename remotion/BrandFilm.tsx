import React from "react";
import {
    AbsoluteFill,
    Sequence,
    Audio,
    OffthreadVideo,
    staticFile,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Easing,
} from "remotion";
import "./styles/typography.css";

/* ═════════════════════════════════════════════
   CONSTANTS
   ═════════════════════════════════════════════ */
const BG = "#0B1020";
const CYAN = "#00C8FF";
const CYAN_DIM = "rgba(0,200,255,0.15)";
const CYAN_GLOW = "rgba(0,200,255,0.35)";
const WHITE = "#FFFFFF";
const FPS = 30;

const ease = Easing.bezier(0.42, 0, 0.58, 1); // easeInOut

/* ═════════════════════════════════════════════
   SHARED TEXT STYLE
   ═════════════════════════════════════════════ */
const textStyle: React.CSSProperties = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: WHITE,
    letterSpacing: "0.12em",
    fontWeight: 500,
    textAlign: "center",
    margin: 0,
    lineHeight: 1.4,
    position: "absolute",
    width: "100%",
    bottom: "18%",
    padding: "0 10%",
};

/* ═════════════════════════════════════════════
   HELPER — Glowing dot
   ═════════════════════════════════════════════ */
const GlowDot: React.FC<{
    x: number;
    y: number;
    radius?: number;
    opacity?: number;
    pulse?: number;
}> = ({ x, y, radius = 6, opacity = 1, pulse = 0 }) => {
    const r = radius + pulse * 2;
    return (
        <g>
            {/* Outer glow */}
            <circle
                cx={x}
                cy={y}
                r={r * 4}
                fill="none"
                stroke="none"
                opacity={opacity * 0.15}
            >
                <animate attributeName="r" values={`${r * 3};${r * 4};${r * 3}`} dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx={x} cy={y} r={r * 3} fill={CYAN_DIM} opacity={opacity * 0.3} />
            <circle cx={x} cy={y} r={r * 1.5} fill={CYAN_GLOW} opacity={opacity * 0.5} />
            <circle cx={x} cy={y} r={r} fill={CYAN} opacity={opacity * 0.9} />
            {/* Core bright center */}
            <circle cx={x} cy={y} r={r * 0.4} fill={WHITE} opacity={opacity * 0.8} />
        </g>
    );
};

/* ═════════════════════════════════════════════
   HELPER — Glowing line
   ═════════════════════════════════════════════ */
const GlowLine: React.FC<{
    x1: number; y1: number;
    x2: number; y2: number;
    progress: number;
    opacity?: number;
}> = ({ x1, y1, x2, y2, progress, opacity = 1 }) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const ex = x1 + dx * progress;
    const ey = y1 + dy * progress;
    return (
        <g opacity={opacity}>
            {/* Thick glow */}
            <line x1={x1} y1={y1} x2={ex} y2={ey}
                stroke={CYAN_DIM} strokeWidth={6} strokeLinecap="round" />
            {/* Core line */}
            <line x1={x1} y1={y1} x2={ex} y2={ey}
                stroke={CYAN} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
        </g>
    );
};

/* ═════════════════════════════════════════════
   DOT POSITIONS (normalized 0–1920 × 0–1080)
   ═════════════════════════════════════════════ */
const DOTS_INITIAL = [
    { x: 660, y: 420 },
    { x: 1260, y: 420 },
    { x: 960, y: 600 },
];

const EXTRA_NODES = [
    { x: 480, y: 320 },
    { x: 1440, y: 320 },
    { x: 560, y: 620 },
    { x: 1360, y: 620 },
    { x: 960, y: 260 },
    { x: 760, y: 720 },
    { x: 1160, y: 720 },
];

const CENTER = { x: 960, y: 480 };

/* ═════════════════════════════════════════════
   SCENE 1 — Three dots appear (0–4 s)
   ═════════════════════════════════════════════ */
const Scene1: React.FC = () => {
    const frame = useCurrentFrame();
    const D = 120; // 4s

    // Floating offset
    const floatY = (i: number) =>
        Math.sin((frame + i * 40) * 0.04) * 8;
    const floatX = (i: number) =>
        Math.cos((frame + i * 30) * 0.03) * 5;

    // Staggered dot appearance
    const dotOpacity = (i: number) =>
        interpolate(frame, [10 + i * 15, 25 + i * 15], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
        });

    // Text
    const textOp = interpolate(frame, [50, 70], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    const textSlide = interpolate(frame, [50, 70], [20, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    // Text fade out near end
    const textFadeOut = interpolate(frame, [105, 118], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            {/* Video background — drops */}
            <AbsoluteFill style={{ opacity: 0.35, filter: "saturate(0.4) contrast(1.2)" }}>
                <OffthreadVideo
                    src={staticFile("videos/7.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted
                />
            </AbsoluteFill>
            {/* Dark overlay for depth */}
            <AbsoluteFill style={{ backgroundColor: "rgba(11,16,32,0.6)" }} />
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {DOTS_INITIAL.map((d, i) => (
                    <GlowDot
                        key={i}
                        x={d.x + floatX(i)}
                        y={d.y + floatY(i)}
                        opacity={dotOpacity(i)}
                    />
                ))}
            </svg>
            <p style={{
                ...textStyle,
                fontSize: 64,
                opacity: textOp * textFadeOut,
                transform: `translateY(${textSlide}px)`,
            }}>
                Three minds.
            </p>
        </AbsoluteFill>
    );
};

/* ═════════════════════════════════════════════
   SCENE 2 — Lines connect + extra nodes (4–8 s)
   ═════════════════════════════════════════════ */
const Scene2: React.FC = () => {
    const frame = useCurrentFrame();
    const D = 120;

    const floatY = (i: number) => Math.sin((frame + i * 40) * 0.04) * 8;
    const floatX = (i: number) => Math.cos((frame + i * 30) * 0.03) * 5;

    // Lines connecting original 3 dots
    const lineProgress = (i: number) =>
        interpolate(frame, [5 + i * 12, 30 + i * 12], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
        });

    // Extra nodes fade in
    const extraOpacity = (i: number) =>
        interpolate(frame, [30 + i * 8, 50 + i * 8], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
        });

    // Text
    const textOp = interpolate(frame, [35, 55], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    const textSlide = interpolate(frame, [35, 55], [16, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    const textFadeOut = interpolate(frame, [105, 118], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    const connections: [number, number][] = [[0, 1], [1, 2], [0, 2]];

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            {/* Video background — blue light waves */}
            <AbsoluteFill style={{ opacity: 0.3, filter: "saturate(0.4) contrast(1.2)" }}>
                <OffthreadVideo
                    src={staticFile("videos/8.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted
                />
            </AbsoluteFill>
            <AbsoluteFill style={{ backgroundColor: "rgba(11,16,32,0.6)" }} />
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {/* Lines between original dots */}
                {connections.map(([a, b], i) => (
                    <GlowLine key={`l-${i}`}
                        x1={DOTS_INITIAL[a].x + floatX(a)} y1={DOTS_INITIAL[a].y + floatY(a)}
                        x2={DOTS_INITIAL[b].x + floatX(b)} y2={DOTS_INITIAL[b].y + floatY(b)}
                        progress={lineProgress(i)} />
                ))}
                {/* Original dots */}
                {DOTS_INITIAL.map((d, i) => (
                    <GlowDot key={`d-${i}`} x={d.x + floatX(i)} y={d.y + floatY(i)} />
                ))}
                {/* Extra nodes appearing */}
                {EXTRA_NODES.slice(0, 4).map((d, i) => (
                    <GlowDot key={`e-${i}`}
                        x={d.x + floatX(i + 3)} y={d.y + floatY(i + 3)}
                        radius={4} opacity={extraOpacity(i)} />
                ))}
            </svg>
            <p style={{
                ...textStyle,
                fontSize: 58,
                opacity: textOp * textFadeOut,
                transform: `translateY(${textSlide}px)`,
            }}>
                Different perspectives.
            </p>
        </AbsoluteFill>
    );
};

/* ═════════════════════════════════════════════
   SCENE 3 — Network grows + pulse (8–12 s)
   ═════════════════════════════════════════════ */
const Scene3: React.FC = () => {
    const frame = useCurrentFrame();
    const D = 120;

    const floatY = (i: number) => Math.sin((frame + i * 40) * 0.04) * 6;
    const floatX = (i: number) => Math.cos((frame + i * 30) * 0.03) * 4;

    const allNodes = [...DOTS_INITIAL, ...EXTRA_NODES];

    // Pulsing glow
    const pulse = Math.sin(frame * 0.12) * 0.3 + 0.7;

    // Extra lines between nearby nodes
    const networkConnections: [number, number][] = [
        [0, 1], [1, 2], [0, 2],
        [0, 3], [1, 4], [2, 5], [2, 6],
        [3, 7], [4, 7], [5, 8], [6, 9],
    ];

    // Line reveal
    const lineOp = (i: number) =>
        interpolate(frame, [0 + i * 3, 15 + i * 3], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
        });

    // Text 1: "One shared question."
    const text1Op = interpolate(frame, [15, 30, 55, 60], [0, 1, 1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    const text1Slide = interpolate(frame, [15, 30], [16, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    // Text 2: "What if systems could think?" (after 1.5s = 45 frames)
    const text2Op = interpolate(frame, [60, 75, 108, 118], [0, 1, 1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    const text2Slide = interpolate(frame, [60, 75], [16, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            {/* Video background — neural network */}
            <AbsoluteFill style={{ opacity: 0.3, filter: "saturate(0.4) contrast(1.2)" }}>
                <OffthreadVideo
                    src={staticFile("videos/9.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted
                />
            </AbsoluteFill>
            <AbsoluteFill style={{ backgroundColor: "rgba(11,16,32,0.6)" }} />
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {/* Network lines */}
                {networkConnections.map(([a, b], i) => {
                    if (a >= allNodes.length || b >= allNodes.length) return null;
                    return (
                        <GlowLine key={`nl-${i}`}
                            x1={allNodes[a].x + floatX(a)} y1={allNodes[a].y + floatY(a)}
                            x2={allNodes[b].x + floatX(b)} y2={allNodes[b].y + floatY(b)}
                            progress={1} opacity={lineOp(i) * pulse} />
                    );
                })}
                {/* All nodes */}
                {allNodes.map((d, i) => (
                    <GlowDot key={`n-${i}`}
                        x={d.x + floatX(i)} y={d.y + floatY(i)}
                        radius={i < 3 ? 6 : 4}
                        opacity={i < 3 ? 1 : lineOp(Math.max(0, i - 3))}
                        pulse={pulse * 2}
                    />
                ))}
            </svg>
            {/* Text 1 */}
            <p style={{
                ...textStyle, fontSize: 58,
                opacity: text1Op,
                transform: `translateY(${text1Slide}px)`,
            }}>
                One shared question.
            </p>
            {/* Text 2 */}
            <p style={{
                ...textStyle, fontSize: 54,
                opacity: text2Op,
                transform: `translateY(${text2Slide}px)`,
            }}>
                What if systems could think?
            </p>
        </AbsoluteFill>
    );
};

/* ═════════════════════════════════════════════
   SCENE 4 — Lines retract, nodes merge (12–16 s)
   ═════════════════════════════════════════════ */
const Scene4: React.FC = () => {
    const frame = useCurrentFrame();
    const D = 120;

    const allNodes = [...DOTS_INITIAL, ...EXTRA_NODES];

    // Merge progress: nodes move toward center
    const merge = interpolate(frame, [10, 100], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    // Line retraction
    const lineRetract = interpolate(frame, [0, 50], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    // Ripple
    const rippleR = interpolate(frame, [70, 120], [0, 180], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    const rippleOp = interpolate(frame, [70, 90, 110, 120], [0, 0.4, 0.15, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    // Central glow size
    const centralR = interpolate(frame, [60, 110], [0, 14], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });
    const centralGlowR = interpolate(frame, [60, 110], [0, 60], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    });

    const networkConnections: [number, number][] = [
        [0, 1], [1, 2], [0, 2], [0, 3], [1, 4], [2, 5], [2, 6],
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {/* Retracting lines */}
                {networkConnections.map(([a, b], i) => {
                    if (a >= allNodes.length || b >= allNodes.length) return null;
                    const ax = allNodes[a].x + (CENTER.x - allNodes[a].x) * merge;
                    const ay = allNodes[a].y + (CENTER.y - allNodes[a].y) * merge;
                    const bx = allNodes[b].x + (CENTER.x - allNodes[b].x) * merge;
                    const by = allNodes[b].y + (CENTER.y - allNodes[b].y) * merge;
                    return (
                        <GlowLine key={`rl-${i}`}
                            x1={ax} y1={ay} x2={bx} y2={by}
                            progress={1} opacity={lineRetract} />
                    );
                })}
                {/* Merging dots */}
                {allNodes.map((d, i) => {
                    const nx = d.x + (CENTER.x - d.x) * merge;
                    const ny = d.y + (CENTER.y - d.y) * merge;
                    const dotOp = interpolate(merge, [0.7, 1], [1, 0], {
                        extrapolateLeft: "clamp", extrapolateRight: "clamp",
                    });
                    return (
                        <GlowDot key={`md-${i}`}
                            x={nx} y={ny}
                            radius={i < 3 ? 6 : 4}
                            opacity={dotOp} />
                    );
                })}
                {/* Ripple ring */}
                <circle cx={CENTER.x} cy={CENTER.y} r={rippleR}
                    fill="none" stroke={CYAN} strokeWidth={1.5} opacity={rippleOp} />
                {/* Central glow */}
                <circle cx={CENTER.x} cy={CENTER.y} r={centralGlowR}
                    fill={CYAN_DIM} opacity={0.4} />
                <circle cx={CENTER.x} cy={CENTER.y} r={centralR}
                    fill={CYAN} opacity={0.85} />
                <circle cx={CENTER.x} cy={CENTER.y} r={centralR * 0.4}
                    fill={WHITE} opacity={0.7} />
            </svg>
        </AbsoluteFill>
    );
};

/* ═════════════════════════════════════════════
   SCENE 5 — High-Octane "Ultra" Geometric Reveal (16–20 s)
   ═════════════════════════════════════════════ */
const Scene5: React.FC = () => {
    const frame = useCurrentFrame();

    // Palette mimicking the custom logo
    const DARK = "#121212";
    const CREAM = "#F0F0E8";
    const GREY = "#3A3A3A";

    // Frame 1: Z-zoom in with rotation
    const frame1Scale = interpolate(frame, [0, 45], [0.1, 1], { extrapolateRight: "clamp", easing: ease });
    const frame1RotX = interpolate(frame, [0, 45], [60, 0], { extrapolateRight: "clamp", easing: ease });
    const frame1RotZ = interpolate(frame, [0, 45], [-45, 0], { extrapolateRight: "clamp", easing: ease });
    const frame1Op = interpolate(frame, [0, 5, 45], [0, 1, 1], { extrapolateRight: "clamp" });

    // Frame 2: Lagging behind
    const frame2Scale = interpolate(frame, [5, 50], [0.1, 1.1], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: ease });
    const frame2RotY = interpolate(frame, [5, 50], [-70, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: ease });
    const frame2Op = interpolate(frame, [5, 10, 50, 70], [0, 0.5, 0.5, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

    // HUD lines
    const hudY = interpolate(frame, [0, 90], [1080, -200], { extrapolateRight: "extend" });

    // Text reveal
    const textOp = interpolate(frame, [35, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const letterSpacing = interpolate(frame, [35, 55], [0.5, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

    const sceneScale = interpolate(frame, [80, 120], [1, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

    // Generate random hex codes deterministically
    const randomHex = (seed: number) => {
        const x = Math.sin(seed + 1) * 10000;
        return `0x${Math.floor((x - Math.floor(x)) * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')}`;
    };

    return (
        <AbsoluteFill style={{ backgroundColor: DARK, overflow: "hidden" }}>
            <AbsoluteFill style={{ transform: `scale(${sceneScale})`, transformOrigin: "center" }}>

                {/* HUD Data Tracks */}
                <AbsoluteFill style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0 100px", opacity: 0.15 }}>
                    <div style={{ display: "flex", flexDirection: "column", transform: `translateY(${hudY}px)` }}>
                        {[...Array(10)].map((_, i) => (
                            <div key={`L${i}`} style={{ width: 2, height: 120, backgroundColor: CREAM, marginBottom: 40 }} />
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", transform: `translateY(${-hudY * 1.5 + 500}px)` }}>
                        {[...Array(15)].map((_, i) => (
                            <div key={`R${i}`} style={{ color: CREAM, fontFamily: "monospace", fontSize: 24, marginBottom: 60, fontWeight: "bold" }}>
                                {randomHex(i * 10)}
                            </div>
                        ))}
                    </div>
                </AbsoluteFill>

                {/* 3D Geometric Ring 1 */}
                <AbsoluteFill style={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    perspective: 1200,
                }}>
                    <div style={{
                        width: 1400, height: 400,
                        border: `12px solid ${GREY}`,
                        transformStyle: "preserve-3d",
                        transform: `scale(${frame2Scale}) rotateY(${frame2RotY}deg) translateZ(-200px)`,
                        opacity: frame2Op,
                        boxShadow: `0 0 60px ${GREY}`,
                    }} />
                </AbsoluteFill>

                {/* 3D Geometric Ring 2 (Main) */}
                <AbsoluteFill style={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    perspective: 1200,
                }}>
                    <div style={{
                        width: 1200, height: 300,
                        border: `16px solid ${CREAM}`,
                        transformStyle: "preserve-3d",
                        transform: `scale(${frame1Scale}) rotateX(${frame1RotX}deg) rotateZ(${frame1RotZ}deg)`,
                        opacity: frame1Op,
                        position: "relative",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        backgroundColor: frame > 45 ? DARK : "transparent",
                    }}>
                        <div style={{ position: "absolute", top: -16, left: -16, width: 60, height: 60, backgroundColor: DARK, borderRight: `16px solid ${CREAM}`, borderBottom: `16px solid ${CREAM}` }} />
                        <div style={{ position: "absolute", bottom: -16, right: -16, width: 60, height: 60, backgroundColor: DARK, borderLeft: `16px solid ${CREAM}`, borderTop: `16px solid ${CREAM}` }} />

                        <h1 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 100,
                            fontWeight: 500,
                            color: CREAM,
                            margin: 0,
                            opacity: textOp,
                            letterSpacing: `${letterSpacing}em`,
                            transform: `translateZ(50px)`,
                        }}>
                            brain puddle
                        </h1>
                    </div>
                </AbsoluteFill>

                {/* Optional rapid flash overlays */}
                {frame === 45 && <AbsoluteFill style={{ backgroundColor: CREAM, opacity: 0.8 }} />}
                {frame === 47 && <AbsoluteFill style={{ backgroundColor: CREAM, opacity: 0.3 }} />}

            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═════════════════════════════════════════════
   MAIN COMPOSITION — 20 s / 600 frames
   ═════════════════════════════════════════════ */
export const BrandFilm: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: BG }}>
            {/* Scene 1: 0–4 s */}
            <Sequence from={0} durationInFrames={120}>
                <Scene1 />
            </Sequence>

            {/* Scene 2: 4–8 s */}
            <Sequence from={120} durationInFrames={120}>
                <Scene2 />
            </Sequence>

            {/* Scene 3: 8–12 s */}
            <Sequence from={240} durationInFrames={120}>
                <Scene3 />
            </Sequence>

            {/* Scene 4: 12–16 s */}
            <Sequence from={360} durationInFrames={120}>
                <Scene4 />
            </Sequence>

            {/* Scene 5: 16–20 s */}
            <Sequence from={480} durationInFrames={120}>
                <Scene5 />
            </Sequence>

            {/* ── Audio ─── */}
            {/* Background music: Submerged Reflections */}
            <Sequence from={0}>
                <Audio
                    src={staticFile("Audio/Submerged_Reflections.mp3")}
                    volume={(f) =>
                        interpolate(f,
                            [0, 25, 569, 600],
                            [0, 0.18, 0.18, 0],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                        )
                    }
                />
            </Sequence>

            {/* Narration — aligned to match on-screen text */}
            {/* Scene 1 text "Three minds." appears at frame 50 */}
            <Sequence from={50}>
                <Audio src={staticFile("Audio/narration/narration_1.mp3")} volume={0.9} />
            </Sequence>
            {/* Scene 2 text "Different perspectives." appears at frame 155 */}
            <Sequence from={155}>
                <Audio src={staticFile("Audio/narration/narration_perspectives.mp3")} volume={0.9} />
            </Sequence>
            {/* Scene 3 text "One shared question." appears at frame 255 */}
            <Sequence from={255}>
                <Audio src={staticFile("Audio/narration/narration_2.mp3")} volume={0.9} />
            </Sequence>
            {/* Scene 3 text "What if systems could think?" appears at frame 300 */}
            <Sequence from={300}>
                <Audio src={staticFile("Audio/narration/narration_3.mp3")} volume={0.9} />
            </Sequence>
            {/* Scene 5 branding text appears at frame 500 */}
            <Sequence from={500}>
                <Audio src={staticFile("Audio/narration/narration_4.mp3")} volume={0.9} />
            </Sequence>
        </AbsoluteFill>
    );
};
