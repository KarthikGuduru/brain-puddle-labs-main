import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <img src="/logo.png" alt="Brain Puddle" style={{ height: '28px', marginBottom: '0.5rem' }} />
                    <p>
                        An applied AI studio building the next generation of intelligent systems. From our own products to custom enterprise solutions.
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Products</h4>
                    <ul>
                        <li><a href="https://learnpuddle.com" target="_blank" rel="noopener noreferrer">LearnPuddle</a></li>
                        <li><Link to="/voice-agents">Voice Agents</Link></li>
                        <li><Link to="/content-creation">Content Engine</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li><Link to="/consultation">AI Consultation</Link></li>
                        <li><Link to="/voice-agents">Custom Agents</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="mailto:thebrainpuddle@gmail.com">thebrainpuddle@gmail.com</a></li>
                        <li><a href="https://x.com/brain_puddle" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        <li><a href="https://www.instagram.com/thebrainpuddle/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Brain Puddle. All rights reserved.</span>
                <div className="footer-social">
                    <a href="https://x.com/brain_puddle" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                    </a>
                    <a href="https://www.instagram.com/thebrainpuddle/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
