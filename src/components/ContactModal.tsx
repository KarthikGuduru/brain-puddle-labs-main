import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setError('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch('https://formsubmit.co/ajax/thebrainpuddle@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    company: formData.get('company'),
                    service: formData.get('service'),
                    message: formData.get('message'),
                    _subject: `New inquiry from ${formData.get('name')} — Brain Puddle`,
                })
            });

            if (response.ok) {
                setSent(true);
                form.reset();
            } else {
                setError('Something went wrong. Please try again or email us directly.');
            }
        } catch {
            setError('Network error. Please try again or email us directly.');
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        setSent(false);
        setError('');
        onClose();
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.875rem 1rem',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        background: 'var(--bg-dark)',
        border: 'var(--glass-border)',
        color: 'var(--text-primary)',
        outline: 'none',
        transition: 'border-color 0.2s',
        borderRadius: '0.5rem',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        marginBottom: '0.5rem',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9998,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        padding: '2rem',
                    }}
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-card)',
                            border: 'var(--glass-border)',
                            borderRadius: '1.5rem',
                            padding: '3rem',
                            width: '100%',
                            maxWidth: '520px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            boxShadow: 'var(--shadow-md)',
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            aria-label="Close"
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                color: 'var(--text-tertiary)',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        {sent ? (
                            /* Success state */
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                    Message sent.
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 300 }}>
                                    We will get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={handleClose}
                                    style={{
                                        marginTop: '2rem',
                                        padding: '0.875rem 2rem',
                                        background: 'var(--accent-color)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '2rem',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            /* Form */
                            <>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                                    Let's build something.
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', fontWeight: 300 }}>
                                    Tell us about your project and we'll get back to you within 24 hours.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Name</label>
                                            <input name="name" required placeholder="Your name" style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email</label>
                                            <input name="email" type="email" required placeholder="you@company.com" style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Company</label>
                                            <input name="company" placeholder="Your company" style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Interested In</label>
                                            <select name="service" style={{ ...inputStyle, appearance: 'none' as const }}>
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Voice Agents">Voice Agents</option>
                                                <option value="AI Consultation">AI Consultation</option>
                                                <option value="Content Creation">Content Creation</option>
                                                <option value="LearnPuddle">LearnPuddle</option>
                                                <option value="Partnership">Partnership</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={labelStyle}>Tell us more</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={4}
                                            placeholder="What are you looking to build? What problem are you solving?"
                                            style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '100px' }}
                                        />
                                    </div>

                                    {error && (
                                        <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            background: sending ? 'var(--text-tertiary)' : 'var(--accent-color)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '2rem',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            cursor: sending ? 'not-allowed' : 'pointer',
                                            fontFamily: 'inherit',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </button>

                                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        Or email us directly at <a href="mailto:thebrainpuddle@gmail.com" style={{ color: 'var(--accent-color)' }}>thebrainpuddle@gmail.com</a>
                                    </p>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
