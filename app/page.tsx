import Navbar from '@/ui/components/landing/Navbar';
import HeroSection from '@/ui/components/landing/HeroSection';
import FeaturesSection from '@/ui/components/landing/FeaturesSection';
import HowItWorksSection from '@/ui/components/landing/HowItWorksSection';
import StatsSection from '@/ui/components/landing/StatsSection';
import Footer from '@/ui/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
