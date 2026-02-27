import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame, OffthreadVideo } from "remotion";
import { VideoScene } from "./components/VideoScene";
import { MultiLineReveal } from "./components/MultiLineReveal";
import { EndFrame } from "./components/EndFrame";
import { TypewriterText } from "./components/TypewriterText";
import { CharacterStagger } from "./components/CharacterStagger";
import { LetterRiseFade } from "./components/LetterRiseFade";
import { ZoomGrowText } from "./components/ZoomGrowText";
import "./styles/typography.css";

// Simple clean opening component
const OpeningFade: React.FC = () => {
    const frame = useCurrentFrame();

    const opacity = interpolate(
        frame,
        [0, 20, 30],
        [1, 1, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000000",
                opacity,
            }}
        />
    );
};

// Video scene with custom text effect
interface VideoSceneWithEffectProps {
    videoSrc: string;
    text: string;
    startFrame: number;
    durationInFrames: number;
    textEffect: "typewriter" | "stagger" | "risefade" | "zoomgrow";
    textDelay?: number;
}

const VideoSceneWithEffect: React.FC<VideoSceneWithEffectProps> = ({
    videoSrc,
    text,
    durationInFrames,
    textEffect,
    textDelay = 15,
}) => {
    return (
        <AbsoluteFill>
            {/* Video Background */}
            <OffthreadVideo
                src={staticFile(videoSrc)}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                startFrom={0}
                endAt={durationInFrames}
                muted
                volume={0}
                playbackRate={1}
            />

            {/* Text Overlay with Effect */}
            {textEffect === "typewriter" && (
                <TypewriterText text={text} delay={textDelay} fontSize={140} />
            )}
            {textEffect === "stagger" && (
                <CharacterStagger text={text} delay={textDelay} fontSize={140} />
            )}
            {textEffect === "risefade" && (
                <LetterRiseFade text={text} delay={textDelay} fontSize={140} />
            )}
            {textEffect === "zoomgrow" && (
                <ZoomGrowText text={text} delay={textDelay} fontSize={140} />
            )}
        </AbsoluteFill>
    );
};

export const Trailer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#FBFBFD" }}>
            {/* Opening: 0-1s (frames 0-30) - Clean fade from black */}
            <Sequence from={0} durationInFrames={30}>
                <OpeningFade />
            </Sequence>

            {/* Video 1 - Domains: 1-6s (frames 30-180) - Typewriter Effect */}
            <Sequence from={30} durationInFrames={150}>
                <VideoSceneWithEffect
                    videoSrc="videos/1.mp4"
                    text="Domains"
                    startFrame={0}
                    durationInFrames={150}
                    textEffect="typewriter"
                    textDelay={15}
                />
            </Sequence>

            {/* Video 2 - Systems: 6-11s (frames 180-330) - Character Stagger */}
            <Sequence from={180} durationInFrames={150}>
                <VideoSceneWithEffect
                    videoSrc="videos/3.mp4"
                    text="Systems"
                    startFrame={0}
                    durationInFrames={150}
                    textEffect="stagger"
                    textDelay={15}
                />
            </Sequence>

            {/* Video 3 - Dimensions: 11-16s (frames 330-480) - Letter Rise & Fade */}
            <Sequence from={330} durationInFrames={150}>
                <VideoSceneWithEffect
                    videoSrc="videos/4.mp4"
                    text="Dimensions"
                    startFrame={0}
                    durationInFrames={150}
                    textEffect="zoomgrow"
                    textDelay={15}
                />
            </Sequence>

            {/* Tagline: 16-18.5s (frames 480-555) - 2.5 seconds */}
            <Sequence from={480} durationInFrames={75}>
                <AbsoluteFill style={{ backgroundColor: "#FBFBFD" }}>
                    <MultiLineReveal
                        text="Exploring intelligence across domains, systems, and dimensions."
                        delay={0}
                        fontSize={64}
                    />
                </AbsoluteFill>
            </Sequence>

            {/* End frame: 18.5-20s (frames 555-600) - Logo Reveal */}
            <Sequence from={555} durationInFrames={45}>
                <EndFrame delay={0} />
            </Sequence>

            {/* Audio Layer 1: Primary - Lab Activation Sequence at 90% volume */}
            <Audio
                src={staticFile("Audio/Lab_Activation_Sequence_2026-01-31T135421.mp3")}
                startFrom={0}
                volume={0.9}
            />

            {/* Audio Layer 2: Underlying - Genesis at 42% volume */}
            <Audio
                src={staticFile("Audio/Genesis_Lab_2026-01-31T135025.mp3")}
                startFrom={0}
                volume={0.42}
            />
        </AbsoluteFill>
    );
};
