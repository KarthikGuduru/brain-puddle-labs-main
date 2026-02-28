import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import TalkToUsButton from './components/TalkToUsButton';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VoiceAgentsPage from './pages/VoiceAgentsPage';
import ConsultationPage from './pages/ConsultationPage';
import ContentCreationPage from './pages/ContentCreationPage';
import AiScorePage from './pages/AiScorePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="app-container">
      <ScrollToTop />
      <Navigation
        dark={dark}
        onToggleTheme={() => setDark(!dark)}
        onContactOpen={() => setContactOpen(true)}
      />
      <TalkToUsButton onOpen={() => setContactOpen(true)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      <div className="page-wrapper" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/voice-agents" element={<VoiceAgentsPage onContactOpen={() => setContactOpen(true)} />} />
          <Route path="/consultation" element={<ConsultationPage onContactOpen={() => setContactOpen(true)} />} />
          <Route path="/content-creation" element={<ContentCreationPage onContactOpen={() => setContactOpen(true)} />} />
          <Route path="/ai-score" element={<AiScorePage onContactOpen={() => setContactOpen(true)} />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
