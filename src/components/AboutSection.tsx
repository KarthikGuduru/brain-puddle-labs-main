import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutSection: React.FC = () => {
    const services = [
        {
            title: "LearnPuddle (LMS)",
            desc: "Learning that actually sticks. An AI-powered platform where every learner gets a path built just for them.",
            icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="8" width="28" height="22" rx="2" />
                    <line x1="6" y1="14" x2="34" y2="14" />
                    <line x1="14" y1="14" x2="14" y2="30" />
                    <circle cx="24" cy="22" r="3" />
                </svg>
            ),
            link: "https://learnpuddle.com",
            isExternal: true
        },
        {
            title: "Voice Agents",
            desc: "Every call answered. Every lead converted. Your best sales rep — available 24/7, fluent in every language.",
            icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="15" y="4" width="10" height="18" rx="5" />
                    <path d="M10 18a10 10 0 0 0 20 0" />
                    <line x1="20" y1="28" x2="20" y2="34" />
                    <line x1="14" y1="34" x2="26" y2="34" />
                </svg>
            ),
            link: "/voice-agents",
            isExternal: false
        },
        {
            title: "AI Content Creation",
            desc: "Content that sounds like you wrote it. Blog posts, social media, emails — at the speed your audience demands.",
            icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 32 L16 8 L24 32" />
                    <line x1="11" y1="24" x2="21" y2="24" />
                    <line x1="28" y1="8" x2="28" y2="32" />
                    <circle cx="28" cy="8" r="2" fill="var(--accent-color)" stroke="none" />
                </svg>
            ),
            link: "/content-creation",
            isExternal: false
        },
        {
            title: "AI Consultation",
            desc: "Know exactly where AI will move the needle. We find the 2-3 use cases that transform your business — then we build them.",
            icon: (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="20" cy="20" r="14" />
                    <circle cx="20" cy="20" r="2" fill="var(--accent-color)" stroke="none" />
                    <line x1="20" y1="6" x2="20" y2="10" />
                    <line x1="20" y1="30" x2="20" y2="34" />
                    <line x1="6" y1="20" x2="10" y2="20" />
                    <line x1="30" y1="20" x2="34" y2="20" />
                    <line x1="20" y1="20" x2="28" y2="12" />
                </svg>
            ),
            link: "/consultation",
            isExternal: false
        }
    ];

    return (
        <section id="what-we-do" className="services-section">
            <div className="section-container">
                <div className="section-header">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >
                        Diagnosis Before Prescription
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="section-subtitle"
                    >
                        Every engagement starts with understanding. We diagnose first, then prescribe.
                    </motion.p>
                </div>

                <div className="services-grid">
                    {services.map((service, idx) => {
                        const card = (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 + 0.2 }}
                                className="service-card"
                            >
                                <div className="service-icon">{service.icon}</div>
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-desc">{service.desc}</p>
                                <span className="service-link-label">Learn more →</span>
                            </motion.div>
                        );

                        return service.isExternal ? (
                            <a href={service.link} target="_blank" rel="noopener noreferrer" key={idx} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                {card}
                            </a>
                        ) : (
                            <Link to={service.link} key={idx} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                {card}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
