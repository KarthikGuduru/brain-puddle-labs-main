import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface NavigationProps {
    dark: boolean;
    onToggleTheme: () => void;
    onContactOpen: () => void;
}

const SunIcon = () => (
    <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const Navigation: React.FC<NavigationProps> = ({ dark, onToggleTheme, onContactOpen: _onContactOpen }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="nav-container glass"
            >
                <div className="nav-logo">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="Brain Puddle" style={{ height: '48px', width: 'auto', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.15))', borderRadius: '6px' }} />
                    </Link>
                </div>

                {/* Desktop links */}
                <div className="nav-desktop-links">
                    <Link to="/voice-agents" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Voice Agents</Link>
                    <Link to="/consultation" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Consultation</Link>
                    <Link to="/content-creation" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Content</Link>
                    <Link to="/ai-score" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>AI Score</Link>
                    <a href="https://learnpuddle.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.2s' }}>LearnPuddle</a>

                    <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
                        <div className="theme-toggle-knob">
                            {dark ? <MoonIcon /> : <SunIcon />}
                        </div>
                    </button>
                </div>

                {/* Mobile controls */}
                <div className="nav-mobile-controls">
                    <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
                        <div className="theme-toggle-knob">
                            {dark ? <MoonIcon /> : <SunIcon />}
                        </div>
                    </button>
                    <button
                        className="nav-hamburger"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link to="/voice-agents" onClick={() => setMobileMenuOpen(false)}>Voice Agents</Link>
                        <Link to="/consultation" onClick={() => setMobileMenuOpen(false)}>Consultation</Link>
                        <Link to="/content-creation" onClick={() => setMobileMenuOpen(false)}>Content</Link>
                        <Link to="/ai-score" onClick={() => setMobileMenuOpen(false)}>AI Score</Link>
                        <a href="https://learnpuddle.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>LearnPuddle</a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
