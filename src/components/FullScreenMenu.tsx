import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FullScreenMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { label: 'Home', href: '#' },
    { label: 'What we do', href: '#what-we-do' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Talk to us', href: '#contact' },
];

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    const radius = Math.sqrt(windowSize.width ** 2 + windowSize.height ** 2) * 1.5;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ clipPath: `circle(0px at calc(100% - 40px) 40px)` }}
                    animate={{ clipPath: `circle(${radius}px at calc(100% - 40px) 40px)` }}
                    exit={{ clipPath: `circle(0px at calc(100% - 40px) 40px)` }}
                    transition={{ duration: 0.8, ease: "easeInOut" as const }}
                    className="fullscreen-menu"
                >
                    {/* Close Button */}
                    <button onClick={onClose} className="menu-close-btn">
                        <span className="sr-only">Close</span>
                        <div className="menu-close-icon">
                            <span></span>
                            <span></span>
                        </div>
                    </button>

                    {/* Menu Items */}
                    <nav className="menu-nav">
                        <ul className="menu-list">
                            {menuItems.map((item, index) => (
                                <motion.li
                                    key={item.label}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                >
                                    <a
                                        href={item.href}
                                        onClick={onClose}
                                        className="menu-link"
                                    >
                                        {item.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FullScreenMenu;
