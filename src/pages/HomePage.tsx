import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ClientsSection from '../components/ClientsSection';

const HomePage = () => {
    return (
        <main className="main-content">
            <HeroSection />
            <AboutSection />
            <ClientsSection />

            <section style={{ padding: '3rem 2rem 6rem' }}>
                <div className="glass" style={{ maxWidth: '1100px', margin: '0 auto', borderRadius: '1.5rem', padding: '2rem', border: 'var(--glass-border)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                        AI Search Overview
                    </p>
                    <h2 style={{ margin: '0.6rem 0 1rem 0', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
                        What, How, and Who BrainPuddle Helps
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.9rem', marginBottom: '1.3rem' }}>
                        <div style={{ border: 'var(--glass-border)', borderRadius: '1rem', background: 'var(--bg-dark)', padding: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>What</h3>
                            <p style={{ margin: '0.6rem 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                BrainPuddle builds applied AI systems for real business outcomes: AI voice agents, AI consultation, AI content engines, and the AI Resilience Score.
                            </p>
                        </div>
                        <div style={{ border: 'var(--glass-border)', borderRadius: '1rem', background: 'var(--bg-dark)', padding: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>How</h3>
                            <p style={{ margin: '0.6rem 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                We identify high-impact workflows, ship production integrations, and help teams operationalize AI with measurable KPIs and deployment support.
                            </p>
                        </div>
                        <div style={{ border: 'var(--glass-border)', borderRadius: '1rem', background: 'var(--bg-dark)', padding: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Who Should Use This</h3>
                            <p style={{ margin: '0.6rem 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Founders, growth teams, enterprise operators, and professionals who want practical AI execution and clearer automation-risk visibility.
                            </p>
                        </div>
                    </div>

                    <h3 style={{ margin: '0.4rem 0 0.8rem 0', fontSize: '1.15rem' }}>Quick FAQ</h3>
                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        <details style={{ border: 'var(--glass-border)', borderRadius: '0.9rem', padding: '0.9rem 1rem', background: 'var(--bg-dark)' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 700 }}>How does BrainPuddle define AI Resilience Score?</summary>
                            <p style={{ margin: '0.55rem 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                It is a practical score that reflects how strongly a profile can resist automation pressure based on depth, autonomy, adaptability, and leverage.
                            </p>
                        </details>
                        <details style={{ border: 'var(--glass-border)', borderRadius: '0.9rem', padding: '0.9rem 1rem', background: 'var(--bg-dark)' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 700 }}>What is the Replaceability Index?</summary>
                            <p style={{ margin: '0.55rem 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                The Replaceability Index is the inverse risk indicator used in the AI score flow. Higher values imply higher automation exposure.
                            </p>
                        </details>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
