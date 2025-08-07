import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import PainVsGain from '@/components/PainVsGain';
import Process from '@/components/Process';
import Pricing from '@/components/Pricing';
import FileUpload from '@/components/FileUpload';
import CalendlyEmbed from '@/components/CalendlyEmbed';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';
import QuoteCalculator from '@/components/QuoteCalculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <SocialProof />
      <PainVsGain />
      <Process />
      <Pricing />
      <Testimonials />
      <QuoteCalculator />
      <FileUpload />
      <CalendlyEmbed />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
