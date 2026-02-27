import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import "../styles/typography.css";

interface CharacterStaggerProps {
    text: string;
    delay?: number;
    fontSize?: number;
    color?: string;
}

export const CharacterStagger: React.FC<CharacterStaggerProps> = ({
    text,
    delay = 0,
    fontSize = 140,
    color = "#F5F5F7",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

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
                    // Each character animates with a slight delay
                    const charDelay = delay + index * 2; // 2 frames between each character

                    const opacity = interpolate(
                        frame,
                        [charDelay, charDelay + 15],
                        [0, 1],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(0.16, 1, 0.3, 1),
                        }
                    );

                    const scale = spring({
                        frame: frame - charDelay,
                        fps,
                        config: {
                            damping: 100,
                            stiffness: 200,
                        },
                    });

                    return (
                        <span
                            key={index}
                            style={{
                                opacity,
                                transform: `scale(${scale})`,
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
