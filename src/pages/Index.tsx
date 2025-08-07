import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import PainVsGain from '@/components/PainVsGain';
import Process from '@/components/Process';

// Lazy load below-fold components
const Pricing = lazy(() => import('@/components/Pricing'));
const FileUpload = lazy(() => import('@/components/FileUpload'));
const CalendlyEmbed = lazy(() => import('@/components/CalendlyEmbed'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const FAQ = lazy(() => import('@/components/FAQ'));
const CTABanner = lazy(() => import('@/components/CTABanner'));
const Footer = lazy(() => import('@/components/Footer'));
const QuoteCalculator = lazy(() => import('@/components/QuoteCalculator'));

import LoadingSpinner from '@/components/shared/LoadingSpinner';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:p-4 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
      <SocialProof />
      <PainVsGain />
      <Process />
      <Suspense fallback={<LoadingSpinner />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <QuoteCalculator />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <FileUpload />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <CalendlyEmbed />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <CTABanner />
      </Suspense>
      </main>
      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
