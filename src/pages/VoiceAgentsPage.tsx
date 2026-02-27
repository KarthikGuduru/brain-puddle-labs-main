import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
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

const VoiceAgentsPage: React.FC<{ onContactOpen?: () => void }> = ({ onContactOpen }) => {
    return (
        <main className="main-content" style={{ paddingTop: '6rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

                {/* Back Link */}
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--accent-color)' }}>
                    ← Back to Studio
                </Link>

                {/* Hero — Apple style: sell the outcome */}
                <motion.div {...fadeUp}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                                Every call answered.<br /><span style={{ color: 'var(--accent-color)' }}>Every lead converted.</span>
                            </h1>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
                                Your best sales rep — available 24 hours a day, fluent in every language your customers speak, and never takes a sick day. That's what our voice agents deliver.
                            </p>
                            <button onClick={onContactOpen} style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '2rem', background: 'var(--accent-color)', color: '#fff', fontWeight: 500, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
                                Hear It In Action
                            </button>
                        </div>
                        <div>
                            <img src="/voice-agents-hero.png" alt="Voice Agents Illustration" style={{ width: '100%', borderRadius: '2rem' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Big statement */}
                <motion.div {...fadeUp}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                            Stop hiring call centers.<br />Start closing deals while you sleep.
                        </h2>
                    </div>
                </motion.div>

                {/* Outcomes, not features */}
                <motion.div {...fadeUp}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
                        {[
                            { title: 'Qualify leads at 3am', desc: 'Your prospects don\'t wait for business hours. Neither should your pipeline. Our agents ask the right questions and book the meeting — while your team sleeps.' },
                            { title: 'Support that actually resolves', desc: 'Not a chatbot maze. Not "press 1 for...". A real conversation that understands the problem, walks through the fix, and confirms it\'s solved.' },
                            { title: 'Get paid faster', desc: 'Friendly, persistent payment follow-ups that maintain the relationship. Customers pay sooner because the reminder feels human, not automated.' },
                            { title: 'Fill every time slot', desc: 'No more phone tag. Your agent checks availability in real time, books the slot, sends the confirmation, and reschedules without friction.' }
                        ].map((item, idx) => (
                            <div key={idx} className="service-card">
                                <h3 className="service-title">{item.title}</h3>
                                <p className="service-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats — outcome-focused */}
                <motion.div {...fadeUp}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '6rem', textAlign: 'center' }}>
                        <div>
                            <AnimatedStat value={50} suffix="+" />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 300 }}>Languages your customers already speak</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.05em' }}>&lt;300ms</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 300 }}>So fast, it feels like talking to a person</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.05em' }}>24/7</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 300 }}>Because your customers don't clock out</p>
                        </div>
                    </div>
                </motion.div>

                {/* What makes this different — not features, but why it matters */}
                <motion.div {...fadeUp}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Not another chatbot.</h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '3rem', fontWeight: 300, maxWidth: '700px' }}>
                        Our voice agents don't read scripts. They listen, they understand context, they handle interruptions, and they know when to escalate to a human. The difference? Your customers won't know it's AI.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
                        {[
                            { title: 'Speaks their language', desc: 'Hindi, Telugu, Tamil, Spanish, Arabic, Mandarin — 50+ languages, native fluency, zero accent issues.' },
                            { title: 'Plugs into your stack', desc: 'CRM, helpdesk, calendar, payment system — your agent talks to your tools in real time, mid-call.' },
                            { title: 'Scales without hiring', desc: 'Run 1,000 simultaneous calls with the same quality as call #1. No training, no turnover, no overhead.' },
                            { title: 'Handles the unexpected', desc: 'Interruptions, tangents, unclear requests — our agents recover gracefully, just like your best human reps.' },
                            { title: 'Your data stays yours', desc: 'Enterprise-grade encryption, India/USA data residency, full regulatory compliance. No compromises.' },
                            { title: 'Always improving', desc: 'Every conversation makes the next one better. The system learns your business, your customers, your edge cases.' }
                        ].map((item, idx) => (
                            <div key={idx} className="service-card" style={{ textAlign: 'center' }}>
                                <h3 className="service-title" style={{ fontSize: '1.125rem' }}>{item.title}</h3>
                                <p className="service-desc" style={{ fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Case Study — outcomes first */}
                <motion.div {...fadeUp}>
                    <div style={{ background: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '2rem', padding: '3rem', marginBottom: '6rem', boxShadow: 'var(--shadow-sm)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: 'var(--accent-color)', marginBottom: '1rem' }}>Case Study</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>BookMyChef</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem', fontWeight: 300, maxWidth: '700px', marginBottom: '1.5rem' }}>
                            A chef-booking platform was drowning in manual coordination calls. We deployed voice agents to handle all inbound calls — matching users to chefs in real-time conversation.
                        </p>
                        <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>
                            The result: every inbound call answered instantly, zero missed bookings, and nobody presses a single button.
                        </p>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div {...fadeUp}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            Ready to never miss a call again?
                        </h2>
                        <button onClick={onContactOpen} style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '2rem', background: 'var(--accent-color)', color: '#fff', fontWeight: 500, fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
                            Talk to Us
                        </button>
                    </div>
                </motion.div>

            </div>
        </main>
    );
};

export default VoiceAgentsPage;
