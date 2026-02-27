import React from 'react';
import { motion } from 'framer-motion';

interface TalkToUsButtonProps {
    onOpen: () => void;
}

const TalkToUsButton: React.FC<TalkToUsButtonProps> = ({ onOpen }) => {
    return (
        <motion.button
            onClick={onOpen}
            className="floating-btn glass object-interaction w-32 h-32"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                opacity: { duration: 1, delay: 1 },
                scale: { duration: 0.5 }
            }}
            aria-label="Talk to us"
            style={{ border: '1px solid rgba(0,0,0,0.1)', background: 'var(--bg-card)', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backdropFilter: 'blur(12px)' }}
        >
            <motion.div
                className="floating-btn-content"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" className="floating-btn-svg">
                    <path
                        id="textPath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="transparent"
                    />
                    <text className="floating-btn-text">
                        <textPath href="#textPath" startOffset="0%">
                            • Talk to Us  •  Talk to Us
                        </textPath>
                    </text>
                </svg>

                <div className="floating-btn-arrow-container">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="floating-btn-arrow"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </motion.div>
        </motion.button>
    );
};

export default TalkToUsButton;
