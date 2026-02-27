import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const BubbleCursor: React.FC = () => {
    const [isHovering, setIsHovering] = useState(false);
    const cursorSize = isHovering ? 60 : 30;

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - cursorSize / 2);
            mouseY.set(e.clientY - cursorSize / 2);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('object-interaction');

            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorSize, mouseX, mouseY]);

    return (
        <motion.div
            className="cursor-wrapper"
            style={{
                x: cursorX,
                y: cursorY,
            }}
        >
            <motion.div
                animate={{
                    width: cursorSize,
                    height: cursorSize,
                    backgroundColor: isHovering ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(4px)",
                    border: isHovering ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)"
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
                className="cursor-dot"
            />
        </motion.div>
    );
};

export default BubbleCursor;
