import React from "react";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate, staticFile } from "remotion";
import "../styles/typography.css";

interface VideoSceneProps {
    videoSrc: string;
    text: string;
    startFrame: number;
    durationInFrames: number;
    textDelay?: number;
}

export const VideoScene: React.FC<VideoSceneProps> = ({
    videoSrc,
    text,
    startFrame,
    durationInFrames,
    textDelay = 15,
}) => {
    const frame = useCurrentFrame();
    const relativeFrame = frame - startFrame;

    // Text fade-in animation
    const textOpacity = interpolate(
        relativeFrame,
        [textDelay, textDelay + 20],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Text slide-up animation
    const textY = interpolate(
        relativeFrame,
        [textDelay, textDelay + 30],
        [40, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

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
            />

            {/* Overlay Text */}
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: textOpacity,
                    transform: `translateY(${textY}px)`,
                }}
            >
                <h1
                    className="apple-text-display"
                    style={{
                        fontSize: "140px",
                        fontWeight: 700,
                        color: "#F5F5F7",
                        margin: 0,
                        textAlign: "center",
                        textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    {text}
                </h1>
            </div>
        </AbsoluteFill>
    );
};
