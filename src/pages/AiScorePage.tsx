import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScoreReport from '../components/ai-score/ScoreReport';
import PokemonCard from '../components/ai-score/PokemonCard';

const AiScorePage: React.FC<{ onContactOpen?: () => void }> = ({ onContactOpen }) => {
    const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
    const [inputUrl, setInputUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisText, setAnalysisText] = useState('Booting up quantum analysis core...');
    const [analysisData, setAnalysisData] = useState<any>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('analyzing');
        setAnalysisText('Booting up quantum analysis core...');

        try {
            // 1. Fetch analysis
            setTimeout(() => setAnalysisText('Cross-referencing AI capabilities...'), 1000);
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: inputUrl })
            });

            if (!response.ok) throw new Error('Analysis failed');
            const data = await response.json();

            setAnalysisText('Calculating replaceability index...');
            setAnalysisData(data);

            // Generate the image in the background, we will update it later
            generateCardImage(data, imagePreview);

            setTimeout(() => {
                setStep('results');
            }, 1500);

        } catch (error) {
            console.error(error);
            setAnalysisText('Error analyzing profile. Please try again.');
            setTimeout(() => setStep('input'), 3000);
        }
    };

    const generateCardImage = async (data: any, imageBase64: string | null) => {
        try {
            const response = await fetch('/api/generate-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.pokemon.name,
                    title: data.pokemon.title,
                    type: data.pokemon.type,
                    analysis: data,
                    imagePromptBase64: imageBase64
                })
            });
            if (response.ok) {
                const imgData = await response.json();
                setAnalysisData((prev: any) => ({
                    ...prev,
                    pokemon: {
                        ...prev.pokemon,
                        photoUrl: imgData.imageUrl
                    }
                }));
            }
        } catch (error) {
            console.error("Failed to generate image", error);
        }
    };

    return (
        <main className="main-content ai-score-page" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-color)' }}>
                    ← Back to Studio
                </Link>

                <AnimatePresence mode="wait">
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="input-section"
                        >
                            <div className="hero-text-center">
                                <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
                                    Are you <span style={{ color: 'var(--accent-color)' }}>Replaceable?</span>
                                </h1>
                                <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>
                                    Upload your resume or paste your LinkedIn to get a gamified breakdown of your AI survival odds.
                                </p>
                            </div>

                            <div className="form-container glass">
                                <form onSubmit={handleScan}>
                                    <div className="input-group">
                                        <label htmlFor="linkedin">LinkedIn URL</label>
                                        <input
                                            type="url"
                                            id="linkedin"
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            value={inputUrl}
                                            onChange={(e) => setInputUrl(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginTop: '1rem' }}>
                                        <label htmlFor="user-photo">Optional: Profile Photo (for Gamified Card)</label>
                                        <input
                                            type="file"
                                            id="user-photo"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={handleImageUpload}
                                            style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%' }}
                                        />
                                        {imagePreview && (
                                            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={imagePreview} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ready for Ghibli transformation</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="divider" style={{ margin: '1.5rem 0' }}><span>OR</span></div>
                                    <div className="upload-zone">
                                        <div className="upload-icon">📄</div>
                                        <p>Drag & Drop Resume (PDF)</p>
                                        <button type="button" className="mock-upload-btn">Browse Files</button>
                                    </div>

                                    <button type="submit" className="btn-primary scan-btn">
                                        Scan My Profile
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="analyzing-section"
                        >
                            <div className="spinner-container">
                                <div className="radar-spinner"></div>
                            </div>
                            <h2 className="analysis-text">{analysisText}</h2>
                            <div className="progress-bar-container">
                                <motion.div
                                    className="progress-bar-fill"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 6, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, staggerChildren: 0.2 }}
                            className="results-section-wrapper"
                        >
                            <div className="results-header">
                                <h2>Analysis Complete</h2>
                                <p>Flip your card to see your underlying stats.</p>
                            </div>

                            <div className="results-grid-layout">
                                <div className="report-col">
                                    {analysisData && (
                                        <ScoreReport
                                            score={analysisData.score}
                                            tier={analysisData.tier}
                                            tierColor={analysisData.tierColor}
                                            categories={analysisData.categories}
                                            xp={analysisData.xp}
                                        />
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.5 }}
                                        className="action-card glass"
                                    >
                                        <h3>How to level up</h3>
                                        <ul className="powerup-list">
                                            {analysisData.levelUpSuggestions?.map((sugg: string, i: number) => (
                                                <li key={i}>{sugg}</li>
                                            )) || (
                                                    <>
                                                        <li>Focus on highly empathetic client interactions (AI struggles here).</li>
                                                        <li>Automate your own repetitive reporting tasks before your boss does.</li>
                                                        <li>Lean into cross-disciplinary strategy rather than deep-but-narrow execution.</li>
                                                    </>
                                                )}
                                        </ul>
                                        <button onClick={onContactOpen} className="btn-secondary">Consult an Expert</button>
                                    </motion.div>
                                </div>

                                <div className="card-col">
                                    {analysisData && <PokemonCard {...analysisData.pokemon} replaceabilityScore={analysisData.score} replaceabilityTier={analysisData.tier} />}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default AiScorePage;
