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

/* ═══ PALETTE ═══ */
const BLACK = "#000000";
const NAVY = "#0A0E1A";
const CYAN = "#00C8FF";
const CYAN_DIM = "rgba(0,200,255,0.10)";
const CYAN_MID = "rgba(0,200,255,0.25)";
const AMBER = "#FFB347";
const AMBER_DIM = "rgba(255,179,71,0.12)";
const WHITE = "#FFFFFF";
const WHITE_70 = "rgba(255,255,255,0.7)";

const easeIO = Easing.bezier(0.42, 0, 0.58, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeSnap = Easing.bezier(0.68, -0.55, 0.27, 1.55);

const SVG_STYLE: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
};

/* ═══ HELPER: Random-looking number flicker (deterministic) ═══ */
const numFlicker = (frame: number, seed: number): string => {
    const vals = [
        "01.7392", "44.0021", "10.1101", "93.8814", "27.4401",
        "FF.A0C1", "0B.1020", "11.0010", "78.9920", "55.3312",
    ];
    return vals[(frame * 3 + seed * 7) % vals.length];
};

/* ═══════════════════════════════════════════════════════════
   SCENE 1 — Kinetic Typography "INTELLIGENCE" (0–2.5s / 75f)
   Loading bars + numeric flickers + fragmented text snap
   ═══════════════════════════════════════════════════════════ */
const Scene1: React.FC = () => {
    const f = useCurrentFrame();

    /* ── Loading bars ── */
    const barCount = 12;
    const bars = Array.from({ length: barCount }, (_, i) => {
        const delay = i * 3;
        const height = interpolate(f, [delay, delay + 20], [0, 400 + (i % 3) * 150], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
        });
        const opacity = interpolate(f, [delay, delay + 8, 50, 65], [0, 0.6, 0.6, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return { x: 160 + i * 140, height, opacity };
    });

    /* ── Numeric flickers ── */
    const flickerOp = interpolate(f, [5, 12, 40, 50], [0, 0.5, 0.5, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    /* ── Fragmented text ── */
    const fragments = ["INT", "ELL", "IGENCE"];
    const fragPositions = [
        { x: -200, y: -40 }, { x: 80, y: 60 }, { x: 300, y: -20 },
    ];
    // Fragments appear then snap to center
    const snapProgress = interpolate(f, [30, 50], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeSnap,
    });
    const textOp = interpolate(f, [20, 30], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(f, [60, 73], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BLACK }}>
            {/* Loading bars */}
            <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={SVG_STYLE}>
                {bars.map((b, i) => (
                    <rect key={i}
                        x={b.x} y={1080 - b.height} width={3} height={b.height}
                        fill={i % 3 === 0 ? AMBER : CYAN}
                        opacity={b.opacity} />
                ))}
            </svg>

            {/* Numeric flickers */}
            <AbsoluteFill style={{ opacity: flickerOp }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span key={i} style={{
                        position: "absolute",
                        left: `${15 + i * 14}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        fontFamily: "'Inter', monospace",
                        fontSize: 14,
                        color: CYAN,
                        opacity: 0.4,
                        letterSpacing: "0.15em",
                    }}>
                        {numFlicker(f, i)}
                    </span>
                ))}
            </AbsoluteFill>

            {/* Fragmented → snapped INTELLIGENCE */}
            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                opacity: textOp * fadeOut,
            }}>
                <div style={{ position: "relative", display: "flex" }}>
                    {fragments.map((frag, i) => {
                        const offsetX = fragPositions[i].x * (1 - snapProgress);
                        const offsetY = fragPositions[i].y * (1 - snapProgress);
                        return (
                            <span key={i} style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 90,
                                fontWeight: 800,
                                color: WHITE,
                                letterSpacing: "0.15em",
                                transform: `translate(${offsetX}px, ${offsetY}px)`,
                                display: "inline-block",
                            }}>
                                {frag}
                            </span>
                        );
                    })}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════
   SCENE 2 — "SYSTEMS" with tracking expansion (2.5–5s / 75f)
   Angular shapes + grid + push-in
   ═══════════════════════════════════════════════════════════ */
const Scene2: React.FC = () => {
    const f = useCurrentFrame();

    /* ── Angular shapes sliding diagonally ── */
    const slideProgress = interpolate(f, [0, 40], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });

    /* ── Grid lines ── */
    const gridOp = interpolate(f, [10, 30], [0, 0.15], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    /* ── Push-in scale ── */
    const pushIn = interpolate(f, [0, 75], [0.98, 1.02], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });

    /* ── Text: SYSTEMS with tracking expansion ── */
    const textOp = interpolate(f, [20, 35], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });
    const tracking = interpolate(f, [20, 45], [0.5, 0.2], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });
    const fadeOut = interpolate(f, [63, 73], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BLACK, transform: `scale(${pushIn})` }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={SVG_STYLE}>
                {/* Diagonal angular shapes */}
                {[0, 1, 2, 3].map((i) => {
                    const x1 = -200 + slideProgress * (600 + i * 400);
                    const y1 = 200 + i * 180;
                    return (
                        <g key={`ang-${i}`} opacity={0.3}>
                            <line x1={x1} y1={y1} x2={x1 + 300} y2={y1 - 150}
                                stroke={i % 2 === 0 ? CYAN : AMBER} strokeWidth={1.5} />
                            <line x1={x1 + 300} y1={y1 - 150} x2={x1 + 500} y2={y1 - 100}
                                stroke={i % 2 === 0 ? CYAN : AMBER} strokeWidth={1} />
                        </g>
                    );
                })}
                {/* Grid lines */}
                {Array.from({ length: 10 }, (_, i) => (
                    <g key={`grid-${i}`} opacity={gridOp}>
                        <line x1={0} y1={i * 120} x2={1920} y2={i * 120}
                            stroke={CYAN_DIM} strokeWidth={0.5} />
                        <line x1={i * 200} y1={0} x2={i * 200} y2={1080}
                            stroke={CYAN_DIM} strokeWidth={0.5} />
                    </g>
                ))}
                {/* Intersecting accent lines */}
                <line x1={0} y1={0} x2={1920} y2={1080}
                    stroke={AMBER_DIM} strokeWidth={1} opacity={slideProgress * 0.4} />
                <line x1={1920} y1={0} x2={0} y2={1080}
                    stroke={CYAN_DIM} strokeWidth={1} opacity={slideProgress * 0.3} />
            </svg>

            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                opacity: textOp * fadeOut,
            }}>
                <h1 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 110,
                    fontWeight: 800,
                    color: WHITE,
                    letterSpacing: `${tracking}em`,
                    margin: 0,
                }}>
                    SYSTEMS
                </h1>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════
   SCENE 3 — Network snap + "THINKING > AUTOMATION" (5–8s / 90f)
   ═══════════════════════════════════════════════════════════ */
const Scene3: React.FC = () => {
    const f = useCurrentFrame();

    /* ── Network growth phase (0–45) then hard snap ── */
    const isSnapped = f >= 45;
    const growProgress = interpolate(f, [0, 40], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });

    const CX = 960, CY = 480;

    // Chaotic nodes growing
    const chaosNodes: { x: number; y: number }[] = [];
    const count = Math.min(Math.floor(f * 0.8), 30);
    for (let i = 0; i < count; i++) {
        const angle = (i * 137.508 % 360) * (Math.PI / 180);
        const dist = 40 + i * 10 + Math.sin(f * 0.15 + i) * 15;
        chaosNodes.push({ x: CX + Math.cos(angle) * dist, y: CY + Math.sin(angle) * dist });
    }

    // Snapped symmetrical nodes (8 points in octagon)
    const snapNodes: { x: number; y: number }[] = [{ x: CX, y: CY }];
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * (Math.PI / 180);
        snapNodes.push({ x: CX + Math.cos(angle) * 200, y: CY + Math.sin(angle) * 200 });
    }

    const activeNodes = isSnapped ? snapNodes : chaosNodes;
    const snapFlash = isSnapped
        ? interpolate(f, [45, 48, 55], [0.8, 0.8, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
        })
        : 0;

    // Text
    const textOp = interpolate(f, [50, 62], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });
    const fadeOut = interpolate(f, [78, 88], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BLACK }}>
            {/* White flash on snap */}
            <AbsoluteFill style={{ backgroundColor: WHITE, opacity: snapFlash }} />

            <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={SVG_STYLE}>
                {/* Lines */}
                {activeNodes.map((n, i) => {
                    if (i === 0) return null;
                    const target = isSnapped ? snapNodes[0] : chaosNodes[(i * 5 + 2) % Math.max(1, i)];
                    return (
                        <line key={`nl-${i}`}
                            x1={n.x} y1={n.y} x2={target.x} y2={target.y}
                            stroke={isSnapped ? CYAN : (i % 3 === 0 ? AMBER : CYAN)}
                            strokeWidth={isSnapped ? 1 : 0.8}
                            opacity={isSnapped ? 0.4 : 0.25} />
                    );
                })}
                {/* Outer ring on snap */}
                {isSnapped && snapNodes.slice(1).map((n, i) => {
                    const next = snapNodes[1 + (i + 1) % 8];
                    return (
                        <line key={`or-${i}`}
                            x1={n.x} y1={n.y} x2={next.x} y2={next.y}
                            stroke={CYAN} strokeWidth={0.8} opacity={0.3} />
                    );
                })}
                {/* Dots */}
                {activeNodes.map((n, i) => (
                    <g key={`nd-${i}`}>
                        <circle cx={n.x} cy={n.y} r={isSnapped && i === 0 ? 8 : 3}
                            fill={i % 4 === 0 ? AMBER : CYAN} opacity={0.8} />
                        <circle cx={n.x} cy={n.y} r={isSnapped && i === 0 ? 3 : 1}
                            fill={WHITE} opacity={0.6} />
                    </g>
                ))}
            </svg>

            <AbsoluteFill style={{
                display: "flex", justifyContent: "center", alignItems: "flex-end",
                paddingBottom: "12%",
                opacity: textOp * fadeOut,
            }}>
                <h1 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 60,
                    fontWeight: 700,
                    color: WHITE,
                    letterSpacing: "0.12em",
                    margin: 0,
                }}>
                    THINKING <span style={{ color: AMBER, fontWeight: 400 }}>&gt;</span> AUTOMATION
                </h1>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════
   SCENE 4 — Orbiting shapes merge (8–12s / 120f)
   Three geometric shapes orbit → merge into sphere
   ═══════════════════════════════════════════════════════════ */
const Scene4: React.FC = () => {
    const f = useCurrentFrame();

    // Orbit radius decreases as shapes merge
    const orbitR = interpolate(f, [0, 90], [200, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });
    const rotSpeed = 0.06;
    const CX = 960, CY = 480;

    // Three shapes orbiting
    const shapes = [0, 1, 2].map((i) => {
        const baseAngle = i * (2 * Math.PI / 3);
        const angle = baseAngle + f * rotSpeed;
        return {
            x: CX + Math.cos(angle) * orbitR,
            y: CY + Math.sin(angle) * orbitR,
            color: i === 0 ? CYAN : i === 1 ? AMBER : WHITE_70,
        };
    });

    // Merge glow
    const mergeProgress = interpolate(f, [70, 110], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });
    const shapeOp = interpolate(f, [70, 100], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Bloom
    const bloomR = interpolate(f, [85, 120], [0, 120], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });
    const bloomOp = interpolate(f, [85, 95, 110, 120], [0, 0.4, 0.2, 0.1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Orbit trail lines
    const trailOp = interpolate(f, [0, 20, 70, 90], [0, 0.25, 0.25, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BLACK }}>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={SVG_STYLE}>
                {/* Orbit path circle */}
                <circle cx={CX} cy={CY} r={orbitR} fill="none"
                    stroke={CYAN_DIM} strokeWidth={0.8} opacity={trailOp} />

                {/* Connecting lines between shapes */}
                {shapes.map((s, i) => {
                    const next = shapes[(i + 1) % 3];
                    return (
                        <line key={`ol-${i}`}
                            x1={s.x} y1={s.y} x2={next.x} y2={next.y}
                            stroke={CYAN} strokeWidth={0.8} opacity={shapeOp * 0.3} />
                    );
                })}

                {/* Three geometric shapes */}
                {shapes.map((s, i) => (
                    <g key={`shape-${i}`} opacity={shapeOp}>
                        {/* Shape 0: triangle, 1: square, 2: circle */}
                        {i === 0 && (
                            <polygon
                                points={`${s.x},${s.y - 18} ${s.x - 16},${s.y + 12} ${s.x + 16},${s.y + 12}`}
                                fill={s.color} opacity={0.8} />
                        )}
                        {i === 1 && (
                            <rect x={s.x - 14} y={s.y - 14} width={28} height={28}
                                fill={s.color} opacity={0.8}
                                transform={`rotate(${f * 1.5}, ${s.x}, ${s.y})`} />
                        )}
                        {i === 2 && (
                            <circle cx={s.x} cy={s.y} r={14} fill={s.color} opacity={0.8} />
                        )}
                    </g>
                ))}

                {/* Merged glowing sphere */}
                <circle cx={CX} cy={CY} r={bloomR}
                    fill={CYAN_DIM} opacity={bloomOp * 0.5} />
                <circle cx={CX} cy={CY} r={bloomR * 0.4}
                    fill={CYAN_MID} opacity={bloomOp * 0.7} />
                <circle cx={CX} cy={CY} r={14 * mergeProgress}
                    fill={CYAN} opacity={mergeProgress * 0.9} />
                <circle cx={CX} cy={CY} r={5 * mergeProgress}
                    fill={WHITE} opacity={mergeProgress * 0.7} />
            </svg>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════
   SCENE 5 — Branding (12–16s / 120f)
   Radial light + Brain Puddle + fade out
   ═══════════════════════════════════════════════════════════ */
const Scene5: React.FC = () => {
    const f = useCurrentFrame();
    const CX = 960, CY = 480;

    // Radial glow
    const glowR = interpolate(f, [0, 40], [60, 250], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });
    const glowOp = interpolate(f, [0, 20, 90, 120], [0, 0.2, 0.15, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    // Title
    const titleOp = interpolate(f, [15, 35], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });
    const titleSlide = interpolate(f, [15, 35], [30, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut,
    });



    // Final fade out (last 0.5s = 15 frames)
    const finalFade = interpolate(f, [105, 120], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIO,
    });

    return (
        <AbsoluteFill style={{ backgroundColor: BLACK, opacity: finalFade }}>
            {/* Subtle darken */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at 50% 45%, ${NAVY} 0%, ${BLACK} 70%)`,
            }} />

            <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={SVG_STYLE}>
                <circle cx={CX} cy={CY} r={glowR} fill={CYAN_DIM} opacity={glowOp} />
                <circle cx={CX} cy={CY} r={glowR * 0.4} fill={CYAN_MID} opacity={glowOp * 0.5} />
            </svg>

            <AbsoluteFill style={{
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center", gap: 16,
                paddingTop: 30,
            }}>
                <h1 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 96,
                    fontWeight: 700,
                    color: WHITE,
                    letterSpacing: "0.18em",
                    margin: 0,
                    opacity: titleOp,
                    transform: `translateY(${titleSlide}px)`,
                }}>
                    Brain Puddle
                </h1>

            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ═══════════════════════════════════════════════════════════
   MAIN — 16 seconds / 480 frames / 30 fps
   ═══════════════════════════════════════════════════════════ */
export const TechIntro: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: BLACK }}>
            {/* Scene 1: 0–2.5s (75 frames) */}
            <Sequence from={0} durationInFrames={75}>
                <Scene1 />
            </Sequence>

            {/* Scene 2: 2.5–5s (75 frames) */}
            <Sequence from={75} durationInFrames={75}>
                <Scene2 />
            </Sequence>

            {/* Scene 3: 5–8s (90 frames) */}
            <Sequence from={150} durationInFrames={90}>
                <Scene3 />
            </Sequence>

            {/* Scene 4: 8–12s (120 frames) */}
            <Sequence from={240} durationInFrames={120}>
                <Scene4 />
            </Sequence>

            {/* Scene 5: 12–16s (120 frames) */}
            <Sequence from={360} durationInFrames={120}>
                <Scene5 />
            </Sequence>

            {/* ═══ AUDIO ═══ */}
            <Sequence from={0}>
                <Audio
                    src={staticFile("Audio/Chrono_Shift.mp3")}
                    volume={(fr) =>
                        interpolate(fr,
                            [0, 10, 449, 480],
                            [0, 0.28, 0.28, 0],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                        )
                    }
                />
            </Sequence>
        </AbsoluteFill>
    );
};
