import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile, Easing } from "remotion";
import "../styles/typography.css";

interface EndFrameProps {
    delay?: number;
}

export const EndFrame: React.FC<EndFrameProps> = ({
    delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Smooth fade in
    const opacity = interpolate(
        frame,
        [delay, delay + 30],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
        }
    );

    // Gentle scale animation
    const scale = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 100,
            stiffness: 50,
        },
    });

    // Subtle upward movement for elegance
    const translateY = interpolate(
        frame,
        [delay, delay + 35],
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
                backgroundColor: "#FBFBFD",
            }}
        >
            {/* Horizontal Logo - Fills Entire Frame */}
            <Img
                src={staticFile("logo_horizontal.png")}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    opacity,
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                }}
            />
        </div>
    );
};
