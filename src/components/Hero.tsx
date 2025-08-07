import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, DollarSign, TrendingUp, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-nodes.jpg';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Background with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent/90 z-10" />
      
      {/* Premium Floating Elements - Hidden on mobile for cleaner look */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 hidden lg:block">
        <div className="floating-animation absolute top-20 left-10 w-6 h-6 bg-gold/30 rounded-full pulse-glow" style={{ animationDelay: '0s' }} />
        <div className="floating-animation absolute top-40 right-20 w-8 h-8 bg-accent/40 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="floating-animation absolute bottom-40 left-20 w-5 h-5 bg-gold/25 rounded-full" style={{ animationDelay: '4s' }} />
        <div className="floating-animation absolute bottom-20 right-10 w-4 h-4 bg-accent/35 rounded-full" style={{ animationDelay: '1s' }} />
        <div className="floating-animation absolute top-1/2 left-1/4 w-3 h-3 bg-white/20 rounded-full" style={{ animationDelay: '3s' }} />
      </div>


      <div className="relative z-40 container mx-auto px-4 lg:px-8 text-center pt-20 sm:pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Authority Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8 animate-premium-entrance">
            <TrendingUp size={16} className="text-gold sm:w-5 sm:h-5" />
            <span className="text-gold font-semibold text-sm sm:text-base">
              <span className="hidden sm:inline">247+ Successful Migrations • 5-Star Rated</span>
              <span className="sm:hidden">247+ Migrations • 5-Star</span>
            </span>
          </div>

          {/* Hook Transformation - Mobile optimized */}
          <h1 className="font-sora font-bold text-3xl sm:text-5xl lg:text-7xl text-white mb-6 sm:mb-8 animate-premium-entrance leading-tight px-2">
            Stop paying $600/month
            <br />
            <span className="text-gold drop-shadow-2xl">Own your automation for $50</span>
          </h1>
          
          {/* Problem + Solution - Mobile optimized */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/98 mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed animate-premium-entrance font-semibold px-4" style={{ animationDelay: '0.3s' }}>
            Transform your expensive SaaS automations into 
            <span className="text-gold bg-gold/20 px-2 py-1 rounded mx-1">unlimited, self-hosted workflows</span>
          </p>

          <p className="text-base sm:text-lg lg:text-xl text-white mb-8 sm:mb-12 max-w-4xl mx-auto animate-premium-entrance px-4" style={{ animationDelay: '0.4s' }}>
            Save $15,000+/year on automation costs. Get unlimited tasks, complete control, and enterprise security. Break even in 2 months.
          </p>


          {/* CTA Buttons - Mobile optimized */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-premium-entrance mb-6 sm:mb-8 px-4" style={{ animationDelay: '0.5s' }}>
            <Button 
              variant="cta" 
              size="lg"
              onClick={() => scrollToSection('quote-calculator')}
              className="group premium-shine text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 shadow-2xl hover:shadow-gold/50 transform hover:scale-105 transition-all duration-300"
            >
              <DollarSign className="mr-2" size={20} />
              Calculate My Exact Savings
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={18} />
            </Button>
            
            <Button 
              variant="cta" 
              size="lg"
              onClick={() => scrollToSection('calendly')}
              className="group premium-shine text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 shadow-2xl hover:shadow-gold/50 transform hover:scale-105 transition-all duration-300"
            >
              <Zap className="mr-2 group-hover:scale-110 transition-transform" size={18} />
              Get Free Migration Quote (Limited Spots)
            </Button>
          </div>

          {/* Risk Reversal - Mobile responsive */}
          <div className="mt-8 sm:mt-16 animate-premium-entrance px-4" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-white/20">
                <p className="text-success font-bold text-base sm:text-lg">✅ 30-Day Money-Back</p>
                <p className="text-white/80 text-xs sm:text-sm">Zero risk guarantee</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-white/20">
                <p className="text-success font-bold text-base sm:text-lg">✅ White-Glove Migration</p>
                <p className="text-white/80 text-xs sm:text-sm">We do everything for you</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-white/20">
                <p className="text-success font-bold text-base sm:text-lg">✅ 24/7 Priority Support</p>
                <p className="text-white/80 text-xs sm:text-sm">Direct access to experts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-gold/50 rounded-full flex justify-center bg-white/5 backdrop-blur-sm">
          <div className="w-1 h-4 bg-gold rounded-full mt-3 pulse-glow" />
        </div>
      </div>
    </section>
  );
};

export default Hero;