import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
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
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />
      
      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-animation absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full" style={{ animationDelay: '0s' }} />
        <div className="floating-animation absolute top-40 right-20 w-6 h-6 bg-accent/30 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="floating-animation absolute bottom-40 left-20 w-5 h-5 bg-white/15 rounded-full" style={{ animationDelay: '4s' }} />
        <div className="floating-animation absolute bottom-20 right-10 w-3 h-3 bg-accent/25 rounded-full" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-sora font-bold text-4xl sm:text-5xl lg:text-7xl text-white mb-6 animate-fade-in-up">
            Own & Scale Your Automations with 
            <span className="block text-accent mt-2">Flowstrate</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Migrate from Zapier & Make.com, strategise new workflows, and run them on your private n8n instance.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              variant="cta" 
              size="xl"
              onClick={() => scrollToSection('contact')}
              className="group"
            >
              Get Free Migration Quote
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            
            <Button 
              variant="outline-light" 
              size="xl"
              onClick={() => scrollToSection('calendly')}
              className="group"
            >
              <Play className="mr-2 group-hover:scale-110 transition-transform" size={20} />
              Book Strategy Call
            </Button>
          </div>

          <div className="mt-16 text-white/70 text-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <p>✨ Light, abstract animation of nodes connecting</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;