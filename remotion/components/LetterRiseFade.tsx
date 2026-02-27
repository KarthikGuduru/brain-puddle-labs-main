import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import "../styles/typography.css";

interface LetterRiseFadeProps {
    text: string;
    delay?: number;
    fontSize?: number;
    color?: string;
}

export const LetterRiseFade: React.FC<LetterRiseFadeProps> = ({
    text,
    delay = 0,
    fontSize = 140,
    color = "#F5F5F7",
}) => {
    const frame = useCurrentFrame();

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
                    display: "flex",
                    gap: "0px",
                }}
            >
                {text.split("").map((char, index) => {
                    // Each character rises and fades in with a staggered delay
                    const charDelay = delay + index * 2.5; // Slightly slower for more elegance

                    const opacity = interpolate(
                        frame,
                        [charDelay, charDelay + 20],
                        [0, 1],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(0.16, 1, 0.3, 1),
                        }
                    );

                    // Gentle upward movement
                    const translateY = interpolate(
                        frame,
                        [charDelay, charDelay + 25],
                        [30, 0],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(0.16, 1, 0.3, 1),
                        }
                    );

                    return (
                        <span
                            key={index}
                            style={{
                                opacity,
                                transform: `translateY(${translateY}px)`,
                                display: "inline-block",
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    );
                })}
            </h1>
        </div>
    );
};
