import { Button } from '@/components/ui/button';
import { Upload, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

const CTABanner = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 section-dark overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="floating-animation absolute top-10 left-10 w-6 h-6 bg-accent/20 rounded-full" style={{ animationDelay: '0s' }} />
        <div className="floating-animation absolute top-32 right-20 w-4 h-4 bg-white/10 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="floating-animation absolute bottom-20 left-20 w-8 h-8 bg-accent/15 rounded-full" style={{ animationDelay: '4s' }} />
        <div className="floating-animation absolute bottom-32 right-10 w-5 h-5 bg-white/5 rounded-full" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} />
              Ready to transform your automation stack?
            </div>
            
            <h2 className="font-sora font-bold text-4xl lg:text-6xl text-white mb-6">
              Ready to 
              <span className="text-accent"> Stack Shift?</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed">
              Join 128k+ developers who've transformed their automation costs while gaining 
              complete control with self-hosted n8n workflows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="cta" 
              size="xl"
              onClick={() => scrollToSection('enhanced-quote-calculator')}
              className="group min-w-[200px]"
            >
              <Upload className="mr-2 group-hover:scale-110 transition-transform" size={20} />
              Upload Workflow
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            
            <Button 
              variant="outline-light" 
              size="xl"
              onClick={() => scrollToSection('calendly')}
              className="group min-w-[200px]"
            >
              <MessageSquare className="mr-2 group-hover:scale-110 transition-transform" size={20} />
              Talk to a Strategist
            </Button>
          </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">400+</div>
                <div className="text-white/70">n8n Integrations</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">90%</div>
                <div className="text-white/70">Average Cost Reduction</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">100M+</div>
                <div className="text-white/70">Docker Pulls</div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;