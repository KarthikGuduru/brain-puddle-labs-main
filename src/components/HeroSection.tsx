import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const }
        }
    };

    return (
        <section className="hero-section">
            <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="hero-badge">
                    The AI studio for builders
                </motion.div>
                <motion.h1 variants={itemVariants} className="hero-title">
                    Your next breakthrough<br />starts <span>here.</span>
                </motion.h1>
                <motion.p variants={itemVariants} className="hero-subtitle">
                    We turn complex AI into products people actually use. Voice agents that close deals. Content engines that never sleep. Learning platforms that actually teach.
                </motion.p>
                <motion.div variants={itemVariants} className="hero-actions">
                    <button className="btn-primary">See What We Build</button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
