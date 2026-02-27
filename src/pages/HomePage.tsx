import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ClientsSection from '../components/ClientsSection';

const HomePage = () => {
    return (
        <main className="main-content">
            <HeroSection />
            <AboutSection />
            <ClientsSection />
        </main>
    );
};

export default HomePage;
