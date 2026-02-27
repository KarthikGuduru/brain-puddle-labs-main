import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import "../styles/typography.css";

interface ZoomGrowTextProps {
    text: string;
    delay?: number;
    fontSize?: number;
    color?: string;
}

export const ZoomGrowText: React.FC<ZoomGrowTextProps> = ({
    text,
    delay = 0,
    fontSize = 140,
    color = "#F5F5F7",
}) => {
    const frame = useCurrentFrame();

    // Very gradual zoom from tiny to full size over the entire 5-second scene
    const scale = interpolate(
        frame,
        [delay, delay + 135], // Almost the full 5 seconds (150 frames total, minus delay)
        [0.1, 1], // Start at 10% size, grow to 100%
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1), // Smooth Apple-like easing
        }
    );

    // Fade in quickly at the start
    const opacity = interpolate(
        frame,
        [delay, delay + 20],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }
    );

    return (
        <div
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <h1
                className="apple-text-display"
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight: 700,
                    color,
                    margin: 0,
                    textAlign: "center",
                    textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                    opacity,
                    transform: `scale(${scale})`,
                }}
            >
                {text}
            </h1>
        </div>
    );
};
