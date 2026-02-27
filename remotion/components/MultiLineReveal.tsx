import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import "../styles/typography.css";

interface MultiLineRevealProps {
    text: string;
    delay?: number;
    fontSize?: number;
}

export const MultiLineReveal: React.FC<MultiLineRevealProps> = ({
    text,
    delay = 0,
    fontSize = 64,
}) => {
    const frame = useCurrentFrame();

    // Smooth fade in with easing for professional feel
    const opacity = interpolate(
        frame,
        [delay, delay + 50],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1), // Apple-like easing curve
        }
    );

    // Gentle upward movement
    const translateY = interpolate(
        frame,
        [delay, delay + 50],
        [20, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
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
                opacity,
                transform: `translateY(${translateY}px)`,
            }}
        >
            <h2
                className="apple-text-body"
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight: 400,
                    color: "#1d1d1f",
                    margin: 0,
                    textAlign: "center",
                    lineHeight: 1.3,
                    maxWidth: "1200px",
                    padding: "0 60px",
                }}
            >
                {text}
            </h2>
        </div>
    );
};
