import React from 'react';
import { motion } from 'framer-motion';

const results = [
    {
        name: "Book My Chef",
        stat: "10x",
        statDesc: "Faster Bookings",
        desc: "Implemented advanced Voice Agents for seamless user-chef matching. Transformed fragmented booking processes into automated, real-time voice coordination.",
        comingSoon: false
    },
    {
        name: "Upcoming Project Alpha",
        stat: "Q3",
        statDesc: "Launch target",
        desc: "Exciting new AI integration currently in stealth development. Revolutionizing the way businesses interact with data.",
        comingSoon: true
    },
    {
        name: "Upcoming Project Beta",
        stat: "Q4",
        statDesc: "Launch target",
        desc: "Building next-generation predictive modeling systems. Stay tuned for industry-leading insights.",
        comingSoon: true
    }
];

const partners = [
    {
        name: 'ElevenLabs',
        logo: (
            <svg viewBox="0 0 130 24" className="h-6 fill-current opacity-40 hover:opacity-100 transition-opacity duration-500">
                <path d="M4.6035 0v24h4.9317V0zm9.8613 0v24h4.9317V0z" />
                <text x="25" y="19" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="18" letterSpacing="-0.5">ElevenLabs</text>
            </svg>
        )
    },
    {
        name: 'OpenAI',
        logo: (
            <svg viewBox="0 0 100 24" className="h-6 fill-current opacity-40 hover:opacity-100 transition-opacity duration-500">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.108a4.475 4.475 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-2.1466zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4068-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                <text x="32" y="19" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="18" letterSpacing="-0.5">OpenAI</text>
            </svg>
        )
    },
    {
        name: 'Anthropic',
        logo: (
            <svg viewBox="0 0 120 24" className="h-6 fill-current opacity-40 hover:opacity-100 transition-opacity duration-500">
                <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
                <text x="30" y="19" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="18" letterSpacing="0">Anthropic</text>
            </svg>
        )
    },
    {
        name: 'Book My Chef',
        logo: (
            <svg viewBox="0 0 160 24" className="h-6 fill-current opacity-40 hover:opacity-100 transition-opacity duration-500">
                <path d="M10 2 C6 2 4 6 4 10 L4 18 C4 18 16 18 16 18 L16 10 C16 6 14 2 10 2 Z M2 22 L18 22 C19.1 22 20 22.9 20 24 L20 26 L0 26 L0 24 C0 22.9 0.9 22 2 22 Z" />
                <text x="28" y="19" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="18" letterSpacing="-0.3">Book My Chef</text>
            </svg>
        )
    }
];

const ClientsSection: React.FC = () => {
    return (
        <section id="case-studies" className="results-section overflow-hidden">

            {/* Partners Marquee */}
            <div className="marquee-container">
                <div className="section-container">
                    <h3 className="marquee-title">
                        Powered By & Trusted By
                    </h3>
                </div>
                <div className="marquee-track-wrapper">
                    <div className="marquee-fade-left"></div>
                    <div className="marquee-fade-right"></div>
                    <div className="marquee-track animate-slide">
                        {[...partners, ...partners, ...partners].map((partner, index) => (
                            <div key={`${partner.name}-${index}`} className="marquee-logo">
                                {partner.logo}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="section-container">
                <div className="section-header">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >
                        Results From the Field
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="section-subtitle"
                    >
                        Live Systems. Real Numbers. Not prototypes. Production systems already generating revenue.
                    </motion.p>
                </div>

                <div className="results-grid">
                    {results.map((result, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 + 0.2 }}
                            className="result-card"
                        >
                            <h3 className="result-name">{result.name}{result.comingSoon && <span className="badge-coming-soon">Coming Soon</span>}</h3>
                            <div className="result-stat-container">
                                <span className="result-stat text-gradient">{result.stat}</span>
                                <span className="result-stat-desc">{result.statDesc}</span>
                            </div>
                            <p className="result-desc">{result.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientsSection;
