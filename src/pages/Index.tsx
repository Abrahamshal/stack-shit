import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import PainVsGain from '@/components/PainVsGain';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Pricing from '@/components/Pricing';
import FileUpload from '@/components/FileUpload';
import CalendlyEmbed from '@/components/CalendlyEmbed';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <SocialProof />
      <PainVsGain />
      <Services />
      <Process />
      <Pricing />
      <FileUpload />
      <CalendlyEmbed />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
