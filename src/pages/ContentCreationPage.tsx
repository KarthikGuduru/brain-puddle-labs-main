import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

function AnimatedStat({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 1200;
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, value]);

    return (
        <p ref={ref} style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.05em' }}>
            {count}{suffix}
        </p>
    );
}

const ContentCreationPage: React.FC = () => {
    return (
        <main className="main-content" style={{ paddingTop: '6rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

                {/* Back Link */}
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--accent-color)' }}>
                    ← Back to Studio
                </Link>

                {/* Hero — sell the outcome */}
                <motion.div {...fadeUp}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                                Content that sounds<br /><span style={{ color: 'var(--accent-color)' }}>like you wrote it.</span>
                            </h1>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
                                Your brand voice, amplified. We build content engines that produce blog posts, social media, emails, and ad copy at the quality your audience expects — at a speed your team never could.
                            </p>
                            <Link to="/#contact" style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '2rem', background: 'var(--accent-color)', color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
                                See Examples
                            </Link>
                        </div>
                        <div>
                            <img src="/content-creation-hero.png" alt="Content Creation Illustration" style={{ width: '100%', borderRadius: '2rem' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Big statement */}
                <motion.div {...fadeUp}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            Your audience doesn't care about AI.<br />They care about great content.
                        </h2>
                    </div>
                </motion.div>

                {/* How it works — benefit framing */}
                <motion.div {...fadeUp}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '3rem', color: 'var(--text-primary)' }}>Three steps to unlimited content.</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
                        {[
                            { num: '01', title: 'Teach it your voice', desc: "Feed it your best work — past blogs, brand guidelines, tone docs. The engine doesn't generate generic content. It generates your content." },
                            { num: '02', title: 'Connect your channels', desc: 'CMS, social platforms, email tools — everything connects into one pipeline. Write once, publish everywhere, automatically.' },
                            { num: '03', title: 'Never run dry', desc: "Fresh drafts, every day, reviewed against your brand standards before they reach your inbox. Writer's block becomes a memory." }
                        ].map((step, idx) => (
                            <div key={idx} className="service-card">
                                <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '1rem' }}>{step.num}</p>
                                <h3 className="service-title">{step.title}</h3>
                                <p className="service-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* What you get */}
                <motion.div {...fadeUp}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '3rem', color: 'var(--text-primary)' }}>Every format your audience reads.</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
                        {[
                            { title: 'Scroll-stopping social posts', desc: 'Platform-native content for LinkedIn, X, Instagram, and TikTok that earns engagement, not just impressions.' },
                            { title: 'Blogs that rank and read well', desc: 'SEO-optimized long-form articles that establish thought leadership — not keyword-stuffed filler.' },
                            { title: 'Emails people actually open', desc: 'Drip sequences and newsletters with subject lines that convert and copy that keeps readers clicking.' },
                            { title: 'Reports that impress the board', desc: 'Data-driven whitepapers and case studies for enterprise audiences who make six-figure decisions.' },
                            { title: 'Scripts your producer will love', desc: 'Video scripts for explainers, demos, and branded content — ready to shoot, no rewrites needed.' },
                            { title: 'Ads that pay for themselves', desc: 'High-converting ad copy and landing pages with built-in A/B variants so you always know what works.' }
                        ].map((item, idx) => (
                            <div key={idx} className="service-card">
                                <h3 className="service-title">{item.title}</h3>
                                <p className="service-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Animated Stats */}
                <motion.div {...fadeUp}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '6rem', textAlign: 'center' }}>
                        <div>
                            <AnimatedStat value={50} suffix="x" />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 300 }}>More content, same team size</p>
                        </div>
                        <div>
                            <AnimatedStat value={98} suffix="%" />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 300 }}>Sounds like you, every time</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.05em' }}>24/7</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 300 }}>Your content engine never clocks out</p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div {...fadeUp}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            Great brands don't go quiet.<br />Yours won't either.
                        </h2>
                        <Link to="/#contact" style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '2rem', background: 'var(--accent-color)', color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
                            Start Creating
                        </Link>
                    </div>
                </motion.div>

            </div>
        </main>
    );
};

export default ContentCreationPage;
