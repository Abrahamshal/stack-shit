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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 animate-premium-entrance">
        <div className="bg-urgent/90 backdrop-blur-sm text-white px-6 py-2 rounded-full border border-urgent/50 urgency-pulse">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Clock size={16} className="animate-spin" />
            🔥 LIMITED: Only 12 Migration Slots Left This Month
          </span>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Authority Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2 mb-8 animate-premium-entrance">
            <TrendingUp size={20} className="text-gold" />
            <span className="text-gold font-semibold">$100M+ Automation Authority</span>
          </div>

          {/* Hook Transformation */}
          <h1 className="font-sora font-bold text-5xl sm:text-6xl lg:text-8xl text-white mb-8 animate-premium-entrance leading-tight">
            The <span className="text-gradient-premium">$2.4M</span>
            <br />
            <span className="text-gold">Automation Escape</span>
            <br />
            <span className="text-white">Plan</span>
          </h1>
          
          {/* Problem + Solution */}
          <p className="text-2xl lg:text-3xl text-white/95 mb-6 max-w-4xl mx-auto leading-relaxed animate-premium-entrance font-medium" style={{ animationDelay: '0.3s' }}>
            <span className="text-urgent font-bold">STOP</span> paying Zapier & Make.com 
            <span className="text-gold font-bold"> $2,400+/month</span> for limited automations
          </p>

          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto animate-premium-entrance" style={{ animationDelay: '0.4s' }}>
            Get <span className="text-gold font-bold">unlimited workflows</span>, 
            <span className="text-accent font-bold"> complete ownership</span>, and 
            <span className="text-success font-bold"> 90% cost savings</span> with your private n8n empire
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

          {/* CTA Stack */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-premium-entrance" style={{ animationDelay: '0.6s' }}>
            <Button 
              variant="cta" 
              size="xl"
              onClick={() => scrollToSection('contact')}
              className="group premium-shine"
            >
              <DollarSign className="mr-2" size={20} />
              Claim Your $2.4M Savings Plan
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            
            <Button 
              variant="outline-light" 
              size="xl"
              onClick={() => scrollToSection('calendly')}
              className="group"
            >
              <Zap className="mr-2 group-hover:scale-110 transition-transform" size={20} />
              Book Emergency Strategy Call
            </Button>
          </div>

          {/* Scarcity + Risk Reversal */}
          <div className="mt-12 space-y-4 animate-premium-entrance" style={{ animationDelay: '0.8s' }}>
            <p className="text-gold font-semibold text-lg">
              ⚡ Next Price Increase: January 15th (+40%)
            </p>
            <p className="text-white/80 text-sm">
              ✅ 30-Day Money-Back Guarantee | ✅ White-Glove Migration | ✅ 24/7 Priority Support
            </p>
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