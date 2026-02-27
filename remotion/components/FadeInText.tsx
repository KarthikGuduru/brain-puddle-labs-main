import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import "../styles/typography.css";

interface FadeInTextProps {
    text: string;
    delay?: number;
    duration?: number;
    fontSize?: number;
    fontWeight?: number;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
    text,
    delay = 0,
    duration = 60,
    fontSize = 120,
    fontWeight = 200,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Calculate opacity with delay
    const opacity = interpolate(
        frame,
        [delay, delay + duration * 0.3, delay + duration],
        [0, 0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Subtle scale animation
    const scale = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 100,
            stiffness: 50,
        },
    });

    const actualScale = interpolate(scale, [0, 1], [0.95, 1]);

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
                transform: `scale(${actualScale})`,
            }}
        >
            <h1
                className="apple-text-light"
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    color: "#1d1d1f",
                    margin: 0,
                    textAlign: "center",
                }}
            >
                {text}
            </h1>
        </div>
    );
};
