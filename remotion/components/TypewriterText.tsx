import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import "../styles/typography.css";

interface TypewriterTextProps {
    text: string;
    delay?: number;
    fontSize?: number;
    color?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    delay = 0,
    fontSize = 140,
    color = "#F5F5F7",
}) => {
    const frame = useCurrentFrame();

    // Calculate how many characters should be visible
    const charsToShow = interpolate(
        frame,
        [delay, delay + text.length * 3], // ~3 frames per character
        [0, text.length],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth easing
        }
    );

    const visibleText = text.substring(0, Math.floor(charsToShow));

    // Cursor blink effect - only show while typing
    const showCursor = frame >= delay && frame < delay + text.length * 3;
    const cursorOpacity = showCursor
        ? interpolate(frame % 20, [0, 10, 20], [1, 0, 1])
        : 0;

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
                    fontFamily: "monospace", // Typewriter aesthetic
                }}
            >
                {visibleText}
                <span style={{ opacity: cursorOpacity }}>|</span>
            </h1>
        </div>
    );
};
