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

/* ─────────────────────────────────────────────
   Color‑grading overlay – deep blacks, cyan tint
   ───────────────────────────────────────────── */
const ColorGrade: React.FC = () => (
    <>
        {/* Deep blacks + contrast boost */}
        <AbsoluteFill
            style={{
                background:
                    "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)",
                mixBlendMode: "multiply",
            }}
        />
        {/* Subtle cyan highlight wash */}
        <AbsoluteFill
            style={{
                backgroundColor: "rgba(0, 200, 255, 0.06)",
                mixBlendMode: "screen",
            }}
        />
    </>
);

/* ─────────────────────────────────────────────
   Vignette – radial gradient
   ───────────────────────────────────────────── */
const Vignette: React.FC = () => (
    <AbsoluteFill
        style={{
            background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
            pointerEvents: "none",
        }}
    />
);

/* ─────────────────────────────────────────────
   Shared text style — modern sans‑serif, wide spacing
   ───────────────────────────────────────────── */
const baseTextStyle: React.CSSProperties = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#FFFFFF",
    letterSpacing: "0.15em",
    fontWeight: 600,
    textAlign: "center" as const,
    margin: 0,
    lineHeight: 1.3,
};

/* ─────────────────────────────────────────────
   SCENE 1 — Three drops (0–6 s)
   Video 7.mp4,  slow zoom 1→1.03, vignette
   Text "Three minds." fade‑in at 1.5 s, fade‑out at 5.5 s
   ───────────────────────────────────────────── */
const Scene1: React.FC = () => {
    const frame = useCurrentFrame();
    const DURATION = 180; // 6 s

    // Slow zoom
    const scale = interpolate(frame, [0, DURATION], [1, 1.03], {
        extrapolateRight: "clamp",
    });

    // Text timing: in at 1.5s (45), out at 5.5s (165)
    const textOpacity = interpolate(
        frame,
        [45, 65, 155, 165],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
            <AbsoluteFill
                style={{
                    transform: `scale(${scale})`,
                    filter: "contrast(1.15) saturate(0.7)",
                }}
            >
                <OffthreadVideo
                    src={staticFile("videos/7.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted
                />
            </AbsoluteFill>
            <ColorGrade />
            <Vignette />
            <AbsoluteFill
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: textOpacity,
                }}
            >
                <h1 style={{ ...baseTextStyle, fontSize: 86 }}>Three minds.</h1>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ─────────────────────────────────────────────
   SCENE 2 — Blue light waves (6–12 s)
   Video 8.mp4, crossfade 20 frames
   "One shared question." with soft glow
   ───────────────────────────────────────────── */
const Scene2: React.FC = () => {
    const frame = useCurrentFrame();
    const DURATION = 180;

    // Crossfade in (first 20 frames)
    const fadeIn = interpolate(frame, [0, 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Text: appear at ~0.5 s into scene, hold until 5.5 s (165 frames)
    const textOpacity = interpolate(
        frame,
        [15, 35, 155, 165],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeIn }}>
            <AbsoluteFill style={{ filter: "contrast(1.15) saturate(0.7)" }}>
                <OffthreadVideo
                    src={staticFile("videos/8.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted
                />
            </AbsoluteFill>
            <ColorGrade />
            <AbsoluteFill
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: textOpacity,
                }}
            >
                <h1
                    style={{
                        ...baseTextStyle,
                        fontSize: 78,
                        textShadow:
                            "0 0 40px rgba(0,200,255,0.35), 0 0 80px rgba(0,200,255,0.15)",
                    }}
                >
                    One shared question.
                </h1>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ─────────────────────────────────────────────
   SCENE 3 — Abstract neural network (12–18 s)
   Video 9.mp4, slow push (1→1.05)
   "What if systems could think?" — fade‑in only
   ───────────────────────────────────────────── */
const Scene3: React.FC = () => {
    const frame = useCurrentFrame();
    const DURATION = 180;

    // Crossfade in
    const fadeIn = interpolate(frame, [0, 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Slow push
    const scale = interpolate(frame, [0, DURATION], [1, 1.05], {
        extrapolateRight: "clamp",
    });

    // Text fade‑in only
    const textOpacity = interpolate(frame, [20, 45], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeIn }}>
            <AbsoluteFill
                style={{
                    transform: `scale(${scale})`,
                    filter: "contrast(1.15) saturate(0.7)",
                }}
            >
                <OffthreadVideo
                    src={staticFile("videos/9.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted
                />
            </AbsoluteFill>
            <ColorGrade />
            <AbsoluteFill
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: textOpacity,
                }}
            >
                <h1 style={{ ...baseTextStyle, fontSize: 72 }}>
                    What if systems could think?
                </h1>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

/* ─────────────────────────────────────────────
   SCENE 4 — Closing (18–20 s)
   Fade to black, "Brain Puddle" / "An Intelligence Lab"
   Final 0.5 s: "Systems that think."
   ───────────────────────────────────────────── */
const Scene4: React.FC = () => {
    const frame = useCurrentFrame();
    const TOTAL = 60; // 2 s

    // Fade in from previous scene
    const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // "Brain Puddle" — appears early
    const titleOpacity = interpolate(frame, [8, 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });


    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000",
                opacity: bgOpacity,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
            }}
        >
            {/* Main title */}
            <h1
                style={{
                    ...baseTextStyle,
                    fontSize: 110,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    opacity: titleOpacity,
                }}
            >
                Brain Puddle
            </h1>

        </AbsoluteFill>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPOSITION
   ───────────────────────────────────────────── */
export const LaunchFilm: React.FC = () => {
    const frame = useCurrentFrame();

    // Music volume: fades out in last second (frames 570–600)
    const musicVolume = interpolate(
        frame,
        [0, 569, 570, 600],
        [0.15, 0.15, 0.15, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
            {/* ── Video Scenes ────────────────────── */}

            {/* Scene 1: 0–6 s (frames 0–180) */}
            <Sequence from={0} durationInFrames={180}>
                <Scene1 />
            </Sequence>

            {/* Scene 2: 6–12 s — starts 20 frames early for crossfade */}
            <Sequence from={160} durationInFrames={200}>
                <Scene2 />
            </Sequence>

            {/* Scene 3: 12–18 s — starts 20 frames early for crossfade */}
            <Sequence from={340} durationInFrames={200}>
                <Scene3 />
            </Sequence>

            {/* Scene 4: 18–20 s */}
            <Sequence from={540} durationInFrames={60}>
                <Scene4 />
            </Sequence>

            {/* ── Audio Layers ────────────────────── */}

            {/* Background music: Submerged Reflections — from the beginning */}
            <Sequence from={0}>
                <Audio
                    src={staticFile("Audio/Submerged_Reflections.mp3")}
                    volume={(f) => {
                        // Gentle fade-in, then fade out in the last second
                        return interpolate(
                            f,
                            [0, 20, 569, 600],
                            [0, 0.15, 0.15, 0],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                        );
                    }}
                />
            </Sequence>

            {/* Narration 1: "Three minds." — aligned at 1.5 s */}
            <Sequence from={45}>
                <Audio
                    src={staticFile("Audio/narration/narration_1.mp3")}
                    volume={0.95}
                />
            </Sequence>

            {/* Narration 2: "One shared question." — aligned at ~7 s */}
            <Sequence from={210}>
                <Audio
                    src={staticFile("Audio/narration/narration_2.mp3")}
                    volume={0.95}
                />
            </Sequence>

            {/* Narration 3: "What if systems could think?" — aligned at ~13 s */}
            <Sequence from={390}>
                <Audio
                    src={staticFile("Audio/narration/narration_3.mp3")}
                    volume={0.95}
                />
            </Sequence>

            {/* Narration 4: "Brain Puddle…" — aligned at ~18.5 s */}
            <Sequence from={555}>
                <Audio
                    src={staticFile("Audio/narration/narration_4.mp3")}
                    volume={0.95}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
