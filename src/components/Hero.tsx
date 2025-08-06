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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent/90" />
      
      {/* Premium Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-animation absolute top-20 left-10 w-6 h-6 bg-gold/30 rounded-full pulse-glow" style={{ animationDelay: '0s' }} />
        <div className="floating-animation absolute top-40 right-20 w-8 h-8 bg-accent/40 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="floating-animation absolute bottom-40 left-20 w-5 h-5 bg-gold/25 rounded-full" style={{ animationDelay: '4s' }} />
        <div className="floating-animation absolute bottom-20 right-10 w-4 h-4 bg-accent/35 rounded-full" style={{ animationDelay: '1s' }} />
        <div className="floating-animation absolute top-1/2 left-1/4 w-3 h-3 bg-white/20 rounded-full" style={{ animationDelay: '3s' }} />
      </div>

      {/* Urgency Banner */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 animate-premium-entrance">
        <div className="bg-urgent/95 backdrop-blur-xl text-white px-8 py-3 rounded-full border border-urgent/70 urgency-pulse shadow-2xl">
          <span className="flex items-center gap-2 text-base font-bold">
            <Clock size={18} className="animate-spin" />
            🔥 CRITICAL: Only 7 Migration Slots Left This Month
          </span>
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-4 lg:px-8 text-center pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Authority Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2 mb-8 animate-premium-entrance">
            <TrendingUp size={20} className="text-gold" />
            <span className="text-gold font-semibold">$100M+ Automation Authority</span>
          </div>

          {/* Hook Transformation */}
          <h1 className="font-sora font-bold text-6xl sm:text-7xl lg:text-9xl text-white mb-12 animate-premium-entrance leading-[0.9] tracking-tight">
            The <span className="text-gradient-premium bg-gradient-to-r from-gold via-gold-light to-accent bg-clip-text text-transparent">$2.4M</span>
            <br />
            <span className="text-gold drop-shadow-2xl">Automation</span>
            <br />
            <span className="text-white drop-shadow-2xl">Escape Plan</span>
          </h1>
          
          {/* Problem + Solution */}
          <p className="text-3xl lg:text-4xl text-white/98 mb-8 max-w-5xl mx-auto leading-relaxed animate-premium-entrance font-bold" style={{ animationDelay: '0.3s' }}>
            <span className="text-urgent bg-urgent/20 px-3 py-1 rounded-lg">STOP</span> paying Zapier & Make.com 
            <span className="text-gold bg-gold/20 px-3 py-1 rounded-lg ml-2">$2,400+/month</span>
            <br />
            <span className="text-white/90 text-2xl lg:text-3xl mt-4 block">for basic automations that lock you in</span>
          </p>

          <p className="text-2xl lg:text-3xl text-white/95 mb-16 max-w-5xl mx-auto animate-premium-entrance font-semibold" style={{ animationDelay: '0.4s' }}>
            Get <span className="text-gold bg-gold/20 px-2 py-1 rounded">unlimited workflows</span>, 
            <span className="text-accent bg-accent/20 px-2 py-1 rounded mx-2">complete ownership</span>, and 
            <span className="text-success bg-success/20 px-2 py-1 rounded">90% cost savings</span>
            <br />
            <span className="text-white/90 text-xl lg:text-2xl mt-4 block">with your private n8n automation empire</span>
          </p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-premium-entrance" style={{ animationDelay: '0.5s' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
              <div className="text-2xl font-bold text-gold">247</div>
              <div className="text-white/80 text-sm">Migrations Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
              <div className="text-2xl font-bold text-success">$890K</div>
              <div className="text-white/80 text-sm">Average Yearly Savings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
              <div className="text-2xl font-bold text-accent">72h</div>
              <div className="text-white/80 text-sm">Migration Time</div>
            </div>
          </div>

          {/* Single, Focused CTA */}
          <div className="flex justify-center animate-premium-entrance mb-8" style={{ animationDelay: '0.6s' }}>
            <Button 
              variant="cta" 
              size="xl"
              onClick={() => scrollToSection('contact')}
              className="group premium-shine text-xl px-16 py-6 h-20 shadow-2xl hover:shadow-gold/50 transform hover:scale-110 transition-all duration-300"
            >
              <DollarSign className="mr-3" size={28} />
              CLAIM YOUR $2.4M SAVINGS PLAN
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={28} />
            </Button>
          </div>
          
          {/* Secondary CTA */}
          <div className="flex justify-center animate-premium-entrance" style={{ animationDelay: '0.7s' }}>
            <Button 
              variant="outline-light" 
              size="lg"
              onClick={() => scrollToSection('calendly')}
              className="group text-lg px-8"
            >
              <Zap className="mr-2 group-hover:scale-110 transition-transform" size={20} />
              Book Emergency Strategy Call (Free)
            </Button>
          </div>

          {/* Scarcity + Risk Reversal */}
          <div className="mt-16 space-y-6 animate-premium-entrance" style={{ animationDelay: '0.8s' }}>
            <div className="bg-urgent/20 backdrop-blur-sm border border-urgent/40 rounded-2xl px-8 py-4 max-w-2xl mx-auto">
              <p className="text-urgent font-bold text-xl">
                ⚡ URGENT: Next Price Increase January 15th (+40%)
              </p>
              <p className="text-white/90 text-lg mt-2">
                Lock in today's pricing before it's gone forever
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <p className="text-success font-bold text-lg">✅ 30-Day Money-Back</p>
                <p className="text-white/80 text-sm">Zero risk guarantee</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <p className="text-success font-bold text-lg">✅ White-Glove Migration</p>
                <p className="text-white/80 text-sm">We do everything for you</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <p className="text-success font-bold text-lg">✅ 24/7 Priority Support</p>
                <p className="text-white/80 text-sm">Direct access to experts</p>
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