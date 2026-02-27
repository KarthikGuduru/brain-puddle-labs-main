import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
};

const ConsultationPage: React.FC = () => {
    return (
        <main className="main-content" style={{ paddingTop: '6rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

                {/* Back Link */}
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--accent-color)' }}>
                    ← Back to Studio
                </Link>

                {/* Hero — outcome first */}
                <motion.div {...fadeUp}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                                Know exactly where<br /><span style={{ color: 'var(--accent-color)' }}>AI will move the needle.</span>
                            </h1>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
                                Stop guessing which AI initiative to bet on. We find the 2-3 use cases that will actually transform your business — then we build them, ship them, and train your team.
                            </p>
                            <Link to="/#contact" style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '2rem', background: 'var(--accent-color)', color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
                                Book a Strategy Call
                            </Link>
                        </div>
                        <div>
                            <img src="/consultation-hero.png" alt="AI Consultation Illustration" style={{ width: '100%', borderRadius: '2rem' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Big statement */}
                <motion.div {...fadeUp}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            Most AI projects fail because companies<br />solve the wrong problem first.
                        </h2>
                    </div>
                </motion.div>

                {/* Methodology — benefit framing */}
                <motion.div {...fadeUp}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>From confusion to production in weeks.</h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '3rem', fontWeight: 300, maxWidth: '700px' }}>
                        Not months. Not quarters. We built a framework that gets you from "where does AI fit?" to "it's making us money" faster than your competitors can finish their strategy deck.
                    </p>
                </motion.div>

                <div style={{ marginBottom: '6rem' }}>
                    {[
                        { num: '01', title: 'Find the gold', desc: 'We look at your workflows, your data, your costs — and find the 2-3 places where AI will deliver the most dramatic impact. Not everything needs AI. We find where it matters.' },
                        { num: '02', title: 'Build it for real', desc: "No slide decks. No POCs that sit on a shelf. We write production code, deploy real models, and integrate with your existing systems. When we leave, it's live." },
                        { num: '03', title: 'Make it yours', desc: "Your team runs it from day one. We do live workshops, pair programming, and write documentation that people actually read. Plus 90 days of support so you're never stuck." }
                    ].map((step, idx) => (
                        <motion.div key={idx} {...fadeUp} transition={{ delay: idx * 0.1 }}>
                            <div style={{ borderLeft: '4px solid var(--accent-color)', paddingLeft: '2rem', marginBottom: '3rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{step.num}</p>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{step.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem', fontWeight: 300 }}>{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* What you get — not what we do */}
                <motion.div {...fadeUp}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '3rem', color: 'var(--text-primary)' }}>What changes for your business</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
                        {[
                            { title: 'Clarity in days', desc: 'Stop debating AI strategy in meetings. Within a week, you know exactly what to build and why it matters.' },
                            { title: 'Revenue from AI', desc: "Not a cost center. Not an experiment. A system that's measurably making or saving you money from week one." },
                            { title: 'A team that owns it', desc: "We leave, and your team runs the system confidently. No vendor lock-in. No dependency. It's yours." },
                            { title: 'Speed your board notices', desc: 'Our fastest engagement: 14 days from kickoff to live production system. Your competitors are still in committee.' },
                            { title: 'Zero security compromises', desc: 'Enterprise-grade from day one. Data residency, compliance, audit trails. We build for regulated industries.' },
                            { title: 'A partner, not a vendor', desc: "We've been founders. We know what it's like to bet the company on a new technology. We treat your money like ours." }
                        ].map((item, idx) => (
                            <div key={idx} className="service-card" style={{ textAlign: 'center' }}>
                                <h3 className="service-title" style={{ fontSize: '1.125rem' }}>{item.title}</h3>
                                <p className="service-desc" style={{ fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div {...fadeUp}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            The best time to start was yesterday.<br />The second best time is this call.
                        </h2>
                        <Link to="/#contact" style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '2rem', background: 'var(--accent-color)', color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
                            Book a Strategy Call
                        </Link>
                    </div>
                </motion.div>

            </div>
        </main>
    );
};

export default ConsultationPage;
